// utils/generateToken.js
const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports = generateToken;