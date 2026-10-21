
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    cuisine: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },

    prepTimeMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },

    cookTimeMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },

    servings: {
      type: Number,
      min: 1,
      default: 2,
    },

    caloriesPerServing: {
      type: Number,
      min: 0,
      default: 0,
    },

    image: {
      type: String,
      default: '',
      trim: true,
    },

    ingredients: {
      type: [{
        type: String,
        trim: true,
      }],
      required: true,
      validate: {
        validator: (items) =>
          items.length > 0 && items.every((item) => item.length > 0),
        message: 'At least one non-empty ingredient is required',
      },
    },

    instructions: {
      type: [{
        type: String,
        trim: true,
      }],
      required: true,
      validate: {
        validator: (items) =>
          items.length > 0 && items.every((item) => item.length > 0),
        message: 'At least one non-empty instruction is required',
      },
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,// id of the user who owns the recipe is stored 
        ref: 'User',//checks the user model
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
