const mongoose = require('mongoose');

const nutritionListSchema = new mongoose.Schema({
  burger_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Burger', required: true },
  calorie: { type: Number },
  fat: { type: Number },
  protein: { type: Number },
  carbohydrate: { type: Number },
});

module.exports = mongoose.model('NutritionList', nutritionListSchema, 'nutritionlist');
