const mongoose = require('mongoose');

const nutritionInfoSchema = new mongoose.Schema({
  calories: { type: Number },
  protein: { type: Number },
  fat: { type: Number },
  carbs: { type: Number },
  sugar: { type: Number },
  fiber: { type: Number },
  sodium: { type: Number },
  cholesterol: { type: Number },
  servingSize: { type: String },
});

module.exports = mongoose.model('NutritionInfo', nutritionInfoSchema, 'nutritioninfo');
