import { useState , useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe } from '../features/recipes/recipesSlice';
import { addFavoriteRecipe } from '../features/userProfile/userProfileSlice';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [recipeName, setRecipeName] = useState('');
  const { items: recipes, status, error } = useSelector((state) => state.recipes);



  const[notification, setNotification] = useState('');

  const handleAddFavorite = (recipeId) => {
    dispatch(addFavoriteRecipe(recipeId));

    setNotification('Recipe added to favorites!');
  };

    useEffect(() => {
        if(!notification) {
            return;
        }

        const timer=setTimeout(() => {
            setNotification ('')
        } , 2000);

        return() => {
            clearTimeout(timer);
        };
        },[notification]);

  const handleAddRecipe = () => {
    if (!recipeName.trim()) return;
    dispatch(
      addRecipe({
        id: Date.now(),
        name: recipeName,
        image: '',
        rating: 0,
        difficulty: 'Not specified',
        ingredients: [],
      })
    );
    setRecipeName('');
  };

  if (status === 'loading' || status === 'idle') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Recipe Box</h1>

      <input
        type="text"
        placeholder="Enter recipe name"
        value={recipeName}
        onClick={() => navigate('/add-recipe')}
        style={{ marginRight: '10px',
            cursor: 'pointer'

         }}  
      />
      <button onClick={handleAddRecipe}>Add Recipe</button>

      <h2>Recipes:</h2>
        {notification && (
  <div>
    ✓ {notification}
  </div>
)}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <img src={recipe.image} alt={recipe.name} width="100" />
            <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
            <p>Difficulty: {recipe.difficulty}</p>
            <button onClick={() => handleAddFavorite(recipe.id)}>
              Add to Favorites
            </button>
          </li>
        ))}
      
      </ul>
    </div>
    
  );
}

export default HomePage;