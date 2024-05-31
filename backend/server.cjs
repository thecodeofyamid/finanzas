const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());


//configuracion
const db = mysql.createConnection({
  host: 'localhost',
  user: 'pc_egakat',
  password: 'Y18h06R_2022',
  database: 'consultas_tarot'
})

//Conexión
db.connect((err)=>{
  if (err){
    console.error("Error al conectar a MySQL: ",err)
  }else{
    console.log("Conexión éxitosa a MySQL")
  }
})

// Rutas
app.get('/consultantes', (req, res) => {
  const query = 'SELECT * FROM inquerir';
  db.query(query, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${3000}/`)});