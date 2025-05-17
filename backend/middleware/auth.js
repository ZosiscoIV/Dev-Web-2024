const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Lire le token depuis les cookies
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }

        req.user = payload;
        next();
    });
}

module.exports = { authenticateToken };
