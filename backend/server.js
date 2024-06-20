const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { WebSocketServer, WebSocket } = require('ws');
const { verificarClasePromedioVerde } = require('./scrapping');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;
const URL_SITIO_WEB = 'https://www.google.com/finance/quote/USD-COP?sa=X&ved=2ahUKEwj66qj7wN6GAxX6cDABHa9lAKQQmY0JegQIBxAw'; // Ajusta la URL

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
    
    // Similar para Expenses, Buys, Debts
});

app.get('/transactions', (req, res) => {
    db.all("SELECT * FROM Transactions", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/edit/:id', (req, res) => {
    const id = req.params.id;  // Obtener el id de los parámetros

    const { price, description } = req.body;

    // Construir la consulta UPDATE inicial
    let sql = `UPDATE Transactions SET`;
    const params = [];

    // Verificar y agregar el precio si está presente en la solicitud
    if (price !== undefined) {
        sql += ` price = ?,`;
        params.push(price);
    }

    // Verificar y agregar la descripción si está presente en la solicitud
    if (description !== undefined) {
        sql += ` description = ?,`;
        params.push(description);
    }

    // Eliminar la coma adicional al final de la consulta UPDATE
    sql = sql.slice(0, -1);

    // Agregar la condición WHERE para el ID
    sql += ` WHERE id = ?`;
    params.push(id);

    // Ejecutar la consulta UPDATE con los parámetros apropiados
    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            console.warn('Transaction not found:', id);
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Notificar a los clientes WebSocket
        ws.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action: 'edit', transaction: { id } }));
            }
        });

        console.log('Transaction edited:', id);
        res.json({ message: 'Transaction edited', transaction: { id } });
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

            // Notificar a los clientes de WebSocket
            ws.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ action: 'add', transaction: newTransaction }));
                }
            });
            res.json(newTransaction);
        });
});

app.post('/delete_transaction', (req, res) => {
    const { id } = req.body;

    db.run(`DELETE FROM Transactions WHERE id = ?`, [id], function(err) {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            console.warn('Transaction not found:', id);
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Notificar a los clientes de WebSocket
        ws.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action: 'delete', transaction: { id } }));
            }
        });

        console.log('Transaction deleted:', id);
        res.json({ message: 'Transaction deleted', transaction: { id } });
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const ws = new WebSocketServer({ server });

ws.on('connection', async (ws) => {
    console.log('WebSocket connected');

    ws.on('error', error => console.error('WebSocket error:', error));

    try {
        const precioDolar = await verificarClasePromedioVerde(URL_SITIO_WEB);
        if (precioDolar !== null) {
            ws.send(JSON.stringify({ action: 'verificar', precioDolar }));
            console.log(`Sent message to client: ${precioDolar}`);
        } else {
            ws.send(JSON.stringify({ action: 'verificar', precioDolar: 'No se encontró el precio del dólar.' }));
            console.log('No se encontró el precio del dólar.');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
        ws.send(JSON.stringify({ action: 'error', error: error.message }));
    }

    ws.on('message', (message) => {
        console.log(`Message from Client: ${message}`);
    });

    ws.on('close', () => console.log('WebSocket connection closed'));
});
