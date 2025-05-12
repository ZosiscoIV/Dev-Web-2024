-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: magasin
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE magasin;
--
-- Table structure for table `tbCategorie`
--

DROP TABLE IF EXISTS `tbCategorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbCategorie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categorie` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbCategorie`
--

LOCK TABLES `tbCategorie` WRITE;
/*!40000 ALTER TABLE `tbCategorie` DISABLE KEYS */;
INSERT INTO `tbCategorie` VALUES (1,'Fruits'),(2,'Légumes'),(3,'Céréales'),(4,'Crêmerie'),(5,'Epicerie sucrée');
/*!40000 ALTER TABLE `tbCategorie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbClients`
--

DROP TABLE IF EXISTS `tbClients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbClients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresseMail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `adresseMail` (`adresseMail`),
  UNIQUE KEY `tel` (`tel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbClients`
--

LOCK TABLES `tbClients` WRITE;
/*!40000 ALTER TABLE `tbClients` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbClients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbCommandes`
--

DROP TABLE IF EXISTS `tbCommandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbCommandes` (
  `idCommande` int NOT NULL AUTO_INCREMENT,
  `idProduit` int NOT NULL,
  `idClient` int NOT NULL,
  `quantite` int NOT NULL,
  `dateCommande` date NOT NULL,
  PRIMARY KEY (`idCommande`),
  UNIQUE KEY `fk_commande` (`idProduit`,`idClient`),
  KEY `idClient` (`idClient`),
  CONSTRAINT `tbCommandes_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`),
  CONSTRAINT `tbCommandes_ibfk_2` FOREIGN KEY (`idClient`) REFERENCES `tbClients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbCommandes`
--

LOCK TABLES `tbCommandes` WRITE;
/*!40000 ALTER TABLE `tbCommandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbCommandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbFavoris`
--

DROP TABLE IF EXISTS `tbFavoris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbFavoris` (
  `idFavori` int NOT NULL AUTO_INCREMENT,
  `idProduit` int NOT NULL,
  `idClient` int NOT NULL,
  `dateFavoris` date NOT NULL,
  PRIMARY KEY (`idFavori`),
  UNIQUE KEY `fk_favoris` (`idProduit`,`idClient`),
  KEY `idClient` (`idClient`),
  CONSTRAINT `tbFavoris_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`),
  CONSTRAINT `tbFavoris_ibfk_2` FOREIGN KEY (`idClient`) REFERENCES `tbClients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbFavoris`
--

LOCK TABLES `tbFavoris` WRITE;
/*!40000 ALTER TABLE `tbFavoris` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbFavoris` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbProduits`
--

DROP TABLE IF EXISTS `tbProduits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbProduits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix` float NOT NULL,
  `dateDebutVente` date NOT NULL,
  `dateFinVente` date DEFAULT NULL,
  `idUnite` int NOT NULL,
  `idTaxe` int NOT NULL,
  `idCategorie` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUnite` (`idUnite`),
  KEY `idTaxe` (`idTaxe`),
  KEY `idCategorie` (`idCategorie`),
  CONSTRAINT `tbProduits_ibfk_1` FOREIGN KEY (`idUnite`) REFERENCES `tbUnite` (`id`),
  CONSTRAINT `tbProduits_ibfk_2` FOREIGN KEY (`idTaxe`) REFERENCES `tbTaxe` (`id`),
  CONSTRAINT `tbProduits_ibfk_3` FOREIGN KEY (`idCategorie`) REFERENCES `tbCategorie` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbProduits`
--

LOCK TABLES `tbProduits` WRITE;
/*!40000 ALTER TABLE `tbProduits` DISABLE KEYS */;
INSERT INTO `tbProduits` VALUES (1,'Banane',3,'2024-03-06',NULL,1,1,1),(2,'Fraise',5.99,'2024-03-06',NULL,3,1,1),(3,'Pâte',3.49,'2024-12-06',NULL,3,1,3),(4,'Brocoli',2.69,'2024-12-06',NULL,3,1,2),(5,'Farine',1.05,'2024-12-06',NULL,3,1,3),(6,'Beurre',3.25,'2024-03-06',NULL,3,1,4),(7,'Sucre',1.69,'2024-03-06',NULL,3,1,5);
/*!40000 ALTER TABLE `tbProduits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbStock`
--

DROP TABLE IF EXISTS `tbStock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbStock` (
  `idProduit` int NOT NULL,
  `quantite` int NOT NULL,
  `dateLivraison` date DEFAULT NULL,
  `disponibilite` boolean NOT NULL,
  PRIMARY KEY (`idProduit`),
  CONSTRAINT `tbStock_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbStock`
--

LOCK TABLES `tbStock` WRITE;
/*!40000 ALTER TABLE `tbStock` DISABLE KEYS */;
INSERT INTO `tbStock` VALUES (1,10,NULL,true),(2,100,NULL, true),(3,40,NULL,true),(4,4,NULL, true),(5,0,'2025-03-25', false),(6,25,NULL, true),(7,6,NULL, true);
/*!40000 ALTER TABLE `tbStock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbTaxe`
--

DROP TABLE IF EXISTS `tbTaxe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbTaxe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taxe` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbTaxe`
--

LOCK TABLES `tbTaxe` WRITE;
/*!40000 ALTER TABLE `tbTaxe` DISABLE KEYS */;
INSERT INTO `tbTaxe` VALUES (1,21),(2,6);
/*!40000 ALTER TABLE `tbTaxe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbUnite`
--

DROP TABLE IF EXISTS `tbUnite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbUnite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unite` char(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbUnite`
--

LOCK TABLES `tbUnite` WRITE;
/*!40000 ALTER TABLE `tbUnite` DISABLE KEYS */;
INSERT INTO `tbUnite` VALUES (1,'kg'),(2,'l'),(3,'pc');
/*!40000 ALTER TABLE `tbUnite` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-08 17:48:12
