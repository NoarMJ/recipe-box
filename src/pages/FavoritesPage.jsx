import { useDispatch, useSelector } from 'react-redux';
import { setRating } from '../features/recipes/recipesSlice';
import { removeFavoriteRecipe } from '../features/userProfile/userProfileSlice';
import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Box,
  Rating,
  Alert,
  Chip,
  Skeleton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

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
          <Skeleton variant="rectangular" height={36} width={100} animation="wave" />
        </CardActions>
      </Card>
    </Grid>
  );
}

function FavoritesPage() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  const { items: recipes, status } = useSelector((state) => state.recipes);

  const favoriteIds = useSelector((state) => state.userProfile.favoriteIds);

  const favoriteRecipes = recipes.filter((r) => favoriteIds.includes(r.id));

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = favoriteRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(favoriteRecipes.length / recipesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetRating = async (recipe, rating) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/recipes/${recipe.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating }),
        }
      );

      if (!response.ok) throw new Error('Rating failed');

      dispatch(setRating({ id: recipe.id, rating }));
    } catch (err) {
      console.error(err);
    }
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Favorite Recipes
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <RecipeCardSkeleton key={item} />
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Favorite Recipes
      </Typography>

      {favoriteRecipes.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No favorites yet. Add some recipes to your favorites!
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
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
                  {recipe.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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
                      ⏱️ {recipe.prepTimeMinutes}m prep
                    </Typography>
                  )}
                  {recipe.cookTimeMinutes && (
                    <Typography variant="body2" color="text.secondary">
                      🔥 {recipe.cookTimeMinutes}m cook
                    </Typography>
                  )}
                  {recipe.servings && (
                    <Typography variant="body2" color="text.secondary">
                      👥 {recipe.servings} servings
                    </Typography>
                  )}
                  {recipe.caloriesPerServing && (
                    <Typography variant="body2" color="text.secondary">
                      🔥 {recipe.caloriesPerServing} cal
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Your rating:
                  </Typography>
                  <Rating
                    name={`rating-${recipe.id}`}
                    value={recipe.rating || 0}
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        handleSetRating(recipe, newValue);
                      }
                    }}
                    precision={1}
                    emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => dispatch(removeFavoriteRecipe(recipe.id))}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 2 }}>
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default FavoritesPage;