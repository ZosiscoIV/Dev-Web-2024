const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
});

const db2 = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
});

// Crée une version Promise du pool
const promisePool = db2.promise();

console.log(process.env.DB_CHARSET);

// Vérification de la connexion
db.connect(err => {
    if (err) {
        console.error("❌ Erreur de connexion à la base de données :", err);
        process.exit(1); // Arrête l'application si la connexion échoue
    }
    console.log("✅ Connexion réussie à la base de données !");
});


// route pour la liste de produits

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtenir la liste des produits dans le stock.
 *     description: Retourne tous les produits disponibles avec leur nom, prix et quantité.
 *     responses:
 *       200:
 *         description: Liste des produits.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nom:
 *                     type: string
 *                     example: "Banane"
 *                   prix:
 *                     type: number
 *                     example: 3.00
 *                   quantite:
 *                     type: integer
 *                     example: 10
 *                   status:
 *                     type: string
 *                     example: "En stock"
 *                   categorie:
 *                     type: string
 *                     example: "Fruit"
 *                   dateLivraison:
 *                     type: date
 *                     example: "2025-03-24T23:00:00.000Z"
 *       404:
 *         description: Aucun produit trouvé.
 *       500:
 *         description: Erreur avec la base de données.
 */

router.get('/products', (req, res) => {
    const { categorie, enStock} = req.query
    let query = `
    SELECT
        p.id AS id,
        p.nom AS produit,
        p.prix AS prix,
        s.quantite AS quantite,
        IF(s.quantite > 0, 'En stock', 'Hors stock') AS status,
        c.categorie AS categorie,
        s.dateLivraison AS dateLivraison
    FROM
        magasin.tbProduits p
    JOIN
        magasin.tbStock s ON p.id = s.idProduit
    JOIN
        magasin.tbCategorie c ON p.idCategorie = c.id
    `;
    let conditions = []; // On stocke ici les filtres dynamiquement

    if (categorie) {
        conditions.push(`c.categorie = '${categorie}'`);
    }
    if (enStock === "true") { // Vérifie que enStock est bien une string "true"
        conditions.push(`s.quantite > 0`);
    }
    if (enStock === "false") {
        conditions.push(`s.quantite = 0`)
    }

    // Ajout des conditions dynamiquement
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    query += ` ORDER BY p.nom`;

    db.query(query, (err, results) => {
        if (err) {
            // Si erreur dans la requête SQL
            return res.status(500).send('Erreur de base de données');
        }
        if (results.length === 0) {
            // Si aucune ressource trouvée, on renvoie un 404
            return res.status(404).send('Aucun produit trouvé');
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        // On renvoie les résultats si tout va bien
        res.json(results);
    });
});

// route pour Categorie

/**
 * @swagger
 * /api/categorie:
 *   get:
 *     summary: Obtenir la liste de toutes les catégories
 *     description: Retourne l'identifiant et le nom de chaque catégorie.
 *     responses:
 *       200:
 *         description: Liste des catégories récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   categorie:
 *                     type: string
 *                     example: "Fruits"
 *       404:
 *         description: Aucune catégorie trouvée.
 *       500:
 *         description: Erreur serveur.
 */

router.get('/categorie', (req, res) => {
    const query = `SELECT id, categorie FROM magasin.tbCategorie`;
    db.query(query, (err, results) => {
        if (err) {
            // Si erreur dans la requête SQL
            console.error('Erreur lors de la récupération des catégories:', err);

            return res.status(500).send('Erreur de base de données');
        }
        if (results.length === 0) {
            // Si aucune ressource trouvée, on renvoie un 404
            return res.status(404).send('Aucune catégorie trouvée');
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        // On renvoie les résultats si tout va bien
        res.json(results);
    });
});

// Route pour ajouter un nouveau produit

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Ajouter un nouveau produit
 *     description: Ajoute un produit à la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Pomme"
 *               quantite:
 *                 type: integer
 *                 example: 50
 *               unité:
 *                 type: string
 *                 example: "pc"
 *               prix:
 *                 type: number
 *                 example: 2.50
 *               categorie:
 *                 type: string
 *                 example: "Fruit"
 *               dateLivraison:
 *                  type: date
 *                  example: "2025-03-24T23:00:00.000Z"
 *               taxe:
 *                  type: integer
 *                  example: 21
 *     responses:
 *       201:
 *         description: Produit créé avec succès.
 *       400:
 *         description: Données invalides.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/products',async (req, res) => {
    try {
        console.log("Requête reçue pour créer un produit...",req.body);
        const {nom, quantite,unite, prix, categorie,dateLivraison, dateDebutVente, dateFinVente, taxe} = req.body

        const [verifProd] = await promisePool.query("SELECT id FROM magasin.tbProduits WHERE  nom = ?", [nom]);
        if(verifProd.length > 0) {
            return res.status(400).send('Le produit existe déjà');
        }
        const dateLivraisonFinal = (dateLivraison === "" ? null : dateLivraison)

        const dateFinVenteFinal = (dateFinVente === "" ? null : dateFinVente)
        await promisePool.query(`
            INSERT INTO magasin.tbUnite (unite)
            SELECT * FROM (SELECT ?) AS tmp(unite)
            WHERE NOT EXISTS (
                SELECT id FROM magasin.tbUnite WHERE unite = ?
            ) LIMIT 1;`, [unite,unite]);
        const [verifUnite] = await promisePool.query("SELECT id FROM magasin.tbUnite WHERE  unite = ?", [unite]);
        const idUnite = verifUnite[0].id;

        await promisePool.query(`
            INSERT INTO magasin.tbCategorie (categorie)
            SELECT * FROM (SELECT ?) AS tmp(categorie)
            WHERE NOT EXISTS (
                SELECT id FROM magasin.tbCategorie WHERE categorie = ?
            ) LIMIT 1;
        `, [categorie, categorie]);
        const [verifCategorie] = await promisePool.query("SELECT id FROM magasin.tbCategorie WHERE categorie = ?", [categorie]);
        const idCategorie = verifCategorie[0].id;

        await promisePool.query(`
            INSERT INTO magasin.tbTaxe (taxe)
            SELECT * FROM (SELECT ?) AS tmp(taxe)
            WHERE NOT EXISTS (
                SELECT id FROM magasin.tbTaxe WHERE taxe = ?
            ) LIMIT 1;
        `, [taxe, taxe]);
        const [verifTaxe] = await promisePool.query("SELECT id FROM magasin.tbTaxe WHERE taxe = ?", [taxe]);
        const idTaxe = verifTaxe[0].id;

        await promisePool.query(`
            INSERT INTO magasin.tbProduits (nom, prix, dateDebutVente, dateFinVente, idUnite, idTaxe, idCategorie)
            SELECT nom, prix, dateDebutVente, ?, idUnite, idTaxe, idCategorie
            FROM (SELECT ?, ?, ?, ?, ?, ?, ?) AS tmp(nom, prix, dateDebutVente, dateFinVente, idUnite, idTaxe, idCategorie)
            WHERE NOT EXISTS (
                SELECT id FROM magasin.tbProduits WHERE nom = ?
            ) LIMIT 1;
        `, [dateFinVenteFinal, nom, prix, dateDebutVente, dateFinVente, idUnite, idTaxe, idCategorie, nom]);
        const [verifProduit] = await promisePool.query("SELECT id FROM magasin.tbProduits WHERE nom = ?", [nom]);
        const idProduit = verifProduit[0].id;

        await promisePool.query(`
            INSERT INTO magasin.tbStock (idProduit, quantite, dateLivraison)
            SELECT idProduit, quantite, ? FROM (SELECT ?, ?, ?) AS tmp(idProduit, quantite, dateLivraison)
            WHERE NOT EXISTS (
                SELECT idProduit FROM magasin.tbStock WHERE idProduit = ?
            );
        `, [dateLivraisonFinal, idProduit, quantite, dateLivraison, idProduit]);

        res.status(201).send('Produit créé avec succès')

    } catch (error) {
        // Si erreur dans la requête SQL
        console.error('Erreur lors de la récupération des catégories:', error);
        console.error('Erreur lors de l\'insertion du produit:', error); // Affiche l'erreur exacte

        return res.status(500).send('Erreur de base de données');
    }
});

