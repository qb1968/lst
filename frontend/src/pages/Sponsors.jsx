import { Link } from "react-router-dom";

export default function Sponsors() {
  const sponsors = [
    {
      logo: "/sponsors/1.webp",
      website: "https://www.heartofnorthcarolina.com/",
    },
    { logo: "/sponsors/2.webp", website: "" },
    { logo: "/sponsors/3.png", website: "https://www.choicehotels.com" },
    { logo: "/sponsors/4.jpg", website: "https://www.seasonalcomfortinc.com/" },
    { logo: "/sponsors/5.jpg", website: "http://www.JDPowersRealtyLLC.com" },
    { logo: "/sponsors/6.jpeg", website: "" },
    { logo: "/sponsors/7.png", website: "" },
    { logo: "/sponsors/8.jpg", website: "" },
    { logo: "/sponsors/9.jpg", website: "" },
    { logo: "/sponsors/10.jpg", website: "https://crossoverbuildsnc.com/" },
    { logo: "/sponsors/11.jpg", website: "https://libertygroundsnc.com/" },
    { logo: "/sponsors/12.jpg", website: "https://ncpunchlist.com/" },
    { logo: "/sponsors/13.jpg", website: "https://ncbbqhof.com" },
    { logo: "/sponsors/14.jpg", website: "http://hurseysbarbq.com" },
  ];

  return (
    <section className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Our Sponsors
        </h2>

        {/* Masonry Layout with proper spacing */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6">
          {sponsors.map((sponsor, index) => {
            const card = (
              <div
                key={index}
                className="mb-6 break-inside-avoid relative overflow-hidden rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.alt || "Sponsor Logo"}
                  className="w-full rounded-xl"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold opacity-100 hover:opacity-0 transition-opacity">
                  {sponsor.alt}
                </div>
              </div>
            );

            if (sponsor.website?.startsWith("http")) {
              return (
                <a
                  key={index}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card}
                </a>
              );
            }

            if (sponsor.website) {
              return (
                <Link key={index} to={sponsor.website}>
                  {card}
                </Link>
              );
            }

            return card;
          })}
        </div>
      </div>
    </section>
  );
}
