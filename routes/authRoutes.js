// controllers/authRoute.js
const { Router } = require('express');

// authController.js
const { user_register_get, user_login_get, local_user_register_post, verifyEmail } = require('../controllers/authController');

const router = Router();

// User register route (GET)
router.get('/user/register', user_register_get);

// User login route (GET)
router.get('/user/login', user_login_get);

// User local register route (POST)
router.post('/user/register', local_user_register_post);

// Verify email route (GET)
router.get('/verify-email', verifyEmail);

module.exports = router;