// Route pour modifier un produit

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mettre à jour un produit existant
 *     description: Modifie les informations d'un produit en fonction de son id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Pomme"
 *               quantite:
 *                 type: integer
 *                 example: 50
 *               unité:
 *                 type: string
 *                 example: "pc"
 *               prix:
 *                 type: number
 *                 example: 2.50
 *               categorie:
 *                 type: string
 *                 example: "Fruit"
 *               status:
 *                 type: string
 *                 example: "En stock"
 *               dateLivraison:
 *                  type: date
 *                  example: "2025-03-24T23:00:00.000Z"
 *               taxe:
 *                  type: integer
 *                  example: 21
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *       400:
 *         description: Données invalides.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/products/:id', (req, res) => {
});

// Route pour supprimer un produit

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     description: Supprime un produit de la base de données en fonction de son id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à supprimer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.delete('/products/:id', (req, res) => {
});

// Route pour modifier le statut du produit

/**
 * @swagger
 * /api/products/{id}/status:
 *   put:
 *     summary: Mettre à jour le statut d'un produit existant
 *     description: Modifie le statut d'un produit en fonction de son id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Hors stock"
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/products/:id/status', (req, res) => {
});

// Route pour mettre une date de livraison au produit

/**
 * @swagger
 * /api/products/{id}/dateLivraison:
 *   put:
 *     summary: Mettre une date de livraison pour un produit existant
 *     description: donner une date de livraison à un produit en fonction de son id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateLivraison:
 *                 type: date
 *                 example: "2025-03-24T23:00:00.000Z"
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *       400:
 *         description: Données invalides.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/products/:id/dateLivraison', (req, res) => {
});

// Route pour alerte si le produit est faible en stock

/**
 * @swagger
 * /alerts/stockFaible:
 *   get:
 *     summary: Alerter si le stock est trop faible
 *     description: Retourne tous les produits qui ont un stock trop faible avec le nom, prix et quantité.
 *     responses:
 *       200:
 *         description: Liste des produits faible.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nom:
 *                     type: string
 *                     example: "Banane"
 *                   prix:
 *                     type: number
 *                     example: 3.00
 *                   quantite:
 *                     type: integer
 *                     example: 4
 *                   status:
 *                     type: string
 *                     example: "En stock"
 *                   categorie:
 *                     type: string
 *                     example: "Fruit"
 *                   dateLivraison:
 *                     type: date
 *                     example: "2025-03-24T23:00:00.000Z"
 *       404:
 *         description: Aucun produit trouvé.
 *       500:
 *         description: Erreur avec la base de données.

 */
router.get('/alerts/stockFaible', (req, res) => {

});
module.exports = router;



// route pour Cart

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtenir la liste des articles du panier
 *     description: Retourne les informations des produits du panier (id, name, price, quantity, stock).
 *     responses:
 *       200:
 *         description: Liste des articles récupérés avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Pomme"
 *                   price:
 *                     type: number
 *                     example: 3.2
 *                   quantity:
 *                     type: number
 *                     example: 4
 *                   stock:
 *                     type: number
 *                     example: 6
 *
 *
 *
 *
 *
 *       404:
 *         description: Aucun articles trouvés dans le panier.
 *       500:
 *         description: Erreur serveur.
 */

router.get('/cart', (req, res) => {
    const query = `SELECT C.idCommande, P.nom, P.prix, C.quantite, S.quantite FROM magasin.tbCommandes as C JOIN magasin.tbProduits as P ON P.id = C.idProduit JOIN magasin.tbStock as S ON P.id = S.idProduit`;
    db.query(query, (err, results) => {
        if (err) {
            // Si erreur dans la requête SQL
            console.error('Erreur lors de la récupération des articles:', err);

            return res.status(500).send('Erreur de base de données');
        }
        if (results.length === 0) {
            // Si aucune ressource trouvée, on renvoie un 404
            return res.status(404).send('Aucun articles trouvés dans le panier.');
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        // On renvoie les résultats si tout va bien
        res.json(results);
    });
});


/**
 * @swagger
 * /api/addToCart:
 *   post:
 *     summary: Ajouter un article au panier
 *     description: Ajoute un produit dans le panier en insérant une ligne dans la table tbCommandes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProduit
 *               - idClient
 *               - quantite
 *             properties:
 *               idProduit:
 *                 type: integer
 *                 example: 2
 *               idClient:
 *                 type: integer
 *                 example: 1
 *               quantite:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Produit ajouté au panier avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produit ajouté au panier avec succès
 *                 idCommande:
 *                   type: integer
 *                   example: 12
 *       400:
 *         description: Données manquantes ou invalides.
 *       500:
 *         description: Erreur serveur.
 */


router.post('/addToCart', (req, res) => {
    const { idProduit, idClient, quantite } = req.body;

    if (!idProduit || !idClient || !quantite) {
        return res.status(400).send("Données manquantes");
    }

    const dateCommande = new Date();

    const query = `
        INSERT INTO magasin.tbCommandes (idProduit, idClient, quantite, dateCommande)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [idProduit, idClient, quantite, dateCommande], (err, results) => {
        if (err) {
            console.error("Erreur lors de l'ajout au panier:", err);
            return res.status(500).send("Erreur de base de données");
        }

        res.status(201).json({ message: "Produit ajouté au panier avec succès", idCommande: results.insertId });
    });
});

/**
 * @swagger
 * /api/produit/{idProduit}/composition:
 *   get:
 *     summary: Obtenir la composition complète d’un produit
 *     description: Retourne les allergènes, ingrédients et informations nutritionnelles d’un produit donné.
 *     parameters:
 *       - in: path
 *         name: idProduit
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Composition récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allergenes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nom:
 *                         type: string
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nom:
 *                         type: string
 *                       ordre:
 *                         type: integer
 *                 nutrition:
 *                   type: object
 *                   properties:
 *                     calories:
 *                       type: number
 *                     proteines:
 *                       type: number
 *                     glucides:
 *                       type: number
 *                     lipides:
 *                       type: number
 *                     fibres:
 *                       type: number
 *                     sel:
 *                       type: number
 *       404:
 *         description: Aucune composition trouvée pour ce produit.
 *       500:
 *         description: Erreur serveur.
 */

router.get('/produit/:idProduit/composition', async (req, res) => {
    const { idProduit } = req.params;

    try {
        const allergenesQuery = `
            SELECT a.id, a.nom
            FROM magasin.tbProduitAllergene pa
            JOIN magasin.tbAllergene a ON pa.idAllergene = a.id
            WHERE pa.idProduit = ?
        `;
        const [allergenes] = await db.promise().query(allergenesQuery, [idProduit]);

        const ingredientsQuery = `
            SELECT i.id, i.nom, pi.ordre
            FROM magasin.tbProduitIngredient pi
            JOIN magasin.tbIngredient i ON pi.idIngredient = i.id
            WHERE pi.idProduit = ?
            ORDER BY pi.ordre ASC
        `;
        const [ingredients] = await db.promise().query(ingredientsQuery, [idProduit]);

        const nutritionQuery = `
            SELECT calories, proteines, glucides, lipides, fibres, sel
            FROM magasin.tbNutrition
            WHERE idProduit = ?
        `;
        const [nutritionRows] = await db.promise().query(nutritionQuery, [idProduit]);
        const nutrition = nutritionRows[0] || null;

        if (!allergenes.length && !ingredients.length && !nutrition) {
            return res.status(404).send('Aucune composition trouvée pour ce produit');
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json({ allergenes, ingredients, nutrition });
    } catch (err) {
        console.error('Erreur lors de la récupération de la composition du produit :', err);
        res.status(500).send('Erreur de base de données');
    }
});



module.exports = router;
