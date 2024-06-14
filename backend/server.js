const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { WebSocketServer, WebSocket } = require('ws');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./mydatabase.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        price REAL,
        date TEXT,
        importance TEXT,
        type TEXT,
        category TEXT,
        ready INTEGER,
        deadline TEXT,
        Users_id INTEGER,
        FOREIGN KEY(Users_id) REFERENCES Users(id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Incomes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        Transactions_id INTEGER,
        FOREIGN KEY(Transactions_id) REFERENCES Transactions(id)
    )`);
    
    // Similar for Expenses, Buys, Debts
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
    const { description, price, date, importance, type, category, ready, deadline, Users_id } = req.body;
    db.run(`INSERT INTO Transactions (description, price, date, importance, type, category, ready, deadline, Users_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [description, price, date, importance, type, category, ready, deadline, Users_id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const newTransaction = { id: this.lastID, description, price, date, importance, type, category, ready, deadline, Users_id };

            // Notify WebSocket clients
            ws.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(newTransaction));
                }
            });
            res.json(newTransaction);
        });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const ws = new WebSocketServer({ server });

ws.on('connection', ws => {
    console.log('WebSocket connected');
    ws.send(JSON.stringify({ message: 'Hola cliente ❤✨' }));
    ws.on('error', error => console.error('WebSocket error:', error));
    ws.on('message', message => console.log(`Message from Client: ${message}`));
    ws.on('close', () => console.log('WebSocket connection closed'));
});
