const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./wordsDB.sqlite', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the wordsDB SQLite database.');
});

// Endpoint to get words
app.get('/words', (req, res) => {
  db.all("SELECT word FROM words", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
