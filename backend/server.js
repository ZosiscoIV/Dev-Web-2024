const express = require('express');
const cors = require('cors');
const productController = require('./productController');
const { swaggerUi, specs } = require("../swagger");
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const favorisController = require('./favorisController');
const authController = require('./authController'); // Add this missing import
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = 6942;

// Middleware de sécurité
app.use(cors());
app.use(express.json());
app.use(rateLimit({
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});