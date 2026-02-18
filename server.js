const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/notesDB")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// 📝 Note Schema
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", noteSchema);

// 📥 GET all notes
app.get("/notes", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

// ➕ POST new note
app.post("/notes", async (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) return res.status(400).json({ error: "Title and text required" });

  const newNote = new Note({ title, text });
  await newNote.save();
  res.json(newNote);
});

// 🗑 DELETE note by ID
app.delete("/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});