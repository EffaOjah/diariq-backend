// Require db connection
const pool = require('../config/db').pool

// Function to get user using email
const getUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to get user using username
const getUserByUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to create a new user
const createLocalUser = (userId, name, email, username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [createUser] = await pool.query('INSERT INTO users (user_id, name, email, username, password) VALUES (?, ?, ?, ?, ?)', [userId, name, email, username, password]);
            resolve(createUser);
        } catch (error) {
            reject(error);
        }
    })
}

// Function to insert into the email_verification_tokens table
const insertVerificationToken = (tokenId, userId, token, expiresAt) => {
    return new Promise(async (resolve, reject) => {
        try {
            const insertToken = await pool.query('INSERT INTO email_verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)', [tokenId, userId, token, expiresAt]);
            resolve(insertToken);
        } catch (error) {
            reject(error);
        }
    })
}

// Function to get the verification token from the database
const getVerificationToken = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await pool.query('SELECT * FROM email_verification_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()', [token]);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to set user "isverified"
function setIsVerified(status, userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const [setIsVerified] = await pool.query('UPDATE users SET is_verified = ? WHERE user_id = ?', [status, userId]);
            resolve(setIsVerified);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to update the status of the verification token
function updateVerificationTokenStatus(status, tokenId) {
    return new Promise(async (resolve, reject) => {
        try {
            const [updateStatus] = await pool.query('UPDATE email_verification_tokens SET used = ? WHERE id = ?', [status, tokenId]);
            resolve(updateStatus);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getUserByEmail,
    getUserByUsername,
    createLocalUser,
    insertVerificationToken,
    getVerificationToken,
    setIsVerified,
    updateVerificationTokenStatus
}