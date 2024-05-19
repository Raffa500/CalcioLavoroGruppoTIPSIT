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

// Endpoint per aggiungere una squadra
app.post('/add-team', (req, res) => {
  const { nome } = req.body;
  console.log('Aggiungendo squadra con nome:', nome); // Log per tracciare il nome della squadra

  db.query('SELECT COUNT(*) AS count FROM squadra', (err, results) => {
    if (err) {
      console.error('Errore nel contare le squadre:', err);
      return res.status(500).send('Errore del server');
    }

    console.log('Numero di squadre attualmente:', results[0].count);

    if (results[0].count >= 10) {
      console.log('Numero massimo di squadre raggiunto');
      return res.status(400).send('Numero max di squadre aggiunte');
    }

    db.query('INSERT INTO squadra (nome) VALUES (?)', [nome], (err) => {
      if (err) {
        console.error('Errore nell\'aggiunta della squadra:', err);
        return res.status(500).send('Errore del server');
      }
      console.log('Squadra aggiunta con successo');
      res.send('Squadra aggiunta con successo');
    });
  });
});

// Endpoint per visualizzare le squadre
app.get('/teams', (req, res) => {
  db.query('SELECT * FROM squadra', (err, results) => {
    if (err) {
      console.error('Errore nel recuperare le squadre:', err);
      return res.status(500).send('Errore del server');
    }
    res.json(results);
  });
});

// Endpoint per iniziare una partita
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

// Endpoint per aggiornare il risultato della partita
app.post('/end-match', (req, res) => {
  const { partitaId, vincitore, squadraCasaId, squadraOspiteId, punteggioCasa, punteggioOspite } = req.body;
  db.query(
    'UPDATE partita SET vincitore = ?, punteggio_casa = ?, punteggio_ospite = ? WHERE id = ?',
    [vincitore, punteggioCasa, punteggioOspite, partitaId],
    (err) => {
      if (err) {
        console.error('Errore nell\'aggiornare il risultato della partita:', err);
        return res.status(500).send('Errore del server');
      }
      // Aggiornare le statistiche della squadra
      const colonnaVittoria = vincitore === 'casa' ? 'vinte_casa' : 'vinte_ospite';
      const squadraVincenteId = vincitore === 'casa' ? squadraCasaId : squadraOspiteId;
      db.query(
        `UPDATE squadra 
         SET partite_giocate = partite_giocate + 1, 
             ${colonnaVittoria} = ${colonnaVittoria} + 1 
         WHERE id = ?`,
        [squadraVincenteId],
        (err) => {
          if (err) {
            console.error('Errore nell\'aggiornare le statistiche della squadra:', err);
            return res.status(500).send('Errore del server');
          }
          // Dopo aver aggiornato le statistiche, ritorna successo
          res.send('Partita conclusa con successo');
          // Ora aggiorna la tabella dei risultati
          updateResultsTable();
        }
      );
    }
  );
});


// Funzione per aggiornare la tabella dei risultati
function updateResultsTable() {
  db.query('SELECT * FROM squadra', (err, results) => {
    if (err) {
      console.error('Errore nel recuperare i risultati:', err);
      return;
    }
        // Invia i risultati aggiornati ai client connessi
    broadcast(JSON.stringify({
      type: 'resultsUpdate',
      results: results
    }));
  });
}

// Endpoint per visualizzare i risultati
app.get('/results', (req, res) => {
  db.query('SELECT * FROM squadra', (err, results) => {
    if (err) {
      console.error('Errore nel recuperare i risultati:', err);
      return res.status(500).send('Errore del server');
    }
    res.json(results);
  });
});

// Endpoint per resettare tutto
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
      // Dopo aver resettato, invia un segnale per aggiornare i risultati
      updateResultsTable();
      res.send('Database resettato con successo');
    });
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
