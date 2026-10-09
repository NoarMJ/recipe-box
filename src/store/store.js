import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from '../features/recipes/recipesSlice';
import userProfileReducer from '../features/userProfile/userProfileSlice';

import themeReducer from '../features/theme/themeSlice';
import authReducer from '../features/auth/authSlice';

import { persistStore , persistReducer , FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/es/storage';


const recipesPersistConfig = {
  key: 'recipes',
  storage,
  whitelist: ['userItems', 'ratings'],
};

const userProfilePersistConfig = {
  key: 'userProfile',
  storage,
  whitelist: ['favoriteIds'],
};

const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['mode'],
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
};


const store = configureStore({
  reducer: {
    recipes: persistReducer(recipesPersistConfig, recipesReducer),
    userProfile: persistReducer(userProfilePersistConfig, userProfileReducer),
    theme: persistReducer(themePersistConfig, themeReducer),
    auth: persistReducer(authPersistConfig, authReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});




export const persistor = persistStore(store);

export default store;