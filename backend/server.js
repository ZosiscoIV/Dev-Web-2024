const express = require('express');
const cors = require('cors');
const productController = require('./productController');
const authController = require('./authController'); // Nouvelle ligne
const { swaggerUi, specs } = require("../swagger");
const rateLimit = require('express-rate-limit'); // Nouvelle ligne

const app = express();
const PORT = 6942;

// Middleware de sécurité ajouté
app.use(cors());
app.use(express.json());
app.use(rateLimit({ // Nouveau middleware
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes depuis cette IP'
}));

// Routes existantes
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

// Nouveaux endpoints d'authentification
app.use('/api/auth', authController); // Nouvelle ligne

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', productController);

// Middleware d'authentification (Nouveau)
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [client] = await pool.query(
            `SELECT id FROM magasin.tbclients 
      WHERE id = ? AND is_deleted = FALSE`,
            [decoded.clientId]
        );

        if (!client.length) throw new Error();
        req.user = client[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Non autorisé' });
    }
};

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
