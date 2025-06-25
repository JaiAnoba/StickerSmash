const ShoppingList = require('../models/ShoppingList');

// Create a new shopping list entry
exports.createList = async (req, res) => {
  try {
    const list = new ShoppingList({
      user_id: req.body.user_id,
      ingredient_id: req.body.ingredient_id,
      amount: req.body.amount,
      check: req.body.check || false,
    });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all shopping list entries
exports.getLists = async (req, res) => {
  try {
    const lists = await ShoppingList.find();
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single shopping list entry by ID
exports.getList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'Not found' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a shopping list entry by ID
exports.updateList = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };
    const list = await ShoppingList.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!list) return res.status(404).json({ error: 'Not found' });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a shopping list entry by ID
exports.deleteList = async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndDelete(req.params.id);
    if (!list) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
