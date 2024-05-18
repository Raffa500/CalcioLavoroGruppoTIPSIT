CREATE DATABASE calcio;

USE calcio;

CREATE TABLE `partita` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  squadra_casa VARCHAR(50),
  squadra_ospite VARCHAR(50),
  punteggio_casa INT DEFAULT 0,
  punteggio_ospite INT DEFAULT 0,
  data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  partita_id INT,
  tipo_evento VARCHAR(50),
  descrizione TEXT,
  data_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partita_id) REFERENCES `partita`(id)
);
