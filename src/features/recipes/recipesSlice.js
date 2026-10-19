
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  nanoid,
} from '@reduxjs/toolkit';

// Fetch recipes owned by the external API.
export const getRecipes = createAsyncThunk(
  'recipes/getRecipes',
  async () => {
    const response = await fetch('/api/recipes');

    if (!response.ok) {
      throw new Error('Failed to fetch recipes.');
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('The API returned an invalid recipes list.');
    }

    return data.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      prepTimeMinutes: recipe.prepTimeMinutes ?? 0,
      cookTimeMinutes: recipe.cookTimeMinutes ?? 0,
      servings: recipe.servings ?? 1,
      difficulty: recipe.difficulty ?? 'Easy',
      cuisine: recipe.cuisine ?? 'Not specified',
      caloriesPerServing: recipe.caloriesPerServing ?? 0,
      tags: recipe.tags ?? [],
      userId: recipe.userId ?? null,
      image: recipe.image ?? '',
      rating: recipe.rating ?? 0,
      reviewCount: recipe.reviewCount ?? 0,
      mealType: recipe.mealType ?? [],
      ingredients: recipe.ingredients ?? [],
      instructions: recipe.instructions ?? [],
    }));
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/createRecipe',
  async  (recipe , {rejectWithValue} )=> {
    try{
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json',

        },
        body:JSON.stringify(recipe),
      });

      const data=await response.json();

      if(!response.ok) {
        return rejectWithValue(
          data.message || 'Failed to create recipe.'
        );
      }

      return data;



    } catch (error) {
      return rejectWithValue(
        'could not connect to the recipe server'
      );

    }
  }
)

const initialState = {
  items: [],      // Recipes fetched from DummyJSON.
  userItems: [],  // Recipes created by the user.
  ratings: {},    // Local rating overrides, indexed by recipe ID.
  status: 'idle',
  error: null,


  createStatus: 'idle',
  createError: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,

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
            prepTimeMinutes: recipe.prepTimeMinutes ?? 0,
            cookTimeMinutes: recipe.cookTimeMinutes ?? 0,
            servings: recipe.servings ?? 1,
            difficulty: recipe.difficulty ?? 'Easy',
            cuisine: recipe.cuisine ?? 'Not specified',
            caloriesPerServing: recipe.caloriesPerServing ?? 0,
            tags: recipe.tags ?? [],
            userId: null,
            image: recipe.image ?? '',
            rating: recipe.rating ?? 0,
            reviewCount: recipe.reviewCount ?? 0,
            mealType: recipe.mealType ?? [],
            ingredients: recipe.ingredients ?? [],
            instructions: recipe.instructions ?? [],
          },
        };
      },
    },

    setRating(state, action) {
      const { id, rating } = action.payload;

      if (id == null || typeof rating !== 'number') {
        return;
      }

      state.ratings[id] = rating;
    },

    removeRecipe(state, action) {
      const id = action.payload;

      state.userItems = state.userItems.filter(
        (recipe) => recipe.id !== id
      );

      delete state.ratings[id];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getRecipes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(getRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message ?? 'Unable to load recipes.';
      })


      .addCase(createRecipe.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })

      .addCase(createRecipe.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.userItems.unshift(action.payload);
        state.createError =null;
      })


      .addCase(createRecipe.rejected ,(state,action) => {

        state.createStatus =  'failed';
        state.createError = action.payload ?? action.error.message ?? 'unable to create recipe';
      });
  },
});

export const {
  addRecipe,
  setRating,
  removeRecipe,
} = recipesSlice.actions;

export default recipesSlice.reducer;

// Combine both collections without changing the original state.
export const selectAllRecipes = createSelector(
  [
    (state) => state.recipes.userItems,
    (state) => state.recipes.items,
    (state) => state.recipes.ratings,
  ],
  (userItems, items, ratings) =>
    [...userItems, ...items].map((recipe) => ({
      ...recipe,
      rating: ratings[recipe.id] ?? recipe.rating ?? 0,
    }))
);
