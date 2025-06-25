const mongoose = require('mongoose');

const shareAppSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedemail: { type: String, required: true },
  date: { type: Date, default: Date.now },
  message: { type: String },
});

module.exports = mongoose.model('ShareApp', shareAppSchema, 'shareapp');
