const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ingredient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  amount: { type: String },
  check: { type: Boolean, default: false },
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema, 'shoppinglist');
