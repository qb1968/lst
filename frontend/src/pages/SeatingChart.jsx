// src/pages/SeatingChart.jsx
 // update path if different

export default function SeatingChart() {
  return (
    <section className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Seating Chart</h1>
      <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg max-w-5xl w-full">
        <img
          src="/images/seating.avif"
          alt="Seating Chart"
          className="rounded-xl w-full object-contain"
        />
      </div>
    </section>
  );
}
