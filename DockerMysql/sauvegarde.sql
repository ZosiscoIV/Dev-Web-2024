USE Epicerie;

UNLOCK TABLES;

DROP TABLE IF EXISTS `tbfavoris`;
DROP TABLE IF EXISTS `tbcommandes`;
DROP TABLE IF EXISTS `tbStock`;
DROP TABLE IF EXISTS `tbProduits`;
DROP TABLE IF EXISTS `tbclients`;
DROP TABLE IF EXISTS `tbtaxe`;
DROP TABLE IF EXISTS `tbunite`;
DROP TABLE IF EXISTS `tbcategorie`;

CREATE TABLE `tbcategorie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categorie` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tbcategorie` WRITE;
INSERT INTO `tbcategorie` VALUES (1,'Fruits'),(2,'Légumes'),(3,'Céréales'),(4,'Crêmerie'),(5,'Epicerie sucrée');
UNLOCK TABLES;

CREATE TABLE `tbclients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresseMail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deletion_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `adresseMail` (`adresseMail`),
  UNIQUE KEY `tel` (`tel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tbtaxe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taxe` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
LOCK TABLES `tbtaxe` WRITE;
INSERT INTO `tbtaxe` VALUES (1,21),(2,6);
UNLOCK TABLES;

CREATE TABLE `tbunite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unite` char(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
LOCK TABLES `tbunite` WRITE;
INSERT INTO `tbunite` VALUES (1,'kg'),(2,'l'),(3,'pc');
UNLOCK TABLES;


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
LOCK TABLES `tbProduits` WRITE;
INSERT INTO `tbProduits` VALUES (1,'Banane',3,'2024-03-06',NULL,1,1,1),(2,'Fraise',5.99,'2024-03-06',NULL,3,1,1),(3,'Pâte',3.49,'2024-12-06',NULL,3,1,3),(4,'Brocoli',2.69,'2024-12-06',NULL,3,1,2),(5,'Farine',1.05,'2024-12-06',NULL,3,1,3),(6,'Beurre',3.25,'2024-03-06',NULL,3,1,4),(7,'Sucre',1.69,'2024-03-06',NULL,3,1,5);
UNLOCK TABLES;

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


CREATE TABLE `tbStock` (
  `idProduit` int NOT NULL,
  `quantite` int NOT NULL,
  `dateLivraison` date DEFAULT NULL,
  PRIMARY KEY (`idProduit`),
  CONSTRAINT `tbStock_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `tbProduits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tbStock` WRITE;
INSERT INTO `tbStock` VALUES (1,10,NULL),(2,100,NULL),(3,40,NULL),(4,4,NULL),(5,0,'2025-03-25'),(6,25,NULL),(7,6,NULL);
UNLOCK TABLES;
