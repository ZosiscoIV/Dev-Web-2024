const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');
const { use } = require('react');
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

const promisePool = db2.promise();

db.connect(err => {
    if (err) {
        console.error("❌ Erreur de connexion à la base de données :", err);
        process.exit(1);
    }
    console.log("✅ Connexion réussie à la base de données !");
});

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordValid = pw => pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);

function tokenGen(id, nom, prenom, email, is_admin) {
    const payload = { id, nom, prenom, email, is_admin };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

router.post('/register', async (req, res) => {
    try {
        const { email, password, nom, prenom, tel } = req.body;

        if ([email, password, nom, prenom, tel].some(v => typeof v !== 'string')) {
            return res.status(400).json({ error: 'Format de données invalide' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }
        if (!isPasswordValid(password)) {
            return res.status(400).json({ error: 'Mot de passe invalide' });
        }
        if (!/^\d{10}$/.test(tel)) {
            return res.status(400).json({ error: 'Téléphone invalide' });
        }

        const [emailRows] = await promisePool.query('SELECT id FROM magasin.tbClients WHERE adresseMail = ?', [email]);
        if (emailRows.length > 0) return res.status(400).json({ error: 'Email déjà utilisé' });

        const [telRows] = await promisePool.query('SELECT id FROM magasin.tbClients WHERE tel = ?', [tel]);
        if (telRows.length > 0) return res.status(400).json({ error: 'Numéro de téléphone déjà utilisé' });

        const hash = await bcrypt.hash(password, 10);
        const [result] = await promisePool.query(
            `INSERT INTO magasin.tbClients (nom, prenom, password, adresseMail, tel) VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, hash, email, tel]
        );

        const token = tokenGen(result.insertId, nom, prenom, email);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(201).json({ message: 'Compte créé avec succès' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(400).json({ error: 'Erreur de creation de compte' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
        const [rows] = await promisePool.query('SELECT * FROM magasin.tbClients WHERE adresseMail = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Identifiants incorrects' });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

        const token = tokenGen(user.id, user.nom, user.prenom, user.adresseMail, user.is_admin);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ message: 'Connexion réussie', user:{id:user.id, nom: user.nom, prenom: user.prenom, email: user.adresseMail, is_admin: user.is_admin ===1} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;
