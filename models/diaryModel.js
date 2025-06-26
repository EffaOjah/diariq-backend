// Require db connection
const pool = require('../config/db').pool

// Function to insert diary entry into the database
const insertDiaryEntry = (entryId, userId, title, content) => {
    return new Promise(async (resolve, reject) => {
        try {
            const insertEntry = await pool.query('INSERT INTO diary_entries (entry_id, user_id, title, content) VALUES (?, ?, ?, ?)', [entryId, userId, title, content]);
            resolve(insertEntry);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to get an entry using the entryId
const getEntryByEntryId = (entryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await pool.query('SELECT * FROM diary_entries WHERE entry_id = ?', [entryId]);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    insertDiaryEntry,
    getEntryByEntryId
}