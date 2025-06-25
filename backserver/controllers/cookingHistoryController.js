const CookingHistory = require('../models/CookingHistory');

// Create a new cooking history entry
exports.createHistory = async (req, res) => {
  try {
    const history = new CookingHistory({
      user_id: req.body.user_id,
      burger_id: req.body.burger_id,
      cookdate: req.body.cookdate || new Date(),
      rating: req.body.rating,
    });
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all cooking history entries
exports.getHistories = async (req, res) => {
  try {
    const histories = await CookingHistory.find();
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single cooking history entry by ID
exports.getHistory = async (req, res) => {
  try {
    const history = await CookingHistory.findById(req.params.id);
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a cooking history entry by ID
exports.updateHistory = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };
    const history = await CookingHistory.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a cooking history entry by ID
exports.deleteHistory = async (req, res) => {
  try {
    const history = await CookingHistory.findByIdAndDelete(req.params.id);
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
