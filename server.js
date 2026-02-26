const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ===== SCHEMA =====
const noteSchema = new mongoose.Schema(
  {
    title:    { type: String, default: '' },
    text:     { type: String, default: '' },
    category: { type: String, enum: ['personal', 'work', 'ideas', 'important'], default: 'personal' },
    pinned:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

// ===== ROUTES =====

// GET all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ pinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single note
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create note
app.post('/notes', async (req, res) => {
  try {
    const { title, text, category, pinned } = req.body;
    const note = await Note.create({ title, text, category, pinned });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update note
app.put('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE note
app.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`✦ Notely server running at http://localhost:${PORT}`);
});