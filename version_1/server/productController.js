const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // ping toutes les 10s
});

// Tester la connexion une fois au démarrage
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log("✅ Connecté à MySQL !");
        connection.release();
    } catch (err) {
        console.error("❌ Erreur de connexion MySQL:", err.message);
    }
}

testConnection();

// (optionnel) Ping périodique pour garder le pool actif
setInterval(async () => {
    try {
        const [rows] = await db.query('SELECT 1');
        // console.log("🔄 Ping MySQL");
    } catch (err) {
        console.error("❌ Erreur lors du ping MySQL:", err.message);
    }
}, 60 * 1000); // toutes les 60 secondes

module.exports = { db, router };

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
        tbProduits p
    JOIN
        tbStock s ON p.id = s.idProduit
    JOIN
        tbCategorie c ON p.idCategorie = c.id
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
    const query = `SELECT id, categorie FROM tbCategorie`;
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
 *       201:
 *         description: Produit créé avec succès.
 *       400:
 *         description: Données invalides.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/products', (req, res) => {
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
