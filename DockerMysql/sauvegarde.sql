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
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresseMail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deletion_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_expires` datetime DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
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
INSERT INTO `tbClients` VALUES (1,'Pourtoi', 'Didier', '$2b$10$hZkW4l3W4hfULM0ZjSI9HudfCoEsySAEV9bfXKtigs4C4FgpfGpVO', 'didier.pourtoi@gmail.com', '0495562381', 0, null, null, 1);
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
  `imageURL` VARCHAR(500) NULL,
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
INSERT INTO `tbProduits` VALUES (1,'Banane', 3.00, '2024-03-06', NULL, 1, 1, 1, '/assets/banane.jpg'),
                                (2,'Fraise',5.99 , '2024-03-06', NULL, 3, 1, 1, '/assets/fraise.jpg'),
                                (3,'Pâte', 3.49, '2024-12-06', NULL, 3, 1, 3, '/assets/pate.jpg'),
                                (4,'Brocoli', 2.69, '2024-12-06', NULL, 3, 1, 2, '/assets/brocoli.jpg'),
                                (5,'Farine', 1.05, '2024-12-06', NULL, 3, 1, 3, '/assets/farine.jpg'),
                                (6,'Beurre', 3.25, '2024-03-06', NULL, 3, 1, 4, '/assets/beurre.jpg'),
                                (7,'Sucre', 1.69, '2024-03-06', NULL, 3, 1, 5, '/assets/sucre.jpg');

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
INSERT INTO `tbStock` VALUES (1, 10, NULL, true),
                             (2, 100, NULL, true),
                             (3, 40, NULL, true),
                             (4, 4, NULL, true),
                             (5, 0, '2025-03-25', false),
                             (6, 25, NULL, true),
                             (7, 6, NULL, true);
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

--
-- Table structure for table `tbAllergene`
--

DROP TABLE IF EXISTS `tbAllergene`;
CREATE TABLE `tbAllergene` (
                               `id` int NOT NULL AUTO_INCREMENT,
                               `nom` varchar(255) NOT NULL,
                               PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbAllergene`
--

LOCK TABLES `tbAllergene` WRITE;
/*!40000 ALTER TABLE `tbAllergene` DISABLE KEYS */;
INSERT INTO `tbAllergene` (`nom`) VALUES
                                      ('Gluten'),
                                      ('Lactose'),
                                      ('Fruits à coque'),
                                      ('Arachide'),
                                      ('Soja'),
                                      ('Œuf'),
                                      ('Poisson'),
                                      ('Crustacés');
/*!40000 ALTER TABLE `tbAllergene` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `tbProduitAllergene`
--

DROP TABLE IF EXISTS `tbProduitAllergene`;
CREATE TABLE `tbProduitAllergene` (
                                      `idProduit` int NOT NULL,
                                      `idAllergene` int NOT NULL,
                                      PRIMARY KEY (`idProduit`, `idAllergene`),
                                      CONSTRAINT `fk_pa_produit` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`),
                                      CONSTRAINT `fk_pa_allergene` FOREIGN KEY (`idAllergene`) REFERENCES `tbAllergene` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbProduitAllergene`
--

LOCK TABLES `tbProduitAllergene` WRITE;
/*!40000 ALTER TABLE `tbProduitAllergene` DISABLE KEYS */;
INSERT INTO `tbProduitAllergene` (`idProduit`, `idAllergene`) VALUES
                                                                  (3, 1), -- Pâte - Gluten
                                                                  (5, 1), -- Farine - Gluten
                                                                  (6, 2); -- Beurre - Lactose
