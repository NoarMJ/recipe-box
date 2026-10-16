
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteIds: [],
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,

  reducers: {
    addFavoriteRecipe(state, action) {
      const id = action.payload;

      if (id == null) return;

      if (!state.favoriteIds.includes(id)) {
        state.favoriteIds.push(id);
      }
    },

    removeFavoriteRecipe(state, action) {
      const id = action.payload;

      state.favoriteIds = state.favoriteIds.filter(
        (favoriteId) => favoriteId !== id
      );
    },

    toggleFavoriteRecipe(state, action) {
      const id = action.payload;

      if (id == null) return;

      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter(
          (favoriteId) => favoriteId !== id
        );
      } else {
        state.favoriteIds.push(id);
      }
    },

    clearFavorites(state) {
      state.favoriteIds = [];
    },
  },

  extraReducers: (builder) => {
    // When a user-created recipe is deleted, remove its favorite ID too.
    builder.addCase('recipes/removeRecipe', (state, action) => {
      const deletedId = action.payload;

      state.favoriteIds = state.favoriteIds.filter(
        (favoriteId) => favoriteId !== deletedId
      );
    })
  }
});

export const {
  addFavoriteRecipe,
  removeFavoriteRecipe,
  toggleFavoriteRecipe,
  clearFavorites,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
