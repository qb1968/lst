import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaArrowUp } from "react-icons/fa";

// ...




const DEFAULT_LOCATION = "101 S Fayetteville St, Liberty NC 27298";

export default function Admin() {
  const [shows, setShows] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    ticketLink: "",
    location: DEFAULT_LOCATION,
  });
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setShowScrollButton(window.scrollY > 300);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);


  const fetchShows = () => {
    axios.get("http://localhost:5000/shows").then((res) => setShows(res.data));
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "location") data.append(key, value);
    });
    data.append(
      "location",
      useCustomLocation ? formData.location : DEFAULT_LOCATION
    );
    if (imageFile) data.append("image", imageFile);

    const url = `http://localhost:5000/shows${
      editingId ? `/${editingId}` : ""
    }`;
    const method = editingId ? axios.put : axios.post;

    method(url, data).then(() => {
      alert(editingId ? "Show updated" : "Show added");
      resetForm();
      fetchShows();
    });
  };

  const handleEdit = (show) => {
    setFormData({
      title: show.title,
      date: show.date,
      time: show.time,
      description: show.description,
      ticketLink: show.ticketLink,
      location: show.location || DEFAULT_LOCATION,
    });
    setUseCustomLocation(show.location !== DEFAULT_LOCATION);
    setEditingId(show.id);
    setImageFile(null);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this show?")) {
      axios
        .delete(`http://localhost:5000/shows/${id}`)
        .then(() => fetchShows());
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      description: "",
      ticketLink: "",
      location: DEFAULT_LOCATION,
    });
    setUseCustomLocation(false);
    setImageFile(null);
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">
        {editingId ? "Edit Show" : "Add New Show"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "date", "time", "description", "ticketLink"].map((field) => (
          <input
            key={field}
            type={
              field === "date" ? "date" : field === "time" ? "time" : "text"
            }
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full p-2 border rounded text-black"
            required
          />
        ))}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useCustomLocation}
            onChange={() => setUseCustomLocation(!useCustomLocation)}
          />
          <label className="text-white">Use custom location</label>
        </div>

        {useCustomLocation && (
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded text-black"
            required
          />
        )}

        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Show" : "Add Show"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 text-sm underline text-gray-300"
          >
            Cancel Editing
          </button>
        )}
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4 text-white">All Shows</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shows.map((show) => (
          <div
            key={show.id}
            className="border p-4 rounded shadow text-white bg-gray-800"
          >
            <img
              src={`http://localhost:5000${show.image}`}
              alt={show.title}
              className="w-full h-72 object-contain rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{show.title}</h3>
            <p className="text-sm font-semibold mb-2 text-center">
              {format(new Date(show.date), "MM/dd/yyyy")} at{" "}
              {format(new Date(`${show.date} ${show.time}`), "h:mm a")}
            </p>
            <p className="text-sm italic text-gray-300">{show.location}</p>
            <p>{show.description}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(show)}
                className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(show.id)}
                className="px-2 py-1 text-sm bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showScrollButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300"
          title="Back to Top"
        >
          <FaArrowUp className="text-lg" />
        </button>
      )}
    </div>
  );
}
