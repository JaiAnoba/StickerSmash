const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // FK to User
  burger_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Burger', required: true }, // FK to Burger
  rating: { type: Number, required: true },
  review: { type: String },
  status: { type: String, default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rating', ratingSchema, 'rating');
