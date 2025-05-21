// backend/server.js
const express = require('express');
const cors = require('cors');
const productController = require('./productController');
const authController = require('./authController'); // Nouvelle ligne
const { swaggerUi, specs } = require("../swagger");
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const favorisController = require('./favorisController');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middleware/auth');
const helmet = require('helmet');

const app = express();
const PORT = 6942;

// Middleware de sécurité
const allowedOrigins = [
    'http://localhost:3000',
    'https://votre-site.com',
    'https://app.votre-site.com'
];

app.use(rateLimit({ // Nouveau middleware
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes depuis cette IP'
}));

app.use(
    helmet({
        // Enable all default protections
    })
);

// Then explicitly configure CSP:
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                // If you must allow inline (e.g. for a nonce-based approach):
                // "'unsafe-inline'",
                // Or better still, generate nonces and use "'nonce-<random>'"
            ],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'none'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: [], // enforce HTTPS
            // reportUri: '/csp-violation-report-endpoint'  // optional
        }
    })
);


app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());


// Routes
app.use('/api/favoris', favorisController);
app.use('/api/auth', authController); // Auth routes

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/api/validate-token', authenticateToken, (req, res) => {
    res.json({ valid: true });
});
// Test API
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});
app.use('/api', productController);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
