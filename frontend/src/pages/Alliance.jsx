import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import img1 from "../assets/alliance/img1.jpg";
import img2 from "../assets/alliance/img2.jpg";
import img3 from "../assets/alliance/img3.jpg";
import img4 from "../assets/alliance/img4.jpg";
import img5 from "../assets/alliance/img5.jpg";

const images = [img1, img2, img3, img4, img5];

export default function AllianceGallery() {
  const [index, setIndex] = useState(-1);

  return (
    <section className="min-h-screen bg-black text-white px-6 py-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-5xl md:text-6xl font-bold">The Alliance Center</h1>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
          Click any image to
          view in fullscreen.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-20">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
            onClick={() => setIndex(i)}
          >
            <img
              src={src}
              alt={`Alliance image ${i + 1}`}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-0 transition-opacity duration-300 rounded-md pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images.map((src) => ({ src }))}
      />

      {/* Google Map */}
      <div className="mt-24">
        <h2 className="text-3xl font-semibold text-center mb-6">Location</h2>
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="Alliance Center Map"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.6325713671235!2d-79.4318392!3d36.078065099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88532ba26b290b63%3A0x2213e1e9b7e50dca!2sAlliance%20Convention%20Center!5e0!3m2!1sen!2sus!4v1754513973663!5m2!1sen!2sus"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
