import { Link } from "react-router-dom";

export default function Sponsors() {
  const sponsors = [
    { logo: "/sponsors/1.webp", website: "https://abcconstruction.com" },
    { logo: "/sponsors/2.webp", website: "https://libertybank.com" },
    { logo: "/sponsors/3.png" },
    { logo: "/sponsors/4.jpg", website: "https://mainstreetdiner.com" },
    { logo: "/sponsors/5.jpg" },
    { logo: "/sponsors/6.jpeg" },
    { logo: "/sponsors/7.png" },
    { logo: "/sponsors/8.jpg" },
    { logo: "/sponsors/9.jpg" },
    { logo: "/sponsors/10.jpg" },
    { logo: "/sponsors/11.jpg" },
    { logo: "/sponsors/12.jpg" },
    { logo: "/sponsors/13.jpg" },
    { logo: "/sponsors/14.jpg" },
  ];

  return (
    <section className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Our Sponsors
        </h2>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="relative overflow-hidden rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.alt}
                className="w-full rounded-xl"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold opacity-100 hover:opacity-0 transition-opacity">
                {sponsor.alt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}