import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteRecipe, removeFavoriteRecipe } from '../features/userProfile/userProfileSlice';

function RecipeDetailPage() {
  const { id } = useParams(); // lets us get values from the url, in this case the recipe id
  const dispatch = useDispatch();
  const { items: recipes, status } = useSelector((state) => state.recipes);
  const favoriteIds = useSelector((state) => state.userProfile.favoriteIds);

  if (status === 'loading' || status === 'idle') return <p>Loading...</p>;

  

  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return (
      <div>
        <p>Recipe not found.</p>
        <Link to="/">Back home</Link>
      </div>
    );
  }

  const isFavorite = favoriteIds.includes(recipe.id);

  return (
    <div>
      <Link to="/">← Back</Link>
      <h1>{recipe.name}</h1>
      {recipe.image && <img src={recipe.image} alt={recipe.name} width="300" />}
      <p>Difficulty: {recipe.difficulty}</p>
      <p>Rating: {recipe.rating || 'Not rated'}</p>

      {isFavorite ? (
        <button onClick={() => dispatch(removeFavoriteRecipe(recipe.id))}>
          Remove from Favorites
        </button>
      ) : (
        <button onClick={() => dispatch(addFavoriteRecipe(recipe.id))}>
          Add to Favorites
        </button>
      )}

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeDetailPage;