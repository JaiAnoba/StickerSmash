const Rating = require('../models/Rating');

// Create a new rating
exports.createRating = async (req, res) => {
  try {
    const rating = new Rating({
      user_id: req.body.user_id,
      burger_id: req.body.burger_id,
      rating: req.body.rating,
      review: req.body.review,
      status: req.body.status,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await rating.save();
    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all ratings
exports.getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single rating by ID
exports.getRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ error: 'Not found' });
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a rating by ID
exports.updateRating = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };
    const rating = await Rating.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!rating) return res.status(404).json({ error: 'Not found' });
    res.json(rating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a rating by ID
exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findByIdAndDelete(req.params.id);
    if (!rating) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
