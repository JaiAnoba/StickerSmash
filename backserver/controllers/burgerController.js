const Burger = require('../models/Burger');
const Ingredient = require('../models/Ingredient');
const CookingInstruction = require('../models/CookingInstruction');

// Create a new burger
exports.createBurger = async (req, res) => {
  try {
    const burger = new Burger({
      user_id: req.body.user_id,
      name: req.body.name,
      description: req.body.description,
      difficulty: req.body.difficulty,
      totaltime: req.body.totaltime,
      calorie: req.body.calorie,
      status: req.body.status,
      image: req.body.image,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await burger.save();
    res.status(201).json(burger);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create a new burger with ingredients and instructions
exports.createBurgerWithDetails = async (req, res) => {
  try {
    // 1. Create the burger
    const burger = new Burger({
      user_id: req.body.user_id,
      name: req.body.name,
      description: req.body.description,
      difficulty: req.body.difficulty,
      totaltime: req.body.totaltime,
      calorie: req.body.calorie,
      status: req.body.status,
      image: req.body.image,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await burger.save();

    // 2. Create ingredients
    let ingredients = [];
    if (Array.isArray(req.body.ingredients)) {
      ingredients = await Ingredient.insertMany(
        req.body.ingredients.map((ing) => ({
          ...ing,
          burger_id: burger._id,
        }))
      );
    }

    // 3. Create cooking instructions
    let instructions = [];
    if (Array.isArray(req.body.instructions)) {
      instructions = await CookingInstruction.insertMany(
        req.body.instructions.map((inst, idx) => ({
          ...inst,
          burgerId: burger._id,
          stepNumber: inst.stepNumber || idx + 1,
        }))
      );
    }

    res.status(201).json({
      burger,
      ingredients,
      instructions,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all burgers
exports.getBurgers = async (req, res) => {
  try {
    const burgers = await Burger.find();
    res.json(burgers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single burger by ID
exports.getBurger = async (req, res) => {
  try {
    const burger = await Burger.findById(req.params.id);
    if (!burger) return res.status(404).json({ error: 'Not found' });
    res.json(burger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a burger by ID
exports.updateBurger = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };
    const burger = await Burger.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!burger) return res.status(404).json({ error: 'Not found' });
    res.json(burger);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a burger by ID
exports.deleteBurger = async (req, res) => {
  try {
    const burger = await Burger.findByIdAndDelete(req.params.id);
    if (!burger) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
