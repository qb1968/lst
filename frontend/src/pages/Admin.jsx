import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaArrowUp } from "react-icons/fa";
import EmailEditor from "react-email-editor";

// MassEmailAds component (inline here for convenience)
function MassEmailAds() {
  const [emailList, setEmailList] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const emailEditorRef = useRef(null);

  // Image upload handler for react-email-editor
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://lst-ys3v.onrender.com/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.url) {
        return { data: { link: data.url } };
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      return Promise.reject(error);
    }
  };

  const handleSendEmails = () => {
    setSending(true);
    setMessage("");

    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { html } = data;

      const payload = {
        emails: emailList.split(",").map((e) => e.trim()),
        subject,
        body: html,
      };

      try {
        const response = await fetch(
          "https://lst-ys3v.onrender.com/api/send-mass-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          setMessage("Emails sent successfully!");
        } else {
          setMessage("Failed to send emails.");
        }
      } catch (error) {
        setMessage("Error sending emails.");
      } finally {
        setSending(false);
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mass Email Ads</h2>

      <label className="block mb-2">
        Recipient Emails (comma separated)
        <textarea
          className="w-full border p-2 rounded"
          rows={4}
          value={emailList}
          onChange={(e) => setEmailList(e.target.value)}
        />
      </label>

      <label className="block mb-4">
        Subject
        <input
          className="w-full border p-2 rounded"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      <label className="block mb-6 font-semibold">Create Your Flier:</label>
      <div className="h-[700px] w-full max-w-[900px] mx-auto">
        <EmailEditor
          ref={emailEditorRef}
          tools={{
            image: {
              uploadFile: uploadImage,
            },
          }}
        />
      </div>

      <button
        onClick={handleSendEmails}
        disabled={sending}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Emails"}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

// Your existing Admin component (slightly adapted here)
function Admin() {
  const DEFAULT_LOCATION = "101 S Fayetteville St, Liberty NC 27298";

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
    axios
      .get("https://lst-ys3v.onrender.com/shows")
      .then((res) => setShows(res.data));
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

    const url = `https://lst-ys3v.onrender.com/shows${
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
    setEditingId(show._id);
    setImageFile(null);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this show?")) {
      axios
        .delete(`https://lst-ys3v.onrender.com/shows/${id}`)
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
            key={show._id}
            className="border p-4 rounded shadow text-white bg-gray-800"
          >
            <img
              src={`https://lst-ys3v.onrender.com${show.image}`}
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
                onClick={() => handleDelete(show._id)}
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

// Main AdminTabs component with tabs for Admin and Mass Email
export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState("admin");

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("admin")}
          className={`py-2 px-6 -mb-px border-b-2 font-medium transition-colors duration-200 ${
            activeTab === "admin"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
        >
          Admin
        </button>

        <button
          onClick={() => setActiveTab("mass-email")}
          className={`py-2 px-6 -mb-px border-b-2 font-medium transition-colors duration-200 ${
            activeTab === "mass-email"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
        >
          Mass Email Ads
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "admin" && <Admin />}
        {activeTab === "mass-email" && <MassEmailAds />}
      </div>
    </div>
  );
}
