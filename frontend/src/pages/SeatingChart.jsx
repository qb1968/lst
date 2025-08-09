export default function SeatingChart() {
  const imageUrl = "/images/seating.avif";

  return (
    <section className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Seating Chart</h1>
      <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg max-w-5xl w-full">
        <img
          src={imageUrl}
          alt="Seating Chart"
          className="rounded-xl w-full object-contain"
        />
      </div>
      
      {/* Download Button */}
      <a
        href={imageUrl}
        download="SeatingChart.avif"
        className="mt-6 inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Download Seating Chart
      </a>
    </section>
  );
}
