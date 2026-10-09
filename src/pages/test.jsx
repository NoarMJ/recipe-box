import { createSlice, createAsyncThunk, createSelector, nanoid } from '@reduxjs/toolkit';

export const getRecipes = createAsyncThunk('recipes/getRecipes', async () => {
  const response = await fetch('https://dummyjson.com/recipes');
  if (!response.ok) throw new Error('Failed to fetch recipes');
  const data = await response.json();
  return data.recipes;
});

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],       // from the API, safe to overwrite on refetch
    userItems: [],   // recipes the user added
    ratings: {},     // { [recipeId]: rating }, works for both kinds
    status: 'idle',
    error: null,
  },

  reducers: {
    addRecipe: {
      reducer(state, action) {
        state.userItems.unshift(action.payload);
      },
      prepare(recipe) {
        return { payload: { ...recipe, id: nanoid(), source: 'user' } };
      },
    },
    deleteRecipe(state, action) {
      state.userItems = state.userItems.filter((r) => r.id !== action.payload);
    },
    setRating(state, action) {
      const { id, rating } = action.payload;
      state.ratings[id] = rating;
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

export const { addRecipe, deleteRecipe, setRating } = recipesSlice.actions;
export default recipesSlice.reducer;

// Combined list for your UI
export const selectAllRecipes = createSelector(
  [(s) => s.recipes.userItems, (s) => s.recipes.items, (s) => s.recipes.ratings],
  (userItems, items, ratings) =>
    [...userItems, ...items].map((r) => ({
      ...r,
      rating: ratings[r.id] ?? r.rating,
    }))
);