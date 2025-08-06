import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Contact() {
  // Controlled state for all form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSubmitted(false);

    try {
      const response = await fetch("https://submit-form.com/0hMwosraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const errorText = await response.text();
        setErrorMsg("Submission failed. Please try again.");
        console.error("Submit error:", errorText);
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-center mb-12 text-gray-300 leading-relaxed text-lg max-w-3xl mx-auto">
          We love our customers, so feel free to visit during a show to purchase
          tickets for future events. Note: the theater is only open during
          shows. No mail is accepted at this address.
        </p>
        <p className="text-center mb-16 text-lg text-gray-400 font-bold">
          Business Office: Brown Entertainment LLC, 6701 S. NC Hwy 49,
          Burlington, NC 27215
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-xl shadow-lg text-black"
            noValidate
          >
            {submitted && (
              <div className="bg-green-100 text-green-700 p-4 rounded text-center font-semibold">
                Thank you! Your message has been sent.
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-100 text-red-700 p-4 rounded text-center font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 font-medium text-gray-700 mb-1"
              >
                <FaUser /> Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 font-medium text-gray-700 mb-1"
              >
                <FaEnvelope /> Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="flex items-center gap-2 font-medium text-gray-700 mb-1"
              >
                <FaPhone /> Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="flex items-center gap-2 font-medium text-gray-700 mb-1"
              >
                <FaComment /> Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-black text-white px-6 py-2 rounded-lg transition-all w-full font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="space-y-10 text-gray-300 text-lg">
            <div>
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-white">
                <FaMapMarkerAlt /> Theater Address
              </h2>
              <p>
                The Liberty Showcase Theater
                <br />
                101 South Fayetteville Street
                <br />
                Liberty, NC 27298
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-white">
                <FaPhoneAlt /> Phone
              </h2>
              <p>(336) 524-6822</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-white">
                <FaEnvelope /> Email
              </h2>
              <p>info@thelibertyshowcase.com</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-6">Our Location</h2>
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              title="Theater Location Map"
              className="w-full h-full"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.6325713671235!2d-79.4318392!3d36.078065099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88532ba26b290b63%3A0x2213e1e9b7e50dca!2sAlliance%20Convention%20Center!5e0!3m2!1sen!2sus!4v1754513973663!5m2!1sen!2sus"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
