const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

    // 1. Read the Authorization header
    const authHeader = req.headers.authorization;
    // 2. It should be in the form "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[0] === 'Bearer'
        ? authHeader.split(' ')[1]
        : null;
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
