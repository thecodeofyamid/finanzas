const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud como JSON

const db = new sqlite3.Database('./mydatabase.sqlite');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Transactions (id INTEGER PRIMARY KEY, description TEXT, price REAL, date TEXT, importance TEXT, type TEXT, category TEXT, ready TEXT, deadline TEXT)");
});

app.get('/transactions', (req, res) => {
  db.all("SELECT * FROM Transactions", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/add_transactions', (req, res) => {
    const { description, price, date, importance, type, category, ready, deadline } = req.body;

    db.run("INSERT INTO Transactions (description, price, date, importance, type, category, ready, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
           [description, price, date, importance, type, category, ready, deadline], 
           function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, description: description });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