/*!40000 ALTER TABLE `tbProduitAllergene` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `tbNutrition`
--

DROP TABLE IF EXISTS `tbNutrition`;
CREATE TABLE `tbNutrition` (
                               `idProduit` int NOT NULL,
                               `calories` decimal(6,2) DEFAULT NULL,
                               `proteines` decimal(5,2) DEFAULT NULL,
                               `glucides` decimal(5,2) DEFAULT NULL,
                               `lipides` decimal(5,2) DEFAULT NULL,
                               `fibres` decimal(5,2) DEFAULT NULL,
                               `sel` decimal(5,2) DEFAULT NULL,
                               PRIMARY KEY (`idProduit`),
                               CONSTRAINT `fk_nutrition_produit` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbNutrition`
--

LOCK TABLES `tbNutrition` WRITE;
/*!40000 ALTER TABLE `tbNutrition` DISABLE KEYS */;
INSERT INTO `tbNutrition` (`idProduit`, `calories`, `proteines`, `glucides`, `lipides`, `fibres`, `sel`) VALUES
                                                                                                             (1, 89.00, 1.10, 22.80, 0.30, 2.60, 0.00),
                                                                                                             (2, 32.00, 0.70, 7.70, 0.30, 2.00, 0.00),
                                                                                                             (3, 350.00, 12.50, 70.90, 1.50, 3.20, 0.01),
                                                                                                             (4, 34.00, 2.80, 7.00, 0.40, 2.60, 0.03),
                                                                                                             (5, 364.00, 10.00, 76.30, 1.00, 2.70, 0.01),
                                                                                                             (6, 717.00, 0.90, 0.10, 81.00, 0.00, 0.04),
                                                                                                             (7, 400.00, 0.00, 99.80, 0.00, 0.00, 0.00);
/*!40000 ALTER TABLE `tbNutrition` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `tbIngredient`
--

DROP TABLE IF EXISTS `tbIngredient`;
CREATE TABLE `tbIngredient` (
                                `id` int NOT NULL AUTO_INCREMENT,
                                `nom` varchar(255) NOT NULL,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbIngredient`
--

LOCK TABLES `tbIngredient` WRITE;
/*!40000 ALTER TABLE `tbIngredient` DISABLE KEYS */;
INSERT INTO `tbIngredient` (`nom`) VALUES
                                       ('Banane'),
                                       ('Fraise'),
                                       ('Blé dur'),
                                       ('Eau'),
                                       ('Brocoli'),
                                       ('Farine de blé'),
                                       ('Crème'),
                                       ('Sel'),
                                       ('Ferments lactiques'),
                                       ('Sucre de canne');
/*!40000 ALTER TABLE `tbIngredient` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `tbProduitIngredient`
--

DROP TABLE IF EXISTS `tbProduitIngredient`;
CREATE TABLE `tbProduitIngredient` (
                                       `idProduit` int NOT NULL,
                                       `idIngredient` int NOT NULL,
                                       `ordre` int NOT NULL,
                                       PRIMARY KEY (`idProduit`, `idIngredient`),
                                       CONSTRAINT `fk_pi_produit` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`),
                                       CONSTRAINT `fk_pi_ingredient` FOREIGN KEY (`idIngredient`) REFERENCES `tbIngredient` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbProduitIngredient`
--

LOCK TABLES `tbProduitIngredient` WRITE;
/*!40000 ALTER TABLE `tbProduitIngredient` DISABLE KEYS */;
INSERT INTO `tbProduitIngredient` (`idProduit`, `idIngredient`, `ordre`) VALUES
                                                                             (1, 1, 1),  -- Banane
                                                                             (2, 2, 1),  -- Fraise
                                                                             (3, 3, 1),  -- Pâte - Blé dur
                                                                             (3, 4, 2),  -- Pâte - Eau
                                                                             (4, 5, 1),  -- Brocoli
                                                                             (5, 6, 1),  -- Farine - Farine de blé
                                                                             (6, 7, 1),  -- Beurre - Crème
                                                                             (6, 8, 2),  -- Beurre - Sel
                                                                             (6, 9, 3),  -- Beurre - Ferments lactiques
                                                                             (7, 10, 1); -- Sucre - Sucre de canne
/*!40000 ALTER TABLE `tbProduitIngredient` ENABLE KEYS */;
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
