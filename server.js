const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Temporary notes storage
let notes = [];

/* GET all notes */
app.get("/notes", (req, res) => {
  res.json(notes);
});

/* ADD new note */
app.post("/notes", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Note text required" });
  }

  notes.push(text);
  res.json({ message: "Note added successfully" });
});

/* Root test */
app.get("/", (req, res) => {
  res.send("Notes API is working 🚀");
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
