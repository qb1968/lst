const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set this in your env variables


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// MongoDB Show schema/model
const showSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  description: String,
  image: String,
  ticketLink: String,
  location: String,
});
const Show = mongoose.model("Show", showSchema);

// Uploads directory inside Fly.io volume
const UPLOAD_DIR = "/data/uploads";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

// Multer file storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * ROUTES
 */

// Get all shows
app.get("/shows", async (req, res) => {
  try {
    const shows = await Show.find().sort({ date: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new show
app.post("/shows", upload.single("image"), async (req, res) => {
  try {
    const { title, date, time, description, ticketLink, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const show = new Show({
      title,
      date,
      time,
      description,
      image,
      ticketLink,
      location: location || "101 S Fayetteville St, Liberty NC 27298",
    });

    await show.save();
    res.status(201).json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a show
app.put("/shows/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (req.file) {
      update.image = `/uploads/${req.file.filename}`;
    }

    const updatedShow = await Show.findByIdAndUpdate(id, update, { new: true });
    if (!updatedShow) return res.status(404).json({ error: "Show not found" });

    res.json(updatedShow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a show
app.delete("/shows/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Show.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Show not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Image upload route for frontend
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Mass email sending route for frontend
app.post("/api/send-mass-email", async (req, res) => {
  const { emails, subject, body } = req.body;
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: "No emails provided" });
  }
  if (!subject || !body) {
    return res.status(400).json({ error: "Subject and body are required" });
  }

  try {
    const messages = emails.map(email => ({
      to: email,
      from: process.env.SENDGRID_SENDER || "your-email@domain.com",
      subject,
      html: body,
    }));

    await sgMail.send(messages);
    res.json({ message: "Bulk emails sent successfully" });
  } catch (error) {
    console.error("SendGrid error:", error);
    res.status(500).json({ error: "Failed to send bulk emails" });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
