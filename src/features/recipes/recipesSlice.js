import { createSlice, createAsyncThunk, createSelector, nanoid } from '@reduxjs/toolkit';



export const getRecipes = createAsyncThunk('recipes/getRecipes', async () => {
  const response = await fetch('https://dummyjson.com/recipes');
  if (!response.ok) throw new Error('Failed to fetch recipes');
  const data = await response.json();
  return data.recipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    cuisine: recipe.cuisine,
    caloriesPerServing: recipe.caloriesPerServing,
    tags: recipe.tags || [],
    userId: recipe.userId,
    image: recipe.image,
    rating: recipe.rating,
    reviewCount: recipe.reviewCount,
    mealType: recipe.mealType || [],
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
  }));
});


const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],                    // API data, overwritten on every fetch
    userItems: [],   // yours, never touched by the fetch
    ratings: {},       // { [id]: rating }, for both kinds
    status: 'idle',
    error: null,
  },

  reducers: {
    addRecipe: {
      reducer(state, action) {
        state.userItems.unshift(action.payload);
      },
      prepare(recipe) {
        return {
          payload: {
            id: recipe.id ?? nanoid(),
            name: recipe.name,
            prepTimeMinutes: recipe.prepTimeMinutes || 0,
            cookTimeMinutes: recipe.cookTimeMinutes || 0,
            servings: recipe.servings || 1,
            difficulty: recipe.difficulty || 'Easy',
            cuisine: recipe.cuisine || 'Not specified',
            caloriesPerServing: recipe.caloriesPerServing || 0,
            tags: recipe.tags || [],
            userId: null,
            image: recipe.image || '',
            rating: recipe.rating || 0,
            reviewCount: 0,
            mealType: recipe.mealType || [],
            ingredients: recipe.ingredients || [],
            instructions: recipe.instructions || [],
          },
        };
      },
    },
    setRating(state, action) {
      const { id, rating } = action.payload;
      state.ratings[id] = rating;
    },
    removeRecipe(state, action) {
      state.userItems = state.userItems.filter((r) => r.id !== action.payload);
      delete state.ratings[action.payload];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getRecipes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // only touches API data now
      })
      .addCase(getRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addRecipe, setRating, removeRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;

export const selectAllRecipes = createSelector(
  [(s) => s.recipes.userItems, (s) => s.recipes.items, (s) => s.recipes.ratings],
  (userItems, items, ratings) =>
    [...userItems, ...items].map((r) => ({
      ...r,
      rating: ratings[r.id] ?? r.rating,
    }))
);