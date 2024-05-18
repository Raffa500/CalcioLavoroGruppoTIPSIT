const mysql = require('mysql');

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Inserisci la password del tuo database se necessario
    database: 'calcio_db'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('Errore nel tentativo di connessione al database:', err);
      setTimeout(handleDisconnect, 2000);
    }
    console.log('Connesso al database MySQL come id ' + connection.threadId);
  });

  connection.on('error', function(err) {
    console.error('Errore nella connessione al database:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
