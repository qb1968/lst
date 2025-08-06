const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// IMPORTANT: Use Render persistent disk path
const UPLOAD_DIR = "/data/uploads";

// Make sure the directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve uploaded images statically from the persistent uploads folder
app.use("/uploads", express.static(UPLOAD_DIR));

// Multer setup — save files to persistent disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

let shows = [];

app.get("/shows", (req, res) => res.json(shows));

// Create new show with image upload
app.post("/shows", upload.single("image"), (req, res) => {
  const { title, date, time, description, ticketLink, location } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  const show = {
    id: Date.now(),
    title,
    date,
    time,
    description,
    image,
    ticketLink,
    location: location || "101 S Fayetteville St, Liberty NC 27298",
  };

  shows.push(show);
  res.status(201).json(show);
});

// Update show, optionally new image
app.put("/shows/:id", upload.single("image"), (req, res) => {
  const id = Number(req.params.id);
  const index = shows.findIndex((s) => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Show not found" });

  const updatedShow = {
    ...shows[index],
    ...req.body,
  };

  if (req.file) {
    updatedShow.image = `/uploads/${req.file.filename}`;
  }

  shows[index] = updatedShow;
  res.json(updatedShow);
});

// Delete show
app.delete("/shows/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = shows.findIndex((s) => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Show not found" });

  shows.splice(index, 1);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
