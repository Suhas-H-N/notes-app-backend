const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'notes.json');

app.use(cors());
app.use(express.json());

function readNotes() {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeNotes(notes) {
  fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2));
}

function nextId(notes) {
  return notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
}

// GET all
app.get('/notes', (req, res) => {
  res.json(readNotes());
});

// GET one
app.get('/notes/:id', (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// POST create
app.post('/notes', (req, res) => {
  const notes = readNotes();
  const { title, text, category, pinned } = req.body;
  const note = {
    id: nextId(notes),
    title: title || '',
    text: text || '',
    category: category || 'personal',
    pinned: !!pinned,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.unshift(note);
  writeNotes(notes);
  res.status(201).json(note);
});

// PUT update
app.put('/notes/:id', (req, res) => {
  const notes = readNotes();
  const idx = notes.findIndex(n => n.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  notes[idx] = {
    ...notes[idx],
    ...req.body,
    id: notes[idx].id,
    createdAt: notes[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeNotes(notes);
  res.json(notes[idx]);
});

// DELETE
app.delete('/notes/:id', (req, res) => {
  let notes = readNotes();
  const exists = notes.find(n => n.id === parseInt(req.params.id));
  if (!exists) return res.status(404).json({ error: 'Note not found' });
  notes = notes.filter(n => n.id !== parseInt(req.params.id));
  writeNotes(notes);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✦ Notely server running at http://localhost:${PORT}`);
});