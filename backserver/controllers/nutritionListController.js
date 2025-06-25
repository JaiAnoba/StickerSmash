const NutritionList = require('../models/NutritionList');

// Create a new nutrition list entry
exports.createNutrition = async (req, res) => {
  try {
    const nutrition = new NutritionList({
      burger_id: req.body.burger_id,
      calorie: req.body.calorie,
      fat: req.body.fat,
      protein: req.body.protein,
      carbohydrate: req.body.carbohydrate,
    });
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all nutrition list entries
exports.getNutritions = async (req, res) => {
  try {
    const nutritions = await NutritionList.find();
    res.json(nutritions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single nutrition list entry by ID
exports.getNutrition = async (req, res) => {
  try {
    const nutrition = await NutritionList.findById(req.params.id);
    if (!nutrition) return res.status(404).json({ error: 'Not found' });
    res.json(nutrition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a nutrition list entry by ID
exports.updateNutrition = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };
    const nutrition = await NutritionList.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!nutrition) return res.status(404).json({ error: 'Not found' });
    res.json(nutrition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a nutrition list entry by ID
exports.deleteNutrition = async (req, res) => {
  try {
    const nutrition = await NutritionList.findByIdAndDelete(req.params.id);
    if (!nutrition) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
