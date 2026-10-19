import { combineReducers, configureStore } from '@reduxjs/toolkit';
import recipesReducer from '../features/recipes/recipesSlice';
import userProfileReducer from '../features/userProfile/userProfileSlice';

import themeReducer from '../features/theme/themeSlice';
import authReducer from '../features/auth/authSlice';

import { createTransform, persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/es/storage';

const recipesTransform = createTransform(
  (state) => ({//outbound transform: state to be persisted
    userItems: state.userItems,
    ratings: state.ratings,
  }),
  (state) => ({//inbound transform: state to be rehydrated
    items: [],
    userItems: state.userItems ?? [],
    ratings: state.ratings ?? {},
    status: 'idle',
    error: null,

    createStatus: 'idle',
    createError: null,
  }),
  { whitelist: ['recipes'] },//only apply this transform to the recipes slice
);

const parseStoredValue = (value) => {//this function is used to parse the stored value
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const readLegacyPersistedState = async (key) => {//this function is used to read the legacy persisted state
  const storedState = await storage.getItem(key);
  if (!storedState) return null;

  const parsedState = parseStoredValue(storedState);//parse the stored value
  if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
    return parsedState;
  }

  return Object.fromEntries(//
    Object.entries(parsedState)
      .filter(([field]) => field !== '_persist')
      .map(([field, value]) => [field, typeof value === 'string' ? parseStoredValue(value) : value]),
  );
};

const migrateLegacyState = async (state) => {//this function is used to migrate the legacy persisted state to the new format
  const [persistedRecipes, legacyRecipes, persistedUserProfile, legacyFavoriteIds, persistedTheme, legacyThemeMode] = await Promise.all([
    readLegacyPersistedState('persist:recipes'),
    readLegacyPersistedState('recipes:user'),
    readLegacyPersistedState('persist:userProfile'),
    readLegacyPersistedState('favoriteIds'),
    readLegacyPersistedState('persist:theme'),
    readLegacyPersistedState('themeMode'),
  ]);

  if (!state && !persistedRecipes && !legacyRecipes && !persistedUserProfile && !legacyFavoriteIds && !persistedTheme && !legacyThemeMode) {
    return state;
  }

  const currentRecipes = state?.recipes ?? {};
  const oldRecipes = persistedRecipes ?? legacyRecipes ?? {}; // fallback to legacy recipes if persisted recipes are not available
  const currentFavorites = state?.userProfile?.favoriteIds;
  const oldFavorites = Array.isArray(legacyFavoriteIds)
    ? legacyFavoriteIds
    : persistedUserProfile?.favoriteIds ?? [];
  const theme = state?.theme ?? persistedTheme ?? {};

  return {
    ...state,
    recipes: {//merge the current recipes with the old recipes, giving priority to the current recipes
      ...currentRecipes,
      items: [],
      userItems: currentRecipes.userItems?.length ? 
        currentRecipes.userItems : oldRecipes.userItems ?? [],//if the current userItems are not available, fallback to the old userItems
      ratings: Object.keys(currentRecipes.ratings ?? {}).length
        ? currentRecipes.ratings
        : oldRecipes.ratings ?? {},
      status: 'idle',
      error: null,
    },
    userProfile: {
      ...persistedUserProfile,
      ...state?.userProfile,
      favoriteIds: currentFavorites?.length ? currentFavorites : oldFavorites,
    },
    theme: {
      mode: theme.mode ?? (typeof legacyThemeMode === 'string' ? legacyThemeMode : 'light'),
    },
  };
};

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['recipes', 'userProfile', 'theme'],
  transforms: [recipesTransform],
  migrate: migrateLegacyState,
};

const rootReducer = combineReducers({
  recipes: recipesReducer,
  userProfile: userProfileReducer,
  theme: themeReducer,
  auth: authReducer,
});

const store = configureStore({ // create the store with redux-persist
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});




export const persistor = persistStore(store); //starts redux-persist

const legacyStorageKeys = [ // array of the old key names 
  'persist:recipes',
  'persist:userProfile',
  'persist:theme',
  'persist:auth',
  'recipes',
  'recipes:user',
  'favoriteIds',
  'themeMode',
  'user',
];

let legacyStorageCleaned = false; // prevents from happening again if the user refreshes the page before the cleanup is complete
persistor.subscribe(() => {
  if (!persistor.getState().bootstrapped || legacyStorageCleaned) return;

  legacyStorageCleaned = true;
  void persistor
    .flush() // finish persisting the current state before removing the legacy keys
    .then(() => Promise.all(legacyStorageKeys.map((key) => storage.removeItem(key)))) // remove the legacy keys
    .catch((error) => {//any procedure fails then log an error
      console.error('Failed to clean up legacy persisted state:', error);
    });
});

export default store;