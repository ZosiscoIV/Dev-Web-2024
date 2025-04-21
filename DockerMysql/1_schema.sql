CREATE DATABASE IF NOT EXISTS magasin;
USE magasin;

-- Table des Unites
CREATE TABLE tbUnite (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         unite CHAR(6) NOT NULL
) ENGINE=InnoDB;

-- Table des taxes

CREATE TABLE tbTaxe (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        taxe FLOAT NOT NULL
) ENGINE=InnoDB;

-- Table ded categories

CREATE TABLE tbCategorie (
                             id INT PRIMARY KEY AUTO_INCREMENT,
                             categorie CHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Table des produits

CREATE TABLE tbProduits (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            nom VARCHAR(255) NOT NULL,
                            prix FLOAT NOT NULL,
                            dateDebutVente DATE NOT NULL,
                            dateFinVente DATE NULL,
                            idUnite INT NOT NULL,
                            idTaxe INT NOT NULL,
                            idCategorie INT NOT NULL,
                            imageURL VARCHAR(500) NULL,
                            FOREIGN KEY (idUnite) REFERENCES tbUnite(id),
                            FOREIGN KEY (idTaxe) REFERENCES tbTaxe(id),
                            FOREIGN KEY (idCategorie) REFERENCES tbCategorie(id)
) ENGINE=InnoDB;

-- Table du stock
CREATE TABLE tbStock (
                         idProduit INT PRIMARY KEY,
                         quantite INT NOT NULL,
                         dateLivraison DATE NULL,
                         FOREIGN KEY (idProduit) REFERENCES tbProduits(id)
) ENGINE=InnoDB;

-- Table des clients
CREATE TABLE tbClients (
                           id INT PRIMARY KEY AUTO_INCREMENT,
                           nom VARCHAR(255) NOT NULL,
                           prenom VARCHAR(255) NOT NULL,
                           adresseMail VARCHAR(255) UNIQUE NOT NULL,
                           tel VARCHAR(255) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- Table des commandes
CREATE TABLE tbCommandes (
                             idCommande INT PRIMARY KEY AUTO_INCREMENT,
                             idProduit INT NOT NULL,
                             idClient INT NOT NULL,
                             quantite INT NOT NULL,
                             dateCommande DATE NOT NULL,
                             FOREIGN KEY (idProduit) REFERENCES tbProduits(id),
                             FOREIGN KEY (idClient) REFERENCES tbClients(id),
                             CONSTRAINT fk_commande UNIQUE(idProduit, idClient)
) ENGINE=InnoDB;

-- Table des favoris
CREATE TABLE tbFavoris (
                           idFavori INT AUTO_INCREMENT PRIMARY KEY,
                           idProduit INT NOT NULL,
                           idClient INT NOT NULL,
                           dateFavoris DATE NOT NULL,
                           FOREIGN KEY (idProduit) REFERENCES tbProduits(id),
                           FOREIGN KEY (idClient) REFERENCES tbClients(id),
                           CONSTRAINT fk_favoris UNIQUE(idProduit, idClient)
) ENGINE=InnoDB;

-- Table des allergènes (liste simple)
CREATE TABLE tbAllergene (
                             id INT PRIMARY KEY AUTO_INCREMENT,
                             nom VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Relation produitsAllergènes
CREATE TABLE tbProduitAllergene (
                                    idProduit INT NOT NULL,
                                    idAllergene INT NOT NULL,
                                    PRIMARY KEY (idProduit, idAllergene),
                                    FOREIGN KEY (idProduit) REFERENCES tbProduits(id),
                                    FOREIGN KEY (idAllergene) REFERENCES tbAllergene(id)
) ENGINE=InnoDB;

-- Table des valeurs nutritionnelles directement liées aux produits
CREATE TABLE tbNutrition (
                             idProduit INT PRIMARY KEY,
                             calories DECIMAL(6,2) NULL,
                             proteines DECIMAL(5,2) NULL,
                             glucides DECIMAL(5,2) NULL,
                             lipides DECIMAL(5,2) NULL,
                             fibres DECIMAL(5,2) NULL,
                             sel DECIMAL(5,2) NULL,
                             FOREIGN KEY (idProduit) REFERENCES tbProduits(id)
) ENGINE=InnoDB;

-- Table simplifiée des ingrédients
CREATE TABLE tbIngredient (
                              id INT PRIMARY KEY AUTO_INCREMENT,
                              nom VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Liste des ingrédients par produit
CREATE TABLE tbProduitIngredient (
                                     idProduit INT NOT NULL,
                                     idIngredient INT NOT NULL,
                                     ordre INT NOT NULL,
                                     PRIMARY KEY (idProduit, idIngredient),
                                     FOREIGN KEY (idProduit) REFERENCES tbProduits(id),
                                     FOREIGN KEY (idIngredient) REFERENCES tbIngredient(id)
) ENGINE=InnoDB;
