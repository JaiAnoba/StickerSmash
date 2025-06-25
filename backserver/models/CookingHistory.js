const mongoose = require('mongoose');

const cookingHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  burger_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Burger', required: true },
  cookdate: { type: Date, default: Date.now },
  rating: { type: Number },
});

module.exports = mongoose.model('CookingHistory', cookingHistorySchema, 'cookinghistory');
