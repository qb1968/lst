import { Link } from "react-router-dom";

export default function Sponsors() {
  const sponsors = [
    {
      logo: "/sponsors/1.webp",
      website: "https://abcconstruction.com",
    },
    {
      logo: "/sponsors/2.webp",
      website: "https://libertybank.com",
    },
    {
      logo: "/sponsors/3.png",
    },
    {
      logo: "/sponsors/4.jpg",
      website: "https://mainstreetdiner.com",
    },
    {
      logo: "/sponsors/5.jpg",
    },
    {
      logo: "/sponsors/6.jpeg",
    },
    {
      logo: "/sponsors/7.png",
    },
    
    // Add more sponsors here
  ];

  return (
    <section className=" py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-6">Our Sponsors</h1>
        <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
          These amazing sponsors support our mission and community. Click to learn more!
        </p>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col items-center text-center hover:shadow-xl transition"
            >
              {sponsor.website ? (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-full h-48 object-contain p-4"
                  />
                </a>
              ) : (
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-full h-48 object-contain p-4"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {sponsor.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}