const express = require('express');
const { Server } = require('ws');
const mysql = require('mysql');

const server = express()
    .use(express.static('public')) // Serve la directory 'public' per gli asset statici (ad esempio, index.html)
    .listen(3000, () => console.log('Listening on 3000'));

const ws_server = new Server({ server });

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Inserisci la tua password se necessario
    database: "calcio" // Assicurati di usare il nome del database corretto
});

ws_server.on('connection', (ws) => {
    console.log("Nuova connessione WebSocket.");

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'inserisci_squadra') {
            const nomeSquadra = data.nome;
            const inserisciSquadraQuery = `INSERT INTO Squadre (nome) VALUES ('${nomeSquadra}')`;

            dbConnection.query(inserisciSquadraQuery, (err, result) => {
                if (err) {
                    console.error("Errore durante l'inserimento della squadra:", err);
                    return;
                }
                console.log("Squadra inserita con successo:", nomeSquadra);
            });
        }

        if (data.type === 'inserisci_giocatore') {
            const { squadra_id, nome, cognome, data_nascita, nazionalita } = data;
            const inserisciGiocatoreQuery = `INSERT INTO Giocatori (squadra_id, nome, cognome, data_nascita, nazionalita) VALUES (${squadra_id}, '${nome}', '${cognome}', '${data_nascita}', '${nazionalita}')`;

            dbConnection.query(inserisciGiocatoreQuery, (err, result) => {
                if (err) {
                    console.error("Errore durante l'inserimento del giocatore:", err);
                    return;
                }
                console.log("Giocatore inserito con successo:", nome, cognome);
            });
        }
    });

    ws.on('close', () => {
        console.log("Connessione WebSocket chiusa.");
    });
});
