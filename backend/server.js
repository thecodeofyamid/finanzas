const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { WebSocketServer, WebSocket } = require('ws');
const bodyParser = require('body-parser');

// Creando app express y definiendo un puerto
const app = express();
const PORT = process.env.PORT || 4000;

// Configurando CORS
app.use(cors());
app.use(bodyParser.json());

// Accediendo a la base de datos SQLite
const db = new sqlite3.Database('./mydatabase.sqlite');

// Creación de la tabla Transactions si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Transactions (id INTEGER PRIMARY KEY, description TEXT, price REAL, date TEXT, importance TEXT, type TEXT, category TEXT, ready TEXT, deadline TEXT)");
});

// Ruta para consultar todas las transacciones realizadas
app.get('/transactions', (req, res) => {
    db.all("SELECT * FROM Transactions", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Ruta para agregar nuevas transacciones
app.post('/add_transactions', (req, res) => {
    const { description, price, date, importance, type, category, ready, deadline } = req.body;
    db.run("INSERT INTO Transactions (description, price, date, importance, type, category, ready, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [description, price, date, importance, type, category, ready, deadline],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const newTransaction = { id: this.lastID, description, price, date, importance, type, category, ready, deadline };

            // Enviar la nueva transacción a todos los clientes conectados por WebSocket
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(newTransaction));
                }
            });
            res.json(newTransaction);
        });
});

// Inicia el servidor Express
const server = app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});

// WebSocket Server configuración
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('WebSocket connected');

    // Manejo de errores
    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });

    // Envía un mensaje de ping periódicamente para mantener la conexión activa
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000); // Envía un ping cada 30 segundos

    // Maneja los mensajes entrantes
    ws.on('message', message => {
        console.log(`Received message: ${message}`);
        ws.send('Hello client ☀️🍀')
        // Procesa los mensajes entrantes
    });

    // Detiene el intervalo de ping cuando se cierra la conexión
    ws.on('close', () => {
        console.log('WebSocket connection closed');
        clearInterval(pingInterval);
    });
});
