const Ingredient = require('../models/Ingredient');

// Create a new ingredient
exports.createIngredient = async (req, res) => {
  try {
    const ingredient = new Ingredient({
      burger_id: req.body.burger_id,
      name: req.body.name,
      quantity: req.body.quantity,
      unit: req.body.unit,
      optional: req.body.optional || false,
      category_id: req.body.category_id,
      createdAt: new Date(),
    });
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all ingredients
exports.getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single ingredient by ID
exports.getIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ error: 'Not found' });
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an ingredient by ID
exports.updateIngredient = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!ingredient) return res.status(404).json({ error: 'Not found' });
    res.json(ingredient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an ingredient by ID
exports.deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
