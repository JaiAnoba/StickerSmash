const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const googleAuthController = require('../controllers/googleAuthController');
const passport = require('passport');

// Start Google OAuth
router.get('/', googleAuthController.googleAuth);

// Google OAuth callback
router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), googleAuthController.googleAuthCallback);

// Password reset verification and update
router.get('/reset-password/:token', authController.verifyResetToken); // GET: verify token and show reset form (API: just verify)
router.post('/reset-password/:token', authController.resetPassword);   // POST: update password

module.exports = router;
