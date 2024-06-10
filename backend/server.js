const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Habilitar CORS
app.use(cors({
    origin:'*'
}));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./mydatabase.sqlite'); // o usa el nombre del archivo si quieres una base de datos persistente

// Crear una tabla de ejemplo
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nombre TEXT)");
});

// Ruta para obtener todos los usuarios
app.get('/transactions', (req, res) => {
  db.all("SELECT * FROM Transactions", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Ruta para agregar un usuario
// app.post('/add_transactions', (req, res) => {
//   const nombre = req.body.nombre; // Suponiendo que se envía el nombre en el cuerpo de la solicitud

//   db.run("INSERT INTO usuarios (nombre) VALUES (?)", nombre, function(err) {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json({ id: this.lastID, nombre: nombre });
//   });
// });

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
