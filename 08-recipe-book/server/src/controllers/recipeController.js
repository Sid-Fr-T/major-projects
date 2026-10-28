// server/src/controllers/recipeController.js
// Handles full CRUD operations and favorites management for recipes

import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';

/**
 * Helper to normalize ingredients input (accepts array of strings, or newline/comma separated string)
 */
const parseIngredients = (input) => {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * @desc    Get all recipes (public, supports title search & category filter)
 * @route   GET /api/recipes
 * @access  Public
 */
export const getRecipes = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    // Search by title (case-insensitive substring match)
    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    // Optional category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    const recipes = await Recipe.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(recipes);
  } catch (error) {
    console.error(`Get Recipes Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving recipes', error: error.message });
  }
};

/**
 * @desc    Get recipes saved/favorited by the logged-in user
 * @route   GET /api/recipes/saved
 * @access  Private
 */
export const getSavedRecipes = async (req, res) => {
  try {
    const savedRecipes = await Recipe.find({ savedBy: req.user._id })
      .populate('user', 'name email')
      .sort({ updatedAt: -1 });

    return res.status(200).json(savedRecipes);
  } catch (error) {
    console.error(`Get Saved Recipes Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving saved recipes', error: error.message });
  }
};

/**
 * @desc    Get a single recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Recipe not found (invalid ID format)' });
    }

    const recipe = await Recipe.findById(id).populate('user', 'name email');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error(`Get Recipe Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving recipe', error: error.message });
  }
};

/**
 * @desc    Create a new recipe
 * @route   POST /api/recipes
 * @access  Private
 */
export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, category, imageUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a recipe title' });
    }

    const parsedIngredients = parseIngredients(ingredients);
    if (parsedIngredients.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one ingredient' });
    }

    if (!steps || !steps.trim()) {
      return res.status(400).json({ message: 'Please provide preparation steps' });
    }

    const recipe = await Recipe.create({
      title: title.trim(),
      ingredients: parsedIngredients,
      steps: steps.trim(),
      category: category && category.trim() ? category.trim() : 'General',
      imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : '',
      user: req.user._id,
      savedBy: [],
    });

    await recipe.populate('user', 'name email');

    return res.status(201).json(recipe);
  } catch (error) {
    console.error(`Create Recipe Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating recipe', error: error.message });
  }
};

/**
 * @desc    Update an existing recipe (creator only)
 * @route   PUT /api/recipes/:id
 * @access  Private
 */
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, steps, category, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Recipe not found (invalid ID format)' });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Verify creator ownership
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }

    if (title !== undefined) recipe.title = title.trim();
    if (ingredients !== undefined) {
      const parsed = parseIngredients(ingredients);
      if (parsed.length === 0) {
        return res.status(400).json({ message: 'Please provide at least one ingredient' });
      }
      recipe.ingredients = parsed;
    }
    if (steps !== undefined) recipe.steps = steps.trim();
    if (category !== undefined) recipe.category = category.trim();
    if (imageUrl !== undefined) recipe.imageUrl = imageUrl.trim();

    const updatedRecipe = await recipe.save();
    await updatedRecipe.populate('user', 'name email');

    return res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error(`Update Recipe Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating recipe', error: error.message });
  }
};

/**
 * @desc    Delete a recipe (creator only)
 * @route   DELETE /api/recipes/:id
 * @access  Private
 */
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Recipe not found (invalid ID format)' });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Verify creator ownership
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();

    return res.status(200).json({ message: 'Recipe deleted successfully', id });
  } catch (error) {
    console.error(`Delete Recipe Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting recipe', error: error.message });
  }
};

/**
 * @desc    Toggle favorite/saved state for a recipe
 * @route   POST /api/recipes/:id/favorite
 * @access  Private
 */
export const toggleFavoriteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Recipe not found (invalid ID format)' });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const userIdStr = req.user._id.toString();
    const alreadySaved = recipe.savedBy.some((uid) => uid.toString() === userIdStr);

    if (alreadySaved) {
      // Unsave
      recipe.savedBy = recipe.savedBy.filter((uid) => uid.toString() !== userIdStr);
    } else {
      // Save
      recipe.savedBy.push(req.user._id);
    }

    await recipe.save();
    await recipe.populate('user', 'name email');

    return res.status(200).json({
      message: alreadySaved ? 'Recipe removed from favorites' : 'Recipe added to favorites',
      isSaved: !alreadySaved,
      recipe,
    });
  } catch (error) {
    console.error(`Toggle Favorite Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating favorite status', error: error.message });
  }
};

