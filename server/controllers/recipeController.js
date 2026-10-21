
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid recipe ID',
      });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found',
      });
    }

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

exports.createRecipe = async (req, res, next) => {
  try {
    const {
      name,
      cuisine,
      difficulty,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      caloriesPerServing,
      image,
      ingredients,
      instructions,
    } = req.body;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof cuisine !== 'string' ||
      !cuisine.trim()
    ) {
      return res.status(400).json({
        message: 'Recipe name and cuisine are required',
      });
    }

    if (
      !Array.isArray(ingredients) ||
      !Array.isArray(instructions)
    ) {
      return res.status(400).json({
        message: 'Ingredients and instructions must be arrays',
      });
    }

    const recipe = await Recipe.create({
      name: name.trim(),
      cuisine: cuisine.trim(),
      difficulty,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      caloriesPerServing,
      image,
      ingredients,
      instructions,
      owner: req.session.userId,
    });

    res.status(201).json(recipe);
  } catch (error) {
    if (error.name === 'ValidationError' ||
        error.name === 'CastError') {
      return res.status(400).json({
        message: error.message,
      });
    }

    next(error);
  }
};
