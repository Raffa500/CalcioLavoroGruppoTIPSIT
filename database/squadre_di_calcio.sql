-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Apr 22, 2024 alle 11:41
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `squadre_di_calcio`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `giocatori`
--

CREATE TABLE `giocatori` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `cognome` varchar(255) DEFAULT NULL,
  `data_nascita` date DEFAULT NULL,
  `nazionalita` varchar(255) DEFAULT NULL,
  `squadra_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `giocatori`
--

INSERT INTO `giocatori` (`id`, `nome`, `cognome`, `data_nascita`, `nazionalita`, `squadra_id`) VALUES
(1, 'Cristiano', 'Ronaldo', '1985-02-05', 'Portogallo', 1),
(2, 'Paulo', 'Dybala', '1993-11-15', 'Argentina', 1),
(3, 'Giorgio', 'Chiellini', '1984-08-14', 'Italia', 1),
(4, 'Federico', 'Chiesa', '1997-10-25', 'Italia', 1),
(5, 'Alvaro', 'Morata', '1992-10-23', 'Spagna', 1),
(6, 'Matthijs', 'de Ligt', '1999-08-12', 'Paesi Bassi', 1),
(7, 'Leonardo', 'Bonucci', '1987-05-01', 'Italia', 1),
(8, 'Aaron', 'Ramsey', '1990-12-26', 'Galles', 1),
(9, 'Weston', 'McKennie', '1998-08-28', 'Stati Uniti', 1),
(10, 'Adrien', 'Rabiot', '1995-04-03', 'Francia', 1),
(11, 'Arthur', 'Melo', '1996-08-12', 'Brasile', 1),
(12, 'Gianluigi', 'Buffon', '1978-01-28', 'Italia', 1),
(13, 'Dejan', 'Kulusevski', '2000-04-25', 'Svezia', 1),
(14, 'Danilo', 'Luiz', '1991-07-15', 'Brasile', 1),
(15, 'Alex', 'Sandro', '1991-01-26', 'Brasile', 1),
(16, 'Federico', 'Bernardeschi', '1994-02-16', 'Italia', 1),
(17, 'Romelu', 'Lukaku', '1993-05-13', 'Belgio', 2),
(18, 'Lautaro', 'Martínez', '1997-08-22', 'Argentina', 2),
(19, 'Stefan', 'de Vrij', '1992-02-05', 'Paesi Bassi', 2),
(20, 'Nicolo', 'Barella', '1997-02-27', 'Italia', 2),
(21, 'Achraf', 'Hakimi', '1998-11-04', 'Marocco', 2),
(22, 'Marcelo', 'Brozović', '1992-11-16', 'Croazia', 2),
(23, 'Milan', 'Škriniar', '1995-02-11', 'Slovacchia', 2),
(24, 'Alessandro', 'Bastoni', '1999-04-13', 'Italia', 2),
(25, 'Matteo', 'Darmian', '1989-12-02', 'Italia', 2),
(26, 'Hakan', 'Çalhanoğlu', '1994-02-08', 'Turchia', 2),
(27, 'Marcelo', 'Brozović', '1992-11-16', 'Croazia', 2),
(28, 'Ivan', 'Perišić', '1989-02-02', 'Croazia', 2),
(29, 'Andrea', 'Ranocchia', '1988-02-16', 'Italia', 2),
(30, 'Roberto', 'Gagliardini', '1994-04-07', 'Italia', 2),
(31, 'Matteo', 'Darmian', '1989-12-02', 'Italia', 2);

-- --------------------------------------------------------

--
-- Struttura della tabella `squadre`
--

CREATE TABLE `squadre` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `squadre`
--

INSERT INTO `squadre` (`id`, `nome`) VALUES
(1, 'Juventus'),
(2, 'Inter'),
(3, 'AC Milan'),
(4, 'Napoli'),
(5, 'Roma'),
(6, 'Atalanta'),
(7, 'Lazio'),
(8, 'Sassuolo'),
(9, 'Fiorentina'),
(10, 'Torino'),
(11, 'Sampdoria'),
(12, 'Udinese'),
(13, 'Bologna'),
(14, 'Empoli'),
(15, 'Cagliari'),
(16, 'Venezia'),
(17, 'Genoa'),
(18, 'Spezia'),
(19, 'Salernitana');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `giocatori`
--
ALTER TABLE `giocatori`
  ADD PRIMARY KEY (`id`),
  ADD KEY `squadra_id` (`squadra_id`);

--
-- Indici per le tabelle `squadre`
--
ALTER TABLE `squadre`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `giocatori`
--
ALTER TABLE `giocatori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT per la tabella `squadre`
--
ALTER TABLE `squadre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `giocatori`
--
ALTER TABLE `giocatori`
  ADD CONSTRAINT `giocatori_ibfk_1` FOREIGN KEY (`squadra_id`) REFERENCES `squadre` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
