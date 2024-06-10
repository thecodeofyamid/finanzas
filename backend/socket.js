// Backend (Node.js con Express y Socket.IO)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({ origin: '*' }));
app.use(express.json());

const db = new sqlite3.Database('./mydatabase.sqlite');

app.post('/insertTransaction', (req, res) => {
    const { description, price, date, importance, type, category, ready, deadline } = req.body;
    const stmt = db.prepare('INSERT INTO Transactions (description, price, date, importance, type, category, ready, deadline, Users_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');
    stmt.run(description, price, date, importance, type, category, ready, deadline, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        io.emit('transactionInserted', { id: this.lastID, description, price, date, importance, type, category, ready, deadline });
        res.status(200).send('Transaction inserted');
    });
    stmt.finalize();
});

app.get('/transactions', (req, res) => {
    db.all('SELECT * FROM Transactions', (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(rows);
    });
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server running on port 4000');
});
