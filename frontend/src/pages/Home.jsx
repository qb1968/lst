import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Home() {
  const [shows, setShows] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    axios
      .get("https://backend-silent-wildflower-3566.fly.dev/shows")
      .then((res) => {
        const today = new Date();
        const upcomingShows = res.data
          .filter((show) => new Date(show.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setShows(upcomingShows.slice(0, 60));
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-black text-white p-8">
      {/* Hero Section */}
      <div className="text-center mb-24 h-[80vh] flex flex-col justify-center items-center space-y-6">
        <img
          src="/images/lst.avif"
          alt="Liberty Showcase Theater Logo"
          className="w-auto h-96 mx-auto"
        />
        <p className="text-xl leading-relaxed">
          101 South Fayetteville St. <br />
          Liberty, NC 27298 <br />
          (336) 524-6822
        </p>

        <div className="mt-10">
          <Link
            to="https://thereidsvilleshowcase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src="/images/rst.avif"
              alt="Reidsville Showcase Theater"
              className="w-64 mx-auto mb-2 transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <p className="text-lg font-semibold">
            Click Here <br /> To View <br /> Reidsville Showcase Theater Shows
          </p>
        </div>
      </div>

      {/* Shows Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold mb-12 text-center">
          Coming Up in 2025
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {shows.map((show) => {
            const isExpanded = expandedId === show._id;

            return (
              <div
                key={show._id}
                className="border border-gray-300 rounded-lg shadow-lg bg-white text-black flex flex-col p-6 space-y-4 transition-all duration-300 hover:shadow-2xl"
              >
                {!isExpanded && (
                  <img
                    src={`https://backend-silent-wildflower-3566.fly.dev${show.image}`}
                    alt={show.title}
                    className="w-full h-80 object-contain rounded-md"
                  />
                )}

                <div className="text-center">
                  <h4 className="text-xl font-bold mb-1">{show.title}</h4>
                  <p className="text-sm font-semibold">
                    {format(new Date(show.date), "MMMM d, yyyy")} at{" "}
                    {format(new Date(`${show.date} ${show.time}`), "h:mm a")}
                  </p>
                  <p className="mt-1 text-base">{show.location}</p>
                </div>

                {isExpanded ? (
                  <>
                    <button
                      onClick={() => toggleExpand(show._id)}
                      className="text-red-600 text-2xl font-bold self-end"
                      aria-label="Close Info"
                    >
                      ×
                    </button>
                    <p className="text-gray-800">{show.description}</p>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpand(show._id)}
                      className="text-black font-semibold underline text-center"
                    >
                      More Info
                    </button>
                    <a
                      href={show.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gray-600 hover:bg-black text-white font-semibold px-4 py-2 rounded text-center transition"
                    >
                      Buy Tickets
                    </a>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/calendar"
            className="inline-block text-white underline text-lg hover:text-blue-300 transition"
          >
            View Full Calendar →
          </Link>
        </div>
      </div>
    </section>
  );
}
