const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const app = express();
const server = https.createServer({
  cert: fs.readFileSync('./cert.pem'),
  key: fs.readFileSync('./key.pem')
}, app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());

// Inicializar la base de datos SQLite
const dbPath = path.resolve(__dirname, './', 'mydatabase.sqlite'); 
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Función para emitir un mensaje a todos los clientes WebSocket
const broadcastMessage = (message) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Rutas
app.get('/users', (req, res) => {
  db.all('SELECT * FROM Users', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.get('/transactions', (req, res) => {
  db.all('SELECT * FROM Transactions', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.get('/compras', (req, res) =>{
  db.all('SELECT * FROM Buys INNER JOIN Transactions ON Buys.Transactions_id = Transactions.id;', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// Ruta para insertar datos
app.post('/insert', (req, res) => {
  const { table, data } = req.body;
  let placeholders = Object.keys(data).map(() => '?').join(',');
  let sql = `INSERT INTO ${table} (${Object.keys(data).join(',')}) VALUES (${placeholders})`;

  db.run(sql, Object.values(data), function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    // Emitir un mensaje a todos los clientes WebSocket
    broadcastMessage(JSON.stringify({ table, data }));

    res.status(201).json({ id: this.lastID });
  });
});

// Configuración del WebSocket
wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  ws.send('Bienvenido al servidor WebSocket');
});

server.listen(3001, '0.0.0.0', () => {
  console.log(`Server running at https://0.0.0.0:3001/`);
});
