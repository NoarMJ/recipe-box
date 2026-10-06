import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getRecipes = createAsyncThunk('recipes/getRecipes', async () => {
  const response = await fetch('https://dummyjson.com/recipes');
  if (!response.ok) throw new Error('Failed to fetch recipes');
  const data = await response.json();
  return data.recipes;
});

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: { items:  [], status: 'idle', error: null },

  reducers: {
    addRecipe: (state, action) => {
      state.items.unshift(action.payload);
    },
    setRating: (state, action) => {
      const recipe = state.items.find((r) => r.id === action.payload.id);
      if (recipe) recipe.rating = action.payload.rating;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getRecipes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items =action.payload;

      })
      .addCase(getRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addRecipe, setRating } = recipesSlice.actions;
export default recipesSlice.reducer;