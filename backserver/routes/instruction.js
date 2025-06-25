const express = require('express');
const router = express.Router();
const instructionController = require('../controllers/instructionController');

// Create a new instruction
router.post('/', instructionController.createInstruction);

// Get all instructions
router.get('/', instructionController.getInstructions);

// Get a single instruction by ID
router.get('/:id', instructionController.getInstruction);

// Update an instruction by ID
router.put('/:id', instructionController.updateInstruction);

// Delete an instruction by ID
router.delete('/:id', instructionController.deleteInstruction);

module.exports = router;
