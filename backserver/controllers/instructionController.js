const Instruction = require('../models/Instruction');

// Create a new instruction
exports.createInstruction = async (req, res) => {
  try {
    const instruction = new Instruction({
      burger_id: req.body.burger_id,
      step_no: req.body.step_no,
      description: req.body.description,
      check: req.body.check || false,
    });
    await instruction.save();
    res.status(201).json(instruction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all instructions
exports.getInstructions = async (req, res) => {
  try {
    const instructions = await Instruction.find();
    res.json(instructions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single instruction by ID
exports.getInstruction = async (req, res) => {
  try {
    const instruction = await Instruction.findById(req.params.id);
    if (!instruction) return res.status(404).json({ error: 'Not found' });
    res.json(instruction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an instruction by ID
exports.updateInstruction = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };
    const instruction = await Instruction.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!instruction) return res.status(404).json({ error: 'Not found' });
    res.json(instruction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an instruction by ID
exports.deleteInstruction = async (req, res) => {
  try {
    const instruction = await Instruction.findByIdAndDelete(req.params.id);
    if (!instruction) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
