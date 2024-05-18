const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', ws => {
  console.log('Cliente connesso');

  ws.on('message', message => {
    console.log('Ricevuto:', message);

    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'updateScore') {
      const { partitaId, punteggioCasa, punteggioOspite } = parsedMessage;

      db.query(
        'UPDATE partita SET punteggio_casa = ?, punteggio_ospite = ? WHERE id = ?',
        [punteggioCasa, punteggioOspite, partitaId],
        (err) => {
          if (err) {
            console.error('Errore nell\'aggiornamento del punteggio:', err);
            return;
          }
          broadcast(JSON.stringify({
            type: 'scoreUpdate',
            partitaId,
            punteggioCasa,
            punteggioOspite
          }));
        }
      );
    }
  });

  ws.on('close', () => {
    console.log('Cliente disconnesso');
  });
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
