import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { getRecipes } from './features/recipes/recipesSlice';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';

function App() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.recipes.status);

  useEffect(() => {
    if (status === 'idle') dispatch(getRecipes());
  }, [status, dispatch]);

  return (
    <>
    
      <Navbar />
  <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/recipes/:id" element={<RecipeDetailPage />} />
  <Route path="/favorites" element={<FavoritesPage />} />
  <Route path="*" element={<NotFoundPage />} />
  <Route path="/add-recipe" element={<AddRecipePage />} />
</Routes>
    </>
    
  );
}

export default App;