const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  burger_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Burger', required: true },
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: String },
  unit: { type: String },
  optional: { type: Boolean, default: false },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ingredient', ingredientSchema, 'ingredient');
