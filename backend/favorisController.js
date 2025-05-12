const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./middleware/auth'); // Correct import
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Ajouter un produit aux favoris
router.post('/', authenticateToken, async (req, res) => {
    const idClient = req.user.id;
    const { idProduit } = req.body;

    try {
        await db.query(
            'INSERT INTO magasin.tbFavoris (idClient, idProduit, dateFavoris) VALUES (?, ?, CURDATE())',
            [idClient, idProduit]
        );
        res.status(201).json({ message: 'Favori ajouté' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Déjà dans les favoris' });
        }
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Récupérer les favoris
router.get('/', authenticateToken, async (req, res) => {
    const idClient = req.user.id;

    try {
        const [rows] = await db.query(
            `SELECT p.* FROM magasin.tbProduits p
       JOIN magasin.tbFavoris f ON f.idProduit = p.id
       WHERE f.idClient = ?`,
            [idClient]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
