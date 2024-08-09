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

// Share the db connection across all requests
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.get('/transactions', (req, res) => {
    const date_now = new Date();
    const month = date_now.getMonth() + 1; // getMonth() devuelve 0 para enero, así que sumamos 1
    console.log("MES: ", month);

    // Consulta SQL usando el mes actual
    db.all("SELECT * FROM Transactions", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/transactions/:month', (req, res) => {
    const month = parseInt(req.params.month, 10);
    console.log("MES: ", month);

    // Consulta SQL usando el mes actual
    db.all("SELECT * FROM Transactions WHERE strftime('%m', date) = ?", [month.toString().padStart(2, '0')], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { price, description, date, importance } = req.body;

    // Construir la consulta UPDATE
    let sql = 'UPDATE Transactions SET';
    const params = [];

    // Añadir las columnas a actualizar si están presentes en la solicitud
    if (price !== undefined) {
        sql += ' price = ?,';
        params.push(price);
    }

    if (description !== undefined) {
        sql += ' description = ?,';
        params.push(description);
    }

    if (date !== undefined) {
        sql += ' date = ?,';
        params.push(date);
    }

    if (importance !== undefined) {
        sql += ' importance = ?,';
        params.push(importance);
    }
    // Eliminar la coma final y agregar la condición WHERE
    sql = sql.slice(0, -1);  // Eliminar la última coma
    sql += ' WHERE id = ?';
    params.push(id);

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error executing query:', err.message);
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }

            db.run('COMMIT');
            ws.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ action: 'edit', transaction: { id } }));
                }
            });

            console.log('Transaction edited:', id);
            res.json({ message: 'Transaction edited: ', transaction: { id } });
        });
    });
});


app.post('/ready/:type/:id/:state', (req, res) => {
    const type = req.params.type;
    const id = Number(req.params.id);
    const state = req.params.state;

    const sql1 = `UPDATE Transactions SET ready = ? WHERE id = ?`;
    const sql2 = `UPDATE ${type} SET ready = ? WHERE Transactions_id = ?`;

    // Ejecutar ambas consultas dentro de una transacción
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run(sql1, [state, id], function (err) {
            if (err) {
                console.error('Error al actualizar la transacción:', err);
                return res.status(500).json({ error: 'Error interno al actualizar la transacción' });
            }

            console.log(`Estado de ${type} actualizado: ${this.changes}`);
        });

        db.run(sql2, [state, id], function (err) {
            if (err) {
                console.error('Error al actualizar la transacción:', err);
                return res.status(500).json({ error: 'Error interno al actualizar la transacción' });
            }

            console.log(`Estado de ${type} actualizado: ${this.changes}`);
            
            // Solo enviar una respuesta después de completar ambas actualizaciones
            res.json({ mensaje: `${type} actualizado correctamente`, cambios: this.changes });
        });

        db.run('COMMIT');
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
            ws.send(JSON.stringify({ action: 'verificar', precioDolar: 0 }));
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
