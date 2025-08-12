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

// New schema/model for Email Templates
const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  design: { type: Object, required: true }, // The JSON design from email editor
});
const Template = mongoose.model("Template", templateSchema);

// New schema/model for Email Lists
const emailListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emails: { type: [String], required: true },
});
const EmailList = mongoose.model("EmailList", emailListSchema);

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

// Shows routes (existing)
app.get("/shows", async (req, res) => {
  try {
    const shows = await Show.find().sort({ date: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// Upload image route (existing)
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Mass email sending route (existing)
app.post("/api/send-mass-email", async (req, res) => {
  const { emails, subject, body } = req.body;
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: "No emails provided" });
  }
  if (!subject || !body) {
    return res.status(400).json({ error: "Subject and body are required" });
  }

  try {
    const messages = emails.map((email) => ({
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

/**
 * New Template routes
 */

// Save a new template
app.post("/api/save-template", async (req, res) => {
  try {
    const { name, design } = req.body;
    if (!name || !design) {
      return res.status(400).json({ error: "Name and design are required" });
    }
    const template = new Template({ name, design });
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all templates
app.get("/api/get-templates", async (req, res) => {
  try {
    const templates = await Template.find().sort({ _id: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a template by ID
app.delete("/api/delete-template/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Template.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Template not found" });
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * New Email List routes
 */

// Save a new email list
app.post("/api/save-email-list", async (req, res) => {
  try {
    const { name, emails } = req.body;
    if (!name || !emails || !Array.isArray(emails)) {
      return res
        .status(400)
        .json({ error: "Name and emails array are required" });
    }
    const list = new EmailList({ name, emails });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all email lists
app.get("/api/get-email-lists", async (req, res) => {
  try {
    const lists = await EmailList.find().sort({ _id: -1 });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an email list by ID
app.delete("/api/delete-email-list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await EmailList.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ error: "Email list not found" });
    res.json({ message: "Email list deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
