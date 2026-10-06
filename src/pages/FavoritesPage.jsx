import { useDispatch, useSelector } from 'react-redux';
import { setRating } from '../features/recipes/recipesSlice';
import { removeFavoriteRecipe } from '../features/userProfile/userProfileSlice';

function FavoritesPage() {
  const dispatch = useDispatch();
  const { items: recipes, status } = useSelector((state) => state.recipes);
  const favoriteIds = useSelector((state) => state.userProfile.favoriteIds);
  const favoriteRecipes = recipes.filter((r) => favoriteIds.includes(r.id));

  const handleSetRating = async (recipe, rating) => {
    try {
      const response = await fetch(`https://dummyjson.com/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) throw new Error('Rating failed');
      dispatch(setRating({ id: recipe.id, rating }));
    } catch (err) {
      console.error(err);
    }
  };

  if (status === 'loading' || status === 'idle') return <p>Loading...</p>;

  return (
    <div>
      <h1>Favorite Recipes</h1>
      {favoriteRecipes.length === 0 && <p>No favorites yet.</p>}
      <ul>
        {favoriteRecipes.map((recipe) => (
          <li key={recipe.id}>
            {recipe.name}
            <img src={recipe.image} alt={recipe.name} width="100" />
            {[5, 4, 3, 2, 1].map((n) => (
              <button key={n} onClick={() => handleSetRating(recipe, n)}>
                Rate {n}
              </button>
            ))}
            <span>Rating: {recipe.rating || 'Not rated'}</span>
            <button onClick={() => dispatch(removeFavoriteRecipe(recipe.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritesPage;