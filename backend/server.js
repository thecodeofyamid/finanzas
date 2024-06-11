const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { WebSocketServer } = require('ws');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

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
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const newTransaction = { id: this.lastID, description, price, date, importance, type, category, ready, deadline };
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify(newTransaction));
                }
            });
            res.json(newTransaction);
        });
});

const server = app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('WebSocket connected');
    ws.on('message', message => {
        console.log(`Received message: ${message}`);
    });
});
