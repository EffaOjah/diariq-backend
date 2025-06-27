// controllers/diaryController.js
const { v4: uuidv4 } = require("uuid");

const { encrypt, decrypt } = require('../utils/encryption');

// Require diaryModel
const { insertDiaryEntry, getEntryByEntryId, updateDiaryEntry, deleteDiaryEntry } = require('../models/diaryModel');

// Get route for user dashboard
const user_dashboard_get = (req, res) => {
    if (!req.user.isVerified) {
        console.log('User is not verified');
        return res.status(403).json({ success: false, message: 'Please verify your email!' });
    }
    console.log(req.user);

    res.json({
        url: req.url,
        message: 'User Dashboard Page'
    });
}

// Post route to add user entry
const add_diary_entry_post = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Check if all details were provided
        if (!title || !content) {
            console.log('Please provided all entry details');
            return res.status(400).json({ success: false, message: 'Please provided all entry details' });
        }

        // Check if entry title is more than 150 character length
        if (title.length > 150) {
            console.log('Entry title should be 150 characters or less!');
            return res.status(400).json({ success: false, message: 'Entry title should be 150 characters or less!' });
        }

        // Encrypt diary entries before sending it to the database
        const encryptedTitle = encrypt(title);
        const encryptedContent = encrypt(content);

        console.log('Encrypted Title: ', encryptedTitle, '\n', 'Encrypted Content: ', encryptedContent);

        // Now, insert the encrypted details into the database
        const entryId = uuidv4();
        await insertDiaryEntry(entryId, req.user.userId, encryptedTitle, encryptedContent);

        // Get the just added entry
        const justAddedEntry = await getEntryByEntryId(entryId);
        console.log('justAddedEntry: ', justAddedEntry);

        return res.status(201).json({ success: true, message: 'Successfully added diary entry!', entryId: justAddedEntry[0].entry_id, createdAt: justAddedEntry[0].created_at });
    } catch (error) {
        console.log('Internal server error: ', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred!' });
    }
}

// Get route to get diary entry details
const diary_entry_details_get = async (req, res) => {
    try {
        const { entryId } = req.params;

        // Get the entry details
        const entryDetails = await getEntryByEntryId(entryId);

        // Check if the entry exist
        if (!entryDetails.length) {
            console.log('Entry not found!');
            return res.status(404).json({ success: false, message: 'Entry not found!' });
        }

        console.log(entryDetails);

        // If entry was found
        // Decrypt the entry
        const decryptedTitle = decrypt(entryDetails[0].title);
        const decryptedContent = decrypt(entryDetails[0].content);
        console.log(decryptedTitle, decryptedContent);


        // Now update the entry object
        entryDetails[0].title = decryptedTitle;
        entryDetails[0].content = decryptedContent;

        return res.status(200).json({ success: true, entryDetails: entryDetails[0] });
    } catch (error) {
        console.log('Error while requesting for entry: ', error);
        return res.status(400).json({ success: false, message: 'An unexpected error occurred!' });
    }
}

// Post route to update diary entry
const edit_diary_entry_post = async (req, res) => {
    try {
        const { entryId } = req.params;
        const { newTitle, newContent } = req.body;

        // Fetch the entry from the database
        const entry = await getEntryByEntryId(entryId);

        // Check if the entry exists
        if (!entry.length) {
            console.log('Entry not found!');
            return res.status(404).json({ success: false, message: 'Entry not found!' });
        }

        // Now, check if the entry belongs to the logged in user
        if (entry[0].user_id !== req.user.userId) {
            console.log('This is entry does not belong to the logged in user!');
            return res.status(403).json({ success: false, message: 'You are not allowed to access this diary entry!' });
        }

        // Check if all details were provided
        if (!newTitle || !newContent) {
            console.log('Please provided all entry details');
            return res.status(400).json({ success: false, message: 'Please provided all entry details' });
        }

        // Check if entry title is more than 150 character length
        if (newTitle.length > 150) {
            console.log('Entry title should be 150 characters or less!');
            return res.status(400).json({ success: false, message: 'Entry title should be 150 characters or less!' });
        }

        // Encrypt diary entries before sending it to the database
        const encryptedTitle = encrypt(newTitle);
        const encryptedContent = encrypt(newContent);

        console.log('Encrypted Title: ', encryptedTitle, '\n', 'Encrypted Content: ', encryptedContent);

        // Now updated the entry in the database
        const updateEntry = await updateDiaryEntry(encryptedTitle, encryptedContent, entryId);

        return res.status(200).json({ success: true, message: 'Successfully updated entry!' });
    } catch (error) {
        console.log('Error while updating the entry: ', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured!' });
    }
}

// Post route to delete diary entry
const delete_diary_entry_post = async (req, res) => {
    try {
        const { entryId } = req.body;

        // Fetch the entry from the database
        const entry = await getEntryByEntryId(entryId);
        console.log(entry);


        // Check if the entry exists
        if (!entry.length) {
            console.log('Entry not found!');
            return res.status(404).json({ success: false, message: 'Entry not found!' });
        }

        // Now, check if the entry belongs to the logged in user
        if (entry[0].user_id !== req.user.userId) {
            console.log('This is entry does not belong to the logged in user!');
            return res.status(403).json({ success: false, message: 'You are not allowed to access this diary entry!' });
        }

        // Delete the entry from the database
        await deleteDiaryEntry(entry[0].entry_id);

        return res.status(200).json({ success: true, message: 'Entry deleted successfully!' });
    } catch (error) {
        console.log('Error while deleting entry: ', error);
        return res.status(500).json({ success: false, message: 'An enexpected error occurred!' });
    }
}

module.exports = { user_dashboard_get, add_diary_entry_post, diary_entry_details_get, edit_diary_entry_post, delete_diary_entry_post };