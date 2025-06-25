const mongoose = require('mongoose');

const instructionSchema = new mongoose.Schema({
  burger_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Burger', required: true },
  step_no: { type: Number, required: true },
  description: { type: String },
  check: { type: Boolean, default: false },
});

module.exports = mongoose.model('Instruction', instructionSchema, 'instruction');
