import { createSlice } from "@reduxjs/toolkit";

const userProfileSlice = createSlice({
  name: "userProfile",


  initialState: {
    favoriteIds: [],
  },



  reducers: { 
    addFavoriteRecipe: (state, action) => {


        if(!state.favoriteIds.includes(action.payload)) {
          state.favoriteIds.push(action.payload);
        }
      
    },
    removeFavoriteRecipe: (state, action) => {
      state.favoriteIds = state.favoriteIds.filter(
        (id) => id !== action.payload
      );

      

   },


}
});

export const { addFavoriteRecipe, removeFavoriteRecipe } = userProfileSlice.actions;

export default userProfileSlice.reducer;