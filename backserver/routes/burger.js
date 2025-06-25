const express = require('express');
const router = express.Router();
const burgerController = require('../controllers/burgerController');

// Create a new burger
router.post('/', burgerController.createBurger);

// Create a new burger with ingredients and instructions
router.post('/full', burgerController.createBurgerWithDetails);

// Get all burgers
router.get('/', burgerController.getBurgers);

// Get a single burger by ID
router.get('/:id', burgerController.getBurger);

// Update a burger by ID
router.put('/:id', burgerController.updateBurger);

// Delete a burger by ID
router.delete('/:id', burgerController.deleteBurger);

module.exports = router;
