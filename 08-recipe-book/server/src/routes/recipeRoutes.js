// server/src/routes/recipeRoutes.js
// Routes for Recipe operations including public search, CRUD, and user favorites

import express from 'express';
import {
  getRecipes,
  getSavedRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavoriteRecipe,
} from '../controllers/recipeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route to search & browse recipes
router.get('/', getRecipes);

// Saved recipes for logged-in user (MUST precede /:id)
router.get('/saved', protect, getSavedRecipes);

// Create a new recipe (logged-in user)
router.post('/', protect, createRecipe);

// Get single recipe details
router.get('/:id', getRecipeById);

// Update recipe (creator only)
router.put('/:id', protect, updateRecipe);

// Delete recipe (creator only)
router.delete('/:id', protect, deleteRecipe);

// Toggle favorite / save recipe (logged-in user)
router.post('/:id/favorite', protect, toggleFavoriteRecipe);
router.post('/:id/save', protect, toggleFavoriteRecipe);

export default router;

