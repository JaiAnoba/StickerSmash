const express = require('express');
const router = express.Router();
const nutritionListController = require('../controllers/nutritionListController');

// Create a new nutrition list entry
router.post('/', nutritionListController.createNutrition);

// Get all nutrition list entries
router.get('/', nutritionListController.getNutritions);

// Get a single nutrition list entry by ID
router.get('/:id', nutritionListController.getNutrition);

// Update a nutrition list entry by ID
router.put('/:id', nutritionListController.updateNutrition);

// Delete a nutrition list entry by ID
router.delete('/:id', nutritionListController.deleteNutrition);

module.exports = router;
