const mongoose = require('mongoose');

const burgerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // FK to User
  name: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String },
  totaltime: { type: String },
  calorie: { type: Number },
  status: { type: String, default: 'active' },
  image: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Burger', burgerSchema, 'burger');
