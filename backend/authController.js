const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

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
// token generation function
function tokenGen(idd, nom, prenom, email){
    const payload = { id: idd, nom, prenom, email };
    return  jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

// Crée une version Promise du pool
const promisePool = db2.promise();

// Vérification de la connexion
db.connect(err => {
    if (err) {
        console.error("❌ Erreur de connexion à la base de données :", err);
        process.exit(1); // Arrête l'application si la connexion échoue
    }
    console.log("✅ Connexion réussie à la base de données !");
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordValid = (pw) => pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);

router.post('/register', async (req, res) => {
    try {
        const { email, password, nom, prenom, tel } = req.body;

        // 1) Basic type-checks
        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            typeof nom !== 'string' ||
            typeof prenom !== 'string' ||
            typeof tel !== 'string'
        ) {
            return res.status(400).json({ error: 'Format de données invalide' });
        }

        // 2) Field‐specific validation
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }
        if (!isPasswordValid(password)) {
            return res.status(400).json({
                error: 'Le mot de passe doit faire ≥ 8 caractères, inclure une majuscule et un chiffre'
            });
        }
        if (!/^\d{10}$/.test(tel)) {
            return res.status(400).json({ error: 'Le téléphone doit avoir 10 chiffres' });
        }

        // 3) Uniqueness checks
        const [emailRows] = await promisePool.query(
            'SELECT id FROM magasin.tbclients WHERE adresseMail = ?',
            [email]
        );
        if (emailRows.length > 0) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }

        const [telRows] = await promisePool.query(
            'SELECT id FROM magasin.tbclients WHERE tel = ?',
            [tel]
        );
        if (telRows.length > 0) {
            return res.status(400).json({ error: 'Numéro de téléphone déjà utilisé' });
        }

        // 4) Hash & insert
        const hash = await bcrypt.hash(password, 10);
        const [result] = await promisePool.query(
            `INSERT INTO magasin.tbclients 
        (nom, prenom, password, adresseMail, tel) 
        VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, hash, email, tel]
        );

        const token = tokenGen(result.insertId,nom,prenom,email);

        return res.status(201).json({ message: 'Compte créé avec succès', token });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(400).json({ error: 'Erreur de creation de compte' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM magasin.tbclients WHERE adresseMail = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        const token = tokenGen(user.id, user.nom, user.prenom, user.adresseMail);
        return res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
