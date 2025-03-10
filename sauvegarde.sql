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

--
-- Table structure for table `tbcategorie`
--

DROP TABLE IF EXISTS `tbcategorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbcategorie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categorie` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcategorie`
--

LOCK TABLES `tbcategorie` WRITE;
/*!40000 ALTER TABLE `tbcategorie` DISABLE KEYS */;
INSERT INTO `tbcategorie` VALUES (1,'Fruits'),(2,'Légumes'),(3,'Céréales'),(4,'Crêmerie'),(5,'Epicerie sucrée');
/*!40000 ALTER TABLE `tbcategorie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbclients`
--

DROP TABLE IF EXISTS `tbclients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbclients` (
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
-- Dumping data for table `tbclients`
--

LOCK TABLES `tbclients` WRITE;
/*!40000 ALTER TABLE `tbclients` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbclients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbcommandes`
--

DROP TABLE IF EXISTS `tbcommandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbcommandes` (
  `idCommande` int NOT NULL AUTO_INCREMENT,
  `idProduit` int NOT NULL,
  `idClient` int NOT NULL,
  `quantite` int NOT NULL,
  `dateCommande` date NOT NULL,
  PRIMARY KEY (`idCommande`),
  UNIQUE KEY `fk_commande` (`idProduit`,`idClient`),
  KEY `idClient` (`idClient`),
  CONSTRAINT `tbcommandes_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbproduits` (`id`),
  CONSTRAINT `tbcommandes_ibfk_2` FOREIGN KEY (`idClient`) REFERENCES `tbclients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcommandes`
--

LOCK TABLES `tbcommandes` WRITE;
/*!40000 ALTER TABLE `tbcommandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbcommandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbfavoris`
--

DROP TABLE IF EXISTS `tbfavoris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbfavoris` (
  `idFavori` int NOT NULL AUTO_INCREMENT,
  `idProduit` int NOT NULL,
  `idClient` int NOT NULL,
  `dateFavoris` date NOT NULL,
  PRIMARY KEY (`idFavori`),
  UNIQUE KEY `fk_favoris` (`idProduit`,`idClient`),
  KEY `idClient` (`idClient`),
  CONSTRAINT `tbfavoris_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbproduits` (`id`),
  CONSTRAINT `tbfavoris_ibfk_2` FOREIGN KEY (`idClient`) REFERENCES `tbclients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbfavoris`
--

LOCK TABLES `tbfavoris` WRITE;
/*!40000 ALTER TABLE `tbfavoris` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbfavoris` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbproduits`
--

DROP TABLE IF EXISTS `tbproduits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbproduits` (
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
  CONSTRAINT `tbproduits_ibfk_1` FOREIGN KEY (`idUnite`) REFERENCES `tbunite` (`id`),
  CONSTRAINT `tbproduits_ibfk_2` FOREIGN KEY (`idTaxe`) REFERENCES `tbtaxe` (`id`),
  CONSTRAINT `tbproduits_ibfk_3` FOREIGN KEY (`idCategorie`) REFERENCES `tbcategorie` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbproduits`
--

LOCK TABLES `tbproduits` WRITE;
/*!40000 ALTER TABLE `tbproduits` DISABLE KEYS */;
INSERT INTO `tbproduits` VALUES (1,'Banane',3,'2024-03-06',NULL,1,1,1),(2,'Fraise',5.99,'2024-03-06',NULL,3,1,1),(3,'Pâte',3.49,'2024-12-06',NULL,3,1,3),(4,'Brocoli',2.69,'2024-12-06',NULL,3,1,2),(5,'Farine',1.05,'2024-12-06',NULL,3,1,3),(6,'Beurre',3.25,'2024-03-06',NULL,3,1,4),(7,'Sucre',1.69,'2024-03-06',NULL,3,1,5);
/*!40000 ALTER TABLE `tbproduits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbstock`
--

DROP TABLE IF EXISTS `tbstock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbstock` (
  `idProduit` int NOT NULL,
  `quantite` int NOT NULL,
  `dateLivraison` date DEFAULT NULL,
  PRIMARY KEY (`idProduit`),
  CONSTRAINT `tbstock_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbproduits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbstock`
--

LOCK TABLES `tbstock` WRITE;
/*!40000 ALTER TABLE `tbstock` DISABLE KEYS */;
INSERT INTO `tbstock` VALUES (1,10,NULL),(2,100,NULL),(3,40,NULL),(4,4,NULL),(5,0,'2025-03-25'),(6,25,NULL),(7,6,NULL);
/*!40000 ALTER TABLE `tbstock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbtaxe`
--

DROP TABLE IF EXISTS `tbtaxe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbtaxe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taxe` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbtaxe`
--

LOCK TABLES `tbtaxe` WRITE;
/*!40000 ALTER TABLE `tbtaxe` DISABLE KEYS */;
INSERT INTO `tbtaxe` VALUES (1,21),(2,6);
/*!40000 ALTER TABLE `tbtaxe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbunite`
--

DROP TABLE IF EXISTS `tbunite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbunite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unite` char(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbunite`
--

LOCK TABLES `tbunite` WRITE;
/*!40000 ALTER TABLE `tbunite` DISABLE KEYS */;
INSERT INTO `tbunite` VALUES (1,'kg'),(2,'l'),(3,'pc');
/*!40000 ALTER TABLE `tbunite` ENABLE KEYS */;
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
