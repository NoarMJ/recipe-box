import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteRecipe } from '../features/userProfile/userProfileSlice';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  Chip,
  Skeleton,
  Pagination,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import { selectAllRecipes } from '../features/recipes/recipesSlice';

function RecipeCardSkeleton() {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Skeleton variant="rectangular" height={200} animation="wave" />
        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" height={32} width="80%" animation="wave" />
          <Skeleton variant="text" height={24} width="40%" animation="wave" sx={{ mt: 1 }} />
          <Skeleton variant="text" height={20} width="60%" animation="wave" sx={{ mt: 1 }} />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" height={36} width={140} animation="wave" />
        </CardActions>
      </Card>
    </Grid>
  );
}

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recipes= useSelector(selectAllRecipes);
  const{ status, error} = useSelector((state) => state.recipes);


  const [notification, setNotification] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  const handleAddFavorite = (recipeId) => {
    dispatch(addFavoriteRecipe(recipeId));
    setNotification('Recipe added to favorites!');
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = setTimeout(() => {
      setNotification('');
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [notification]);

  const handleAddRecipe = () => {
    navigate('/add-recipe');
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Recipe Box
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
          <Skeleton variant="rectangular" height={56} width={500} animation="wave" />
          <Skeleton variant="rectangular" height={36} width={120} animation="wave" />
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Recipes
        </Typography>

        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <RecipeCardSkeleton key={item} />
          ))}
        </Grid>
      </Container>
    );
  }
  if (status === 'failed') {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Recipe Box
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Enter recipe name"
          onClick={() => navigate('/add-recipe')}
          sx={{ maxWidth: 500 }}
        />
        <Button
          variant="contained"
          onClick={handleAddRecipe}
          startIcon={<AddIcon />}
        >
          Add Recipe
        </Button>
      </Box>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Recipes
      </Typography>

      <Grid container spacing={3}>
        {currentRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={recipe.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  <Link
                    to={`/recipes/${recipe.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {recipe.name}
                  </Link>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip
                    label={recipe.difficulty || 'Easy'}
                    size="small"
                    color={recipe.difficulty === 'Hard' ? 'error' : recipe.difficulty === 'Medium' ? 'warning' : 'success'}
                  />
                  {recipe.cuisine && (
                    <Chip label={recipe.cuisine} size="small" variant="outlined" />
                  )}
                </Box>
                <Box sx={{ mt: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {recipe.prepTimeMinutes && (
                    <Typography variant="body2" color="text.secondary">
                       {recipe.prepTimeMinutes}m prep
                    </Typography>
                  )}
                  {recipe.cookTimeMinutes && (
                    <Typography variant="body2" color="text.secondary">
                       {recipe.cookTimeMinutes}m cook
                    </Typography>
                  )}
                  {recipe.servings && (
                    <Typography variant="body2" color="text.secondary">
                       {recipe.servings} servings
                    </Typography>
                  )}
                  {recipe.caloriesPerServing && (
                    <Typography variant="body2" color="text.secondary">
                       {recipe.caloriesPerServing} cal
                    </Typography>
                  )}
                </Box>
                {recipe.rating && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                     {recipe.rating}/5
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<FavoriteIcon />}
                  onClick={() => handleAddFavorite(recipe.id)}
                >
                  Add to Favorites
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 2 }}>
         <Pagination 
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => handlePageChange(page)}
          color="primary"
          showFirstButton
          showLastButton
         />
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {notification}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default HomePage;