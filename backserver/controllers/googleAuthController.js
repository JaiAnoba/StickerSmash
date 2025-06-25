const passport = require('passport');
const jwt = require('jsonwebtoken');


exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleAuthCallback = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Google authentication failed.' });
  }
 
  const token = jwt.sign({ userId: req.user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
 
  res.json({ message: 'Google login successful.', token });
};
