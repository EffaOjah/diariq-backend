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

// Function to update diary entry
const updateDiaryEntry = (newTitle, newContent, entryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [updateEntry] = await pool.query('UPDATE diary_entries SET title = ?, content = ? WHERE entry_id = ?', [newTitle, newContent, entryId]);
            resolve(updateEntry);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to delete diary entry
const deleteDiaryEntry = (entryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [deleteEntry] = await pool.query('DELETE FROM diary_entries WHERE entry_id = ?', [entryId]);
            resolve(deleteEntry);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    insertDiaryEntry,
    getEntryByEntryId,
    updateDiaryEntry,
    deleteDiaryEntry
}