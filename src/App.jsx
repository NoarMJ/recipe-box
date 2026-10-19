import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { getRecipes } from './features/recipes/recipesSlice';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';


const collapsedWidth = 50;

function App() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.recipes.status);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  // Pages that don't need navbar
  const noNavbarRoutes = ['/landing', '/login', '/signup'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    if (status === 'idle') dispatch(getRecipes());
  }, [status, dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      {showNavbar && <Navbar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: showNavbar ? 3 : 0,
          width: isMobile ? '100%' : showNavbar ? { sm: `calc(100% - ${collapsedWidth}px)` } : '100%',
          ml: isMobile ? 0 : showNavbar ? { sm: `${collapsedWidth}px` } : 0,
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute>
                <RecipeDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-recipe"
            element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;