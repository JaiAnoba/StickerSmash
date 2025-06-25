const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.isNew && this.provider !== 'google'; }, default: null },
  fullName: { type: String, required: false },
  provider: { type: String, required: true, default: 'local' },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

// Force collection name to 'user'
module.exports = mongoose.model('User', userSchema, 'user');
