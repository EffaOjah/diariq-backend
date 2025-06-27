// routes/authRoute.js
const { Router } = require('express');

// diaryController.js
const { user_dashboard_get,
    add_diary_entry_post,
    diary_entry_details_get,
    edit_diary_entry_post,
    delete_diary_entry_post
} = require('../controllers/diaryController');

// AuthenticateToken middleware
const authenticateToken = require('../middleware/authMiddleware');

const router = Router();

// User dashboard route (GET)
router.get('/user/dashboard', authenticateToken, user_dashboard_get);

// Add diary entry route (POST)
router.post('/api/v1/add-entry', authenticateToken, add_diary_entry_post);

// Get diary entry (GET)
router.get('/entry/:entryId', authenticateToken, diary_entry_details_get);

// Update diary entry route (POST)
router.post('/api/v1/entry/:entryId', authenticateToken, edit_diary_entry_post);

// Delete diary entry route (DELETE)
router.post('/api/v1/entry/:entryId/delete', authenticateToken, delete_diary_entry_post);


module.exports = router;