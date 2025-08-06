import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import img1 from "../assets/gallery/1.webp";
import img2 from "../assets/gallery/2.webp";
import img3 from "../assets/gallery/3.webp";
import img4 from "../assets/gallery/4.webp";
import img5 from "../assets/gallery/5.webp";
import img6 from "../assets/gallery/6.webp";
import img7 from "../assets/gallery/7.webp";
import img8 from "../assets/gallery/8.webp";
import img9 from "../assets/gallery/9.webp";
import img10 from "../assets/gallery/10.webp";
import img11 from "../assets/gallery/11.webp";

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
];

export default function Gallery() {
  const [index, setIndex] = useState(-1);

  return (
    <section className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">Gallery</h1>
      <p className="text-center mb-12 max-w-2xl mx-auto text-gray-300">
        Explore our space and atmosphere. Click on any image to view it in full
        screen.
      </p>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className="relative cursor-pointer group overflow-hidden rounded-xl shadow-lg"
          >
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-0 transition-opacity duration-300 pointer-events-none rounded-xl" />
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images.map((src) => ({ src }))}
      />
    </section>
  );
}
