import { useEffect, useState } from "react";
import axios from "axios";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
  parseISO,
  isValid,
  parse,
} from "date-fns";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axios
      .get("https://backend-silent-wildflower-3566.fly.dev/shows")
      .then((res) => {
        const parsed = res.data
          .map((show) => {
            // Parse ISO date string
            const parsedDate = parseISO(show.date);
            if (!isValid(parsedDate)) return null;
            return {
              ...show,
              date: parsedDate,
            };
          })
          .filter(Boolean);
        setShows(parsed);
      });
  }, []);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="text-white px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
      >
        ←
      </button>
      <h2 className="text-xl font-bold text-white">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="text-white px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
      >
        →
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const start = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-gray-400">
          {format(addDays(start, i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const formatTime = (timeStr) => {
    // Try parsing 24-hour time like "19:00"
    // If already in 12-hr (with AM/PM), parsing will fail and we fallback
    try {
      const parsedTime = parse(timeStr, "HH:mm", new Date());
      if (isValid(parsedTime)) return format(parsedTime, "h:mm a");
    } catch {}
    return timeStr; // fallback: return original string
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayShows = shows.filter((show) => isSameDay(show.date, day));
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day}
            className={`p-2 border h-36 overflow-auto text-xs rounded ${
              !isSameMonth(day, monthStart) ? "opacity-40" : ""
            } ${
              isToday
                ? "border-yellow-400 border-2 bg-black"
                : "border-gray-700 bg-gray-900"
            }`}
          >
            <div className="font-semibold text-sm mb-1 text-white">
              {format(day, "d")}
            </div>
            {dayShows.map((show) => (
              <div key={show.id} className="mb-1">
                <img
                  src={`https://backend-silent-wildflower-3566.fly.dev${show.image}`}
                  alt={show.title}
                  className="w-full h-16 object-contain rounded mb-1"
                />
                <a
                  href={show.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline block text-xs"
                >
                  {show.title}
                </a>
                <p className="text-white text-xs italic">
                  {formatTime(show.time)}
                </p>
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={day} className="grid grid-cols-7 gap-2 mb-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <section className="p-6 max-w-6xl mx-auto text-white bg-black min-h-screen">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </section>
  );
}
