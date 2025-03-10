INSERT INTO tbUnite (unite)
VALUES
    ('kg'),
    ('l'),
    ('pc');
INSERT INTO tbTaxe (taxe)
VALUES
    (21),
    (6);
INSERT INTO tbCategorie (categorie)
VALUES
    ('Fruits'),
    ('Légumes'),
    ('Céréales'),
    ('Crémerie'),
    ('Epicerie sucrée');
INSERT INTO tbProduits (nom, prix, dateDebutVente, dateFinVente, idUnite, idTaxe, idCategorie)
VALUES
    ('Banane', 3.00, '2024-03-06', NULL, 1, 1, 1),
    ('Fraise',5.99 , '2024-03-06', NULL, 3, 1, 1),
    ('Pâte', 3.49, '2024-12-06', NULL, 3, 1, 3),
    ('Brocoli', 2.69, '2024-12-06', NULL, 3, 1, 2),
    ('Farine', 1.05, '2024-12-06', NULL, 3, 1, 3),
    ('Beurre', 3.25, '2024-03-06', NULL, 3, 1, 4),
    ('Sucre', 1.69, '2024-03-06', NULL, 3, 1, 5);

INSERT INTO tbStock (idProduit, quantite, dateLivraison)
VALUES
    (1, 10, NULL),
    (2, 100, NULL),
    (3, 40, NULL),
    (4, 4, NULL),
    (5, 0, '2025-03-25'),
    (6, 25, NULL),
    (7, 6, NULL);
