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

// MongoDB Show schema/model (existing)
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

// New schema/model for email templates
const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  design: { type: Object, required: true }, // JSON design from email editor
  createdAt: { type: Date, default: Date.now },
});
const Template = mongoose.model("Template", templateSchema);

// New schema/model for email lists
const emailListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emails: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
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

// Multer file storage config (existing)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * ROUTES
 */

// Existing show routes here (unchanged)...

// Template routes
app.post("/api/save-template", async (req, res) => {
  const { name, design } = req.body;
  if (!name || !design)
    return res.status(400).json({ error: "Name and design required" });

  try {
    const template = new Template({ name, design });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/get-templates", async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/delete-template/:id", async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Template not found" });
    res.json({ message: "Template deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email list routes
app.post("/api/save-email-list", async (req, res) => {
  const { name, emails } = req.body;
  if (!name || !emails || !Array.isArray(emails) || emails.length === 0)
    return res.status(400).json({ error: "Name and emails array required" });

  try {
    const emailList = new EmailList({ name, emails });
    await emailList.save();
    res.status(201).json(emailList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/get-email-lists", async (req, res) => {
  try {
    const lists = await EmailList.find().sort({ createdAt: -1 });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/delete-email-list/:id", async (req, res) => {
  try {
    const deleted = await EmailList.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Email list not found" });
    res.json({ message: "Email list deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Existing routes for upload image and send mass email (unchanged)...

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
