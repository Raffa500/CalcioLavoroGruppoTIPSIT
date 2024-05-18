const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'calcio_db'
});

connection.connect(err => {
  if (err) {
    console.error('Errore di connessione al database:', err.stack);
    return;
  }
  console.log('Connesso al database MySQL come id ' + connection.threadId);
});

connection.on('error', function(err) {
  console.error('Errore nella connessione al database:', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    handleDisconnect();
  } else {
    throw err;
  }
});

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'localhost',
    database: 'calcio_db'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('Errore nel tentativo di riconnessione al database:', err);
      setTimeout(handleDisconnect, 2000);
    }
    console.log('Riconnesso al database MySQL come id ' + connection.threadId);
  });

  connection.on('error', function(err) {
    console.error('Errore nella connessione al database:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

module.exports = connection;
