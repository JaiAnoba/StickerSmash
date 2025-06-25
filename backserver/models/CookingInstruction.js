const mongoose = require('mongoose');

const cookingInstructionSchema = new mongoose.Schema({
  burgerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Burger' },
  stepNumber: { type: Number, required: true },
  instruction: { type: String, required: true },
  image: { type: String },
});

module.exports = mongoose.model('CookingInstruction', cookingInstructionSchema, 'cookinginstruction');
