const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, fullName });
    await user.save();
    // Generate token after signup
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.status(201).json({ message: 'User created successfully.', token, userId: user._id, name: user.fullName, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({ message: 'Signed in successfully.', token, userId: user._id, name: user.fullName, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Generate a 6-digit confirmation code
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = confirmationCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with confirmation code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      subject: 'Password Reset Confirmation Code',
      html: `<p>You requested a password reset.</p>
             <p>Your confirmation code is: <b>${confirmationCode}</b></p>
             <p>Enter this code in the app to verify your identity and reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Confirmation code sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Verifying token:', token);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log('User found for token:', user ? user.email : null, user ? user.resetPasswordToken : null, user ? user.resetPasswordExpires : null);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    res.json({ message: 'Token is valid. You can reset your password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.body.userId; // support both JWT and direct userId
    const { email, fullName } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });
    const update = {};
    if (email) update.email = email;
    if (fullName) update.fullName = fullName;
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'Profile updated successfully.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.body.userId; // support both JWT and direct userId
    const { oldPassword, newPassword } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Old and new passwords are required.' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Old password is incorrect.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
