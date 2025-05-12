const express = require('express');
const cors = require('cors');
const productController = require('./productController');
const authController = require('./authController'); // Nouvelle ligne
const { swaggerUi, specs } = require("../swagger");
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const favorisController = require('./favorisController');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = 6942;

// Middleware de sécurité
app.use(cors());
app.use(express.json());
app.use(rateLimit({ // Nouveau middleware
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes depuis cette IP'
}));


// Routes
app.use('/api/favoris', favorisController);
app.use('/api/auth', authController); // Auth routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', productController);

// Test API
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});
app.get('/api/validate-token', authenticateToken, (req, res) => {
    res.json({ valid: true });
});

// Middleware d'authentification (Nouveau)
function authenticateToken(req, res, next) {
    // 1) Grab the header
    const authHeader = req.headers['authorization'];           // e.g. "Bearer abc.def.ghi"
    const token      = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    // 2) Verify signature + decode
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            // err.name === 'TokenExpiredError' or 'JsonWebTokenError'
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }

        // 3) Attach the decoded payload to req.user
        req.user = payload;
        next();
    });
};

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});