const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const db = require('./db');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));
app.use(bodyParser.json());

let clientIds = {};
let nextClientId = 1;
let client1 = null;
let client2 = null;
let matchData = {};

wss.on('connection', ws => {
  const clientId = nextClientId++;
  console.log(`Client ${clientId} connesso`);

  clientIds[ws] = clientId;

  if (!client1) {
    client1 = ws;
    ws.send(JSON.stringify({ type: 'client', role: 'client1' }));
  } else if (!client2) {
    client2 = ws;
    ws.send(JSON.stringify({ type: 'client', role: 'client2' }));
  }

  ws.on('message', message => {
    console.log(`Ricevuto dal client ${clientId}:`, message);

    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'startMatch') {
      matchData = {
        partitaId: parsedMessage.partitaId,
        squadraCasaId: parsedMessage.squadraCasaId,
        squadraOspiteId: parsedMessage.squadraOspiteId,
        punteggioCasa: null,
        punteggioOspite: null,
      };
      client1.send(JSON.stringify({ type: 'loadPage', page: 'client1.html' }));
      client2.send(JSON.stringify({ type: 'loadPage', page: 'client2.html' }));
    } else if (parsedMessage.type === 'generateScore') {
      if (ws === client1) {
        matchData.punteggioCasa = generateRandomScore();
      } else if (ws === client2) {
        matchData.punteggioOspite = generateRandomScore();
      }
      handleScoreGeneration(ws);
    }
  });

  ws.on('close', () => {
    console.log(`Client ${clientId} disconnesso`);
    delete clientIds[ws];

    if (ws === client1) {
      client1 = null;
    } else if (ws === client2) {
      client2 = null;
    }
  });
});

function handleScoreGeneration(ws) {
  if (matchData.punteggioCasa !== null && matchData.punteggioOspite !== null) {
    broadcastMatchResult();
  }
}

function broadcastMatchResult() {
  broadcast(JSON.stringify({
    type: 'matchResult',
    squadraCasaId: matchData.squadraCasaId,
    squadraOspiteId: matchData.squadraOspiteId,
    punteggioCasa: matchData.punteggioCasa,
    punteggioOspite: matchData.punteggioOspite,
  }));
}

function broadcast(data) {
  if (matchData.punteggioCasa !== null && matchData.punteggioOspite !== null) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

app.post('/add-team', (req, res) => {
  const { nome } = req.body;
  if (nome) {
    db.query(
      'INSERT INTO squadra (nome, partite_giocate, vinte_casa, vinte_ospite) VALUES (?, 0, 0, 0)',
      [nome],
      (err) => {
        if (err) {
          console.error('Errore nell\'aggiungere la squadra:', err);
          return res.status(500).send('Errore del server');
        }
        res.status(200).send(`Squadra ${nome} aggiunta con successo!`);
      }
    );
  } else {
    res.status(400).send('Nome della squadra è richiesto');
  }
});

app.get('/teams', (req, res) => {
  db.query('SELECT * FROM squadra', (err, results) => {
    if (err) {
      console.error('Errore nel recuperare le squadre:', err);
      return res.status(500).send('Errore del server');
    }
    res.json(results);
  });
});

app.post('/start-match', (req, res) => {
  const { squadraCasaId, squadraOspiteId } = req.body;
  db.query(
    'INSERT INTO partita (squadra_casa_id, squadra_ospite_id) VALUES (?, ?)',
    [squadraCasaId, squadraOspiteId],
    (err, results) => {
      if (err) {
        console.error('Errore nell\'iniziare la partita:', err);
        return res.status(500).send('Errore del server');
      }
      res.json({ partitaId: results.insertId });
    }
  );
});

app.post('/reset', (req, res) => {
  db.query('DELETE FROM partita', (err) => {
    if (err) {
      console.error('Errore nel resettare le partite:', err);
      return res.status(500).send('Errore del server');
    }
    db.query('DELETE FROM squadra', (err) => {
      if (err) {
        console.error('Errore nel resettare le squadre:', err);
        return res.status(500).send('Errore del server');
      }
      updateResultsTable();
      res.send('Database resettato con successo');
    });
  });
});

function generateRandomScore() {
  return Math.floor(Math.random() * 10) + 1;
}

function updateResultsTable() {
  db.query('SELECT * FROM squadra', (err, results) => {
    if (err) {
      console.error('Errore nel recuperare i risultati:', err);
      return;
    }
    broadcast(JSON.stringify({
      type: 'resultsUpdate',
      results: results
    }));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
