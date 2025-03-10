const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'devIII',
    password: 'user123',
    database: 'magasin',
    charset: 'utf8mb4'
});

// route pour la liste de produits
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
            return res.status(404).send('Aucun produit trouvé');
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        // On renvoie les résultats si tout va bien
        res.json(results);
    });
});

module.exports = router;