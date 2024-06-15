const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Ruta a la base de datos y al archivo de consultas
const dbFile = 'mydatabase.sqlite';
const sqlFile = 'query.sql';

// Leer el contenido del archivo SQL
const sql = fs.readFileSync(sqlFile, 'utf8');

// Conectar a la base de datos SQLite
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos SQLite');
});

// Dividir las consultas SQL por punto y coma para ejecutarlas una por una
const queries = sql.split(';').map(query => query.trim()).filter(query => query.length > 0);

// Ejecutar cada consulta y mostrar los resultados
queries.forEach((query, index) => {
    console.log(`\nEjecutando consulta ${index + 1}:\n${query}`);

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
        } else {
            console.log('Resultados:');
            console.log(JSON.stringify(rows, null, 2));
        }

        // Cerrar la conexión a la base de datos después de la última consulta
        if (index === queries.length - 1) {
            db.close((err) => {
                if (err) {
                    console.error('Error al cerrar la base de datos:', err.message);
                } else {
                    console.log('Base de datos cerrada');
                }
            });
        }
    });
});
