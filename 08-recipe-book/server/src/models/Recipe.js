// server/src/models/Recipe.js
// Defines the Recipe schema and model, associating each recipe with an author and tracked favorites

import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a recipe title'],
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, 'Please provide recipe ingredients'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A recipe must contain at least one ingredient',
      },
    },
    steps: {
      type: String,
      required: [true, 'Please provide preparation steps'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
      default: 'General',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipe must belong to a user'],
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Index title for efficient case-insensitive search
recipeSchema.index({ title: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;

