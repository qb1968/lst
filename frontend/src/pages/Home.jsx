import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Home() {
  const [shows, setShows] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    axios.get("https://lst-ys3v.onrender.com/shows").then((res) => {
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
    <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      {/* Hero Section */}
      <div className="text-center mb-24 h-[80vh] flex flex-col justify-center items-center space-y-6 animate-fadeIn">
        <img
          src="/images/lst.avif"
          alt="Liberty Showcase Theater Logo"
          className="w-auto h-96 mx-auto drop-shadow-lg"
        />
        <p className="text-xl leading-relaxed opacity-90">
          101 South Fayetteville St. <br />
          Liberty, NC 27298 <br />
          (336) 524-6822
        </p>

        <div className="mt-10">
          <Link
            to="https://thereidsvilleshowcase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <img
              src="/images/rst.avif"
              alt="Reidsville Showcase Theater"
              className="w-64 mx-auto mb-2 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-lg"
            />
          </Link>
          <p className="text-lg font-semibold">
            Click Here <br /> To View <br /> Reidsville Showcase Theater Shows
          </p>
        </div>

        <div className="text-center mb-10">
          <Link
            to="https://ci.ovationtix.com/36127/store/products"
            className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-yellow-500/40 transition-all"
          >
            <span role="img" aria-label="gift" className="text-2xl">
              🎁
            </span>
            <span>Gift Cards</span>
          </Link>
        </div>
      </div>

      {/* Shows Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl font-bold mb-12 text-center drop-shadow-lg">
          Upcoming Shows
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {shows.map((show) => {
            const isExpanded = expandedId === show._id;

            return (
             <div
  key={show._id}
  className="rounded-lg shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white flex flex-col p-6 space-y-4 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-black h-full"
>
  {!isExpanded && (
    <img
      src={`https://lst-ys3v.onrender.com${show.image}`}
      alt={show.title}
      className="w-full h-80 object-contain rounded-lg shadow-md"
    />
  )}

  <div className="text-center">
    <h4 className="text-xl font-semibold mb-1">{show.title}</h4>
    <p className="text-sm font-semibold text-white">
      {format(new Date(show.date), "MMMM d, yyyy")} at{" "}
      {format(new Date(`${show.date} ${show.time}`), "h:mm a")}
    </p>
    <p className="mt-1 text-base opacity-80 font-semibold">{show.location}</p>
  </div>

  {isExpanded ? (
    <>
      <button
        onClick={() => toggleExpand(show._id)}
        className="text-red-500 text-2xl font-bold self-end hover:scale-110 transition-transform"
        aria-label="Close Info"
      >
        ×
      </button>
      <p className="opacity-90">{show.description}</p>
    </>
  ) : (
    <div className="mt-auto flex flex-col space-y-2 items-center">
      <button
        onClick={() => toggleExpand(show._id)}
        className="font-semibold underline hover:text-black transition"
      >
        More Info
      </button>
      <a
        href={show.ticketLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center bg-gray-400 hover:bg-gray-500 text-black font-semibold px-4 py-2 rounded shadow-md transition-all hover:shadow-black/40"
      >
        Buy Tickets
      </a>
    </div>
  )}
</div>

            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/calendar"
            className="inline-block underline text-lg hover:text-yellow-300 transition"
          >
            View Full Calendar →
          </Link>
        </div>
      </div>
    </section>
  );
}
