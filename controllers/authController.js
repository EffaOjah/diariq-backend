// controllers/authController.js
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require("uuid");

// Require sendEmail service
const sendEmail = require('../utils/sendEmail');

// Load emailTemplate
const loadTemplate = require('../utils/loadTemplate');

// generate jwt token
const generateToken = require('../utils/generateToken');

// Require userModel
const { getUserByEmail,
    getUserByUsername,
    createLocalUser,
    insertVerificationToken,
    getVerificationToken,
    setIsVerified,
    updateVerificationTokenStatus
} = require('../models/userModel');

// Require testEmail Function
const { isValidEmail } = require('../extraFunctions/functions');

// Get route for user register
const user_register_get = (req, res) => {
    res.json({
        url: req.url,
        message: 'User Register Page'
    });
}

// Get route for user login
const user_login_get = (req, res) => {
    res.json({
        url: req.url,
        message: 'User Login Page'
    });
}

// Post route for local user register
const local_user_register_post = async (req, res, next) => {
    const { name, email, username, password } = req.body;
    console.log('Sign up details: ', req.body);

    // Check if all details were provided
    if (!name || !email || !username || !password) {
        console.log('Please provide all details!');
        return res.status(400).json({ success: false, message: 'Please provide all details!' });
    }

    // Check if email provided is valid
    if (!isValidEmail(email)) {
        console.log('Please provide a valid email!');
        return res.status(400).json({ success: false, message: 'Please provide a valid email!' });
    }

    try {
        // Now check if the user already exists
        // Check email
        const checkUserByEmail = await getUserByEmail(email);
        console.log('Check user results: ', checkUserByEmail);

        if (checkUserByEmail.length) {
            console.log('User with the provided email already exists!');
            return res.status(400).json({ success: false, message: 'User with the provided email already exists!' });
        }

        // Check username
        const checkUserByUsername = await getUserByUsername(username);
        console.log('Check user results: ', checkUserByUsername);

        if (checkUserByUsername.length) {
            console.log('User with the provided username already exists!');
            return res.status(400).json({ success: false, message: 'User with the provided username already exists!' });
        }

        // Hash the user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Now, create the user
        const userId = uuidv4();
        await createLocalUser(userId, name, email, username, hashedPassword);

        // Now get the user
        const justCreatedUser = await getUserByUsername(username);
        console.log('Just created user: ', justCreatedUser[0]);

        // Process to verify user
        // Create verification token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

        // Insert the verification token into the database
        const tokenId = uuidv4();
        await insertVerificationToken(tokenId, justCreatedUser[0].user_id, token, expiresAt);

        // Load the html template
        const html = loadTemplate('welcomeEmail.html', {
            USERNAME: `${username}`,
            VERIFICATION_LINK: `http://localhost:5000/api/auth/v1/verify-email?token=${token}`
        });

        await sendEmail(email, 'Welcome to Diariq 🎉!', html, 2, 3000);

        return res.status(201).json({ success: true, message: 'Account created. Please verify your email.' });
    } catch (error) {
        console.log('Internal Server Error: ', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured!' });
    }
}


// Post route for local user login
const local_user_login_post = async (req, res, next) => {
    const { username, password } = req.body;
    console.log('Log in details: ', req.body);

    // Check if all details were provided
    if (!username || !password) {
        console.log('Please provide all details!');
        return res.status(400).json({ success: false, message: 'Please provide all details!' });
    }

    try {
        // Check username
        const checkUserByUsername = await getUserByUsername(username);
        console.log('Check user results: ', checkUserByUsername);

        if (!checkUserByUsername.length) {
            console.log('User not found!');
            return res.status(401).json({ success: false, message: 'User not found!' });
        }
        let foundUser = checkUserByUsername[0];

        // Now compare passwords
        const comparePasswords = await bcrypt.compare(password, foundUser.password);
        if (!comparePasswords) {
            console.log('Incorrect password!');
            return res.status(401).json({ success: false, message: 'Incorrect password!' });
        }

        console.log('Successfully signed user in');

        // Generate JWT for the user
        const jwtToken = generateToken({
            userId: foundUser.user_id,
            username: foundUser.username,
            isVerified: foundUser.is_verified
        });

        // Set cookie with the token
        await res.cookie('jwt_token', jwtToken);

        res.redirect('/user/dashboard');

        // return res.status(200).json({ success: true, generatedToken: jwtToken });
    } catch (error) {
        console.log('Internal server error: ', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured!' });
    }
}


// Get route to verify email
const verifyEmail = async (req, res, next) => {
    try {
        const { token, backup } = req.query;

        const verificationToken = await getVerificationToken(token);

        if (!verificationToken.length) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token!' });
        }

        const userId = verificationToken[0].user_id;

        // Verify the user
        await setIsVerified(true, userId);

        // Update the status of the verification_token
        await updateVerificationTokenStatus(true, verificationToken[0].id);

        return res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('Internal server error: ', error)
        return res.status(500).json({ success: false, message: 'An unexpected error occured!' });
    }
};

// Get route for users' to verify their email
const backup_verify_email_page_get = (req, res) => {
    res.json({
        url: req.url,
        message: 'Verify User Page'
    });
}

// Post route to send verification email to the user
const send_verification_email_post = async (req, res) => {
    const { userId, username } = req.user;

    // Get user by username
    const getUser = await getUserByUsername(username);

    try {
        // Create verification token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

        // Insert the verification token into the database
        const tokenId = uuidv4();
        await insertVerificationToken(tokenId, userId, token, expiresAt);

        // Load the html template
        const html = loadTemplate('welcomeEmail.html', {
            USERNAME: `${username}`,
            VERIFICATION_LINK: `http://localhost:5000/api/auth/v1/verify-email?token=${token}&backup=true`
        });

        // Send the email
        await sendEmail(getUser[0].email, 'Welcome to Diariq 🎉!', html, 2, 3000);

        return res.status(201).json({ success: true, message: 'Verification email sent.' });
    } catch (error) {
        console.error('Internal server error: ', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }
}

module.exports = { user_register_get, user_login_get, local_user_register_post, verifyEmail, local_user_login_post, backup_verify_email_page_get, send_verification_email_post };