const CookingInstruction = require('../models/CookingInstruction');

exports.createInstruction = async (req, res) => {
  try {
    const instruction = new CookingInstruction(req.body);
    await instruction.save();
    res.status(201).json(instruction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getInstructions = async (req, res) => {
  try {
    const instructions = await CookingInstruction.find();
    res.json(instructions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInstruction = async (req, res) => {
  try {
    const instruction = await CookingInstruction.findById(req.params.id);
    if (!instruction) return res.status(404).json({ error: 'Not found' });
    res.json(instruction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInstruction = async (req, res) => {
  try {
    const instruction = await CookingInstruction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instruction) return res.status(404).json({ error: 'Not found' });
    res.json(instruction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteInstruction = async (req, res) => {
  try {
    const instruction = await CookingInstruction.findByIdAndDelete(req.params.id);
    if (!instruction) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
