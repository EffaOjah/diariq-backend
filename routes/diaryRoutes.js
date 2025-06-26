// routes/authRoute.js
const { Router } = require('express');

// diaryController.js
const { user_dashboard_get,
    add_diary_entry_post,
    diary_entry_details_get
} = require('../controllers/diaryController');

// AuthenticateToken middleware
const authenticateToken = require('../middleware/authMiddleware');

const router = Router();

// User dashboard route (GET)
router.get('/user/dashboard', authenticateToken, user_dashboard_get);

// Add diary enty route (POST)
router.post('/api/v1/add-entry', authenticateToken, add_diary_entry_post);

// Get diary entry (GET)
router.get('/entry/:entryId', authenticateToken, diary_entry_details_get);

module.exports = router;