import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from '../features/recipes/recipesSlice';
import userProfileReducer from '../features/userProfile/userProfileSlice';


const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    userProfile: userProfileReducer,
  },
});




export default store;