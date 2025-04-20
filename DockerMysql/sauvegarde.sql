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
                               CONSTRAINT `tbcommandes_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`),
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
                             CONSTRAINT `tbfavoris_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`),
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
                              CONSTRAINT `tbProduits_ibfk_1` FOREIGN KEY (`idUnite`) REFERENCES `tbunite` (`id`),
                              CONSTRAINT `tbProduits_ibfk_2` FOREIGN KEY (`idTaxe`) REFERENCES `tbtaxe` (`id`),
                              CONSTRAINT `tbProduits_ibfk_3` FOREIGN KEY (`idCategorie`) REFERENCES `tbcategorie` (`id`)
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
                           PRIMARY KEY (`idProduit`),
                           CONSTRAINT `tbStock_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbStock`
--

-- Après la création de la table tbStock

-- Table structure for table `tbInfosNutritionnelles`
--

DROP TABLE IF EXISTS `tbInfosNutritionnelles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbInfosNutritionnelles` (
                                          `idProduit` int NOT NULL,
                                          `calories` float DEFAULT NULL,
                                          `proteines` float DEFAULT NULL,
                                          `glucides` float DEFAULT NULL,
                                          `lipides` float DEFAULT NULL,
                                          `fibres` float DEFAULT NULL,
                                          `sel` float DEFAULT NULL,
                                          PRIMARY KEY (`idProduit`),
                                          CONSTRAINT `tbInfosNutritionnelles_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbInfosNutritionnelles`
--

LOCK TABLES `tbInfosNutritionnelles` WRITE;
/*!40000 ALTER TABLE `tbInfosNutritionnelles` DISABLE KEYS */;
INSERT INTO `tbInfosNutritionnelles` VALUES
                                         (1, 89, 1.1, 22.8, 0.3, 2.6, 0.001),  -- Banane
                                         (2, 32, 0.7, 7.7, 0.3, 2.0, 0.002),   -- Fraise
                                         (3, 350, 12.5, 70.9, 1.5, 3.2, 0.005), -- Pâte
                                         (4, 34, 2.8, 7.0, 0.4, 2.6, 0.033),   -- Brocoli
                                         (5, 364, 10.0, 76.3, 1.0, 2.7, 0.002), -- Farine
                                         (6, 717, 0.9, 0.1, 81.0, 0.0, 0.100),  -- Beurre
                                         (7, 400, 0.0, 99.8, 0.0, 0.0, 0.001);  -- Sucre
/*!40000 ALTER TABLE `tbInfosNutritionnelles` ENABLE KEYS */;
UNLOCK TABLES;

-- Table pour stocker les allergènes des produits
DROP TABLE IF EXISTS `tbAllergenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbAllergenes` (
                                `id` int NOT NULL AUTO_INCREMENT,
                                `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbAllergenes`
--

LOCK TABLES `tbAllergenes` WRITE;
/*!40000 ALTER TABLE `tbAllergenes` DISABLE KEYS */;
INSERT INTO `tbAllergenes` VALUES
                               (1, 'Gluten'),
                               (2, 'Lactose'),
                               (3, 'Fruits à coque'),
                               (4, 'Arachides'),
                               (5, 'Soja'),
                               (6, 'Œufs');
/*!40000 ALTER TABLE `tbAllergenes` ENABLE KEYS */;
UNLOCK TABLES;

-- Table de liaison produits-allergènes
DROP TABLE IF EXISTS `tbProduitsAllergenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbProduitsAllergenes` (
                                        `idProduit` int NOT NULL,
                                        `idAllergene` int NOT NULL,
                                        PRIMARY KEY (`idProduit`, `idAllergene`),
                                        KEY `idAllergene` (`idAllergene`),
                                        CONSTRAINT `tbProduitsAllergenes_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`) ON DELETE CASCADE,
                                        CONSTRAINT `tbProduitsAllergenes_ibfk_2` FOREIGN KEY (`idAllergene`) REFERENCES `tbAllergenes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbProduitsAllergenes`
--

LOCK TABLES `tbProduitsAllergenes` WRITE;
/*!40000 ALTER TABLE `tbProduitsAllergenes` DISABLE KEYS */;
INSERT INTO `tbProduitsAllergenes` VALUES
                                       (3, 1),      -- Pâte contient du gluten
                                       (5, 1),      -- Farine contient du gluten
                                       (6, 2);      -- Beurre contient du lactose
/*!40000 ALTER TABLE `tbProduitsAllergenes` ENABLE KEYS */;
UNLOCK TABLES;

-- Ajout d'une table pour les compositions de produits
DROP TABLE IF EXISTS `tbCompositionProduits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbCompositionProduits` (
                                         `idProduit` int NOT NULL,
                                         `composition` text COLLATE utf8mb4_unicode_ci,
                                         PRIMARY KEY (`idProduit`),
                                         CONSTRAINT `tbCompositionProduits_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbCompositionProduits`
--

LOCK TABLES `tbCompositionProduits` WRITE;
/*!40000 ALTER TABLE `tbCompositionProduits` DISABLE KEYS */;
INSERT INTO `tbCompositionProduits` VALUES
                                        (1, '100% banane'),
                                        (2, '100% fraise'),
                                        (3, 'Farine de blé, eau, sel'),
                                        (4, '100% brocoli'),
                                        (5, 'Farine de blé'),
                                        (6, 'Lait, sel'),
                                        (7, 'Sucre de canne');
/*!40000 ALTER TABLE `tbCompositionProduits` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `tbStock` WRITE;
/*!40000 ALTER TABLE `tbStock` DISABLE KEYS */;
INSERT INTO `tbStock` VALUES (1,10,NULL),(2,100,NULL),(3,40,NULL),(4,4,NULL),(5,0,'2025-03-25'),(6,25,NULL),(7,6,NULL);
/*!40000 ALTER TABLE `tbStock` ENABLE KEYS */;
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