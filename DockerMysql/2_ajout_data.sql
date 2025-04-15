INSERT INTO magasin.tbUnite (unite)
VALUES
    ('kg'),
    ('l'),
    ('pc');
INSERT INTO magasin.tbTaxe (taxe)
VALUES
    (21),
    (6);
INSERT INTO magasin.tbCategorie (categorie)
VALUES
    ('Fruits'),
    ('Légumes'),
    ('Céréales'),
    ('Crémerie'),
    ('Epicerie sucrée');
INSERT INTO magasin.tbProduits (nom, prix, dateDebutVente, dateFinVente, idUnite, idTaxe, idCategorie, imageUrl)
VALUES
    ('Banane', 3.00, '2024-03-06', NULL, 1, 1, 1, '/assets/banane.jpg'),
    ('Fraise',5.99 , '2024-03-06', NULL, 3, 1, 1, '/assets/fraise.jpg'),
    ('Pâte', 3.49, '2024-12-06', NULL, 3, 1, 3, '/assets/pate.jpg'),
    ('Brocoli', 2.69, '2024-12-06', NULL, 3, 1, 2, '/assets/brocoli.jpg'),
    ('Farine', 1.05, '2024-12-06', NULL, 3, 1, 3, '/assets/farine.jpg'),
    ('Beurre', 3.25, '2024-03-06', NULL, 3, 1, 4, '/assets/beurre.jpg'),
    ('Sucre', 1.69, '2024-03-06', NULL, 3, 1, 5, '/assets/sucre.jpg');

INSERT INTO magasin.tbStock (idProduit, quantite, dateLivraison)
VALUES
    (1, 10, NULL),
    (2, 100, NULL),
    (3, 40, NULL),
    (4, 4, NULL),
    (5, 0, '2025-03-25'),
    (6, 25, NULL),
    (7, 6, NULL);