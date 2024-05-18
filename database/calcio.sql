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


--------------------------------------------------------------------------------

CREATE DATABASE calcio;

USE calcio;

CREATE TABLE squadra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50),
  partite_giocate INT DEFAULT 0,
  vinte_casa INT DEFAULT 0,
  vinte_ospite INT DEFAULT 0
);

CREATE TABLE partita (
  id INT AUTO_INCREMENT PRIMARY KEY,
  squadra_casa_id INT,
  squadra_ospite_id INT,
  vincitore VARCHAR(50),
  FOREIGN KEY (squadra_casa_id) REFERENCES squadra(id),
  FOREIGN KEY (squadra_ospite_id) REFERENCES squadra(id),
  data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--------------------------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS calcio_db;

USE calcio_db;

CREATE TABLE IF NOT EXISTS squadra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    partite_giocate INT DEFAULT 0,
    vinte_casa INT DEFAULT 0,
    vinte_ospite INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS partita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    squadra_casa_id INT,
    squadra_ospite_id INT,
    punteggio_casa INT DEFAULT 0,
    punteggio_ospite INT DEFAULT 0,
    vincitore ENUM('casa', 'ospite') DEFAULT NULL,
    FOREIGN KEY (squadra_casa_id) REFERENCES squadra(id),
    FOREIGN KEY (squadra_ospite_id) REFERENCES squadra(id)
);
