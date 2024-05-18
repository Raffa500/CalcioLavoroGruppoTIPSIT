const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tuo-username',  // Cambia questo
  password: 'tua-password',  // Cambia questo
  database: 'calcio'
});

connection.connect(err => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    return;
  }
  console.log('Connesso al database MySQL.');
});

module.exports = connection;
