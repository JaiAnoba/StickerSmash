const NutritionInfo = require('../models/NutritionInfo');

exports.createNutrition = async (req, res) => {
  try {
    const nutrition = new NutritionInfo(req.body);
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNutritions = async (req, res) => {
  try {
    const nutritions = await NutritionInfo.find();
    res.json(nutritions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNutrition = async (req, res) => {
  try {
    const nutrition = await NutritionInfo.findById(req.params.id);
    if (!nutrition) return res.status(404).json({ error: 'Not found' });
    res.json(nutrition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNutrition = async (req, res) => {
  try {
    const nutrition = await NutritionInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!nutrition) return res.status(404).json({ error: 'Not found' });
    res.json(nutrition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNutrition = async (req, res) => {
  try {
    const nutrition = await NutritionInfo.findByIdAndDelete(req.params.id);
    if (!nutrition) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
