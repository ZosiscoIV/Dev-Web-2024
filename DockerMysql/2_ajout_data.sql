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

-- Insertion des allergènes courants
INSERT INTO magasin.tbAllergene (nom)
VALUES
    ('Gluten'),
    ('Lactose'),
    ('Fruits à coque'),
    ('Arachide'),
    ('Soja'),
    ('Œuf'),
    ('Poisson'),
    ('Crustacés');

-- Relation produitsAllergènes
INSERT INTO magasin.tbProduitAllergene (idProduit, idAllergene)
VALUES
    (3, 1),     -- Pâte - Gluten
    (5, 1),     -- Farine - Gluten
    (6, 2);     -- Beurre - Lactose

-- Insertion des valeurs nutritionnelles
INSERT INTO magasin.tbNutrition (idProduit, calories, proteines, glucides, lipides, fibres, sel)
VALUES
    (1, 89.00, 1.10, 22.80, 0.30, 2.60, 0.00),     -- Banane
    (2, 32.00, 0.70, 7.70, 0.30, 2.00, 0.00),      -- Fraise
    (3, 350.00, 12.50, 70.90, 1.50, 3.20, 0.01),    -- Pâte
    (4, 34.00, 2.80, 7.00, 0.40, 2.60, 0.03),      -- Brocoli
    (5, 364.00, 10.00, 76.30, 1.00, 2.70, 0.01),   -- Farine
    (6, 717.00, 0.90, 0.10, 81.00, 0.00, 0.04),    -- Beurre
    (7, 400.00, 0.00, 99.80, 0.00, 0.00, 0.00);    -- Sucre

-- Insertion des ingrédients de base
INSERT INTO magasin.tbIngredient (nom)
VALUES
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

-- Association produitsIngrédients
INSERT INTO magasin.tbProduitIngredient (idProduit, idIngredient, ordre)
VALUES
    (1, 1, 1),               -- Banane
    (2, 2, 1),               -- Fraise
    (3, 3, 1),               -- Pâte - Blé dur
    (3, 4, 2),               -- Pâte - Eau
    (4, 5, 1),               -- Brocoli
    (5, 6, 1),               -- Farine - Farine de blé
    (6, 7, 1),               -- Beurre - Crème
    (6, 8, 2),               -- Beurre - Sel
    (6, 9, 3),               -- Beurre - Ferments lactiques
    (7, 10, 1);              -- Sucre - Sucre de canne