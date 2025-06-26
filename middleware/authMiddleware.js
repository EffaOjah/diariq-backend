// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt_token;

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Invalid token');

            return res.status(403).json({ success: false, message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;