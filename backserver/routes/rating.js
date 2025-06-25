const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// Create a new rating
router.post('/', ratingController.createRating);

// Get all ratings
router.get('/', ratingController.getRatings);

// Get a single rating by ID
router.get('/:id', ratingController.getRating);

// Update a rating by ID
router.put('/:id', ratingController.updateRating);

// Delete a rating by ID
router.delete('/:id', ratingController.deleteRating);

module.exports = router;
