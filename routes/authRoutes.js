// routes/authRoute.js
const { Router } = require('express');

// AuthenticateToken middleware
const authenticateToken = require('../middleware/authMiddleware');

// authController.js
const { user_register_get, user_login_get, local_user_register_post, verifyEmail, local_user_login_post, backup_verify_email_page_get, send_verification_email_post } = require('../controllers/authController');

const router = Router();

// User register route (GET)
router.get('/user/register', user_register_get);

// User login route (GET)
router.get('/user/login', user_login_get);

// User local register route (POST)
router.post('/api/auth/v1/user/register', local_user_register_post);

// Backup email verification route (GET)
// This is if user's email wasn't verified on sign up 
router.get('/verify-email', authenticateToken, backup_verify_email_page_get);

// Verify email route (GET)
router.get('/api/auth/v1/verify-email', verifyEmail);

// User local register route (POST)
router.post('/api/auth/v1/user/login', local_user_login_post);

// Send Verification email route
router.post('/api/auth/v1/send-verification-email', authenticateToken, send_verification_email_post)
module.exports = router;