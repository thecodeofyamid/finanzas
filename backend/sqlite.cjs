const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Inicializar la base de datos SQLite
const dbPath = path.resolve(__dirname, './', 'mydb.db'); // Ajusta el nombre de tu base de datos si es necesario
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Rutas
app.get('/compras', (req, res) => {
  db.all('SELECT * FROM compras', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.listen(3001, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${3001}/`)
});