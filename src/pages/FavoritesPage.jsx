
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectAllRecipes,
  setRating,
} from '../features/recipes/recipesSlice';

import {
  removeFavoriteRecipe,
} from '../features/userProfile/userProfileSlice';

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
        <Skeleton
          variant="rectangular"
          height={200}
          animation="wave"
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" height={32} width="80%" />
          <Skeleton
            variant="text"
            height={24}
            width="40%"
            sx={{ mt: 1 }}
          />
          <Skeleton
            variant="text"
            height={20}
            width="60%"
            sx={{ mt: 1 }}
          />
        </CardContent>

        <CardActions>
          <Skeleton
            variant="rectangular"
            height={36}
            width={100}
          />
        </CardActions>
      </Card>
    </Grid>
  );
}

function FavoritesPage() {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  // Get both API recipes and user-created recipes.
  const recipes = useSelector(selectAllRecipes);

  const { status, error } = useSelector(
    (state) => state.recipes
  );

  const favoriteIds = useSelector(
    (state) => state.userProfile.favoriteIds
  );

  const favoriteRecipes = recipes.filter((recipe) =>
    favoriteIds.includes(recipe.id)
  );

  const totalPages = Math.ceil(
    favoriteRecipes.length / recipesPerPage
  );

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;

  const currentRecipes = favoriteRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  // Keep pagination valid after a favorite is removed.
  useEffect(() => {
    const lastValidPage = Math.max(1, totalPages);

    if (currentPage > lastValidPage) {
      setCurrentPage(lastValidPage);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSetRating = (recipe, rating) => {
    console.log('Recipe:', recipe.id, recipe.name);
    console.log('Selected rating:', rating);
    if (rating === null) return;

    dispatch(
      setRating({
        id: recipe.id,
        rating,
      })
    );
  };

  

  // Show loading placeholders while the initial request is running.
  if (status === 'idle' || status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Favorite Recipes
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {Array.from({ length: 9 }, (_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </Grid>
      </Container>
    );
  }

  // If loading fails, local user-created favorites can still be shown.
  if (status === 'failed' && favoriteRecipes.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Favorite Recipes
        </Typography>

        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Unable to load recipes. Please try again later.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Favorite Recipes
      </Typography>

      {status === 'failed' && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Some recipes could not be loaded from the API. Your
          locally saved favorites are still available.
        </Alert>
      )}

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
                image={
                  recipe.image ||
                  'https://via.placeholder.com/300x200?text=No+Image'
                }
                alt={recipe.name}
                sx={{ objectFit: 'cover' }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                >
                  {recipe.name}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    mb: 2,
                  }}
                >
                  <Chip
                    label={recipe.difficulty || 'Easy'}
                    size="small"
                    color={
                      recipe.difficulty === 'Hard'
                        ? 'error'
                        : recipe.difficulty === 'Medium'
                          ? 'warning'
                          : 'success'
                    }
                  />

                  {recipe.cuisine && (
                    <Chip
                      label={recipe.cuisine}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    mt: 1.5,
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  {recipe.prepTimeMinutes != null && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      ⏱️ {recipe.prepTimeMinutes}m prep
                    </Typography>
                  )}

                  {recipe.cookTimeMinutes != null && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      🔥 {recipe.cookTimeMinutes}m cook
                    </Typography>
                  )}

                  {recipe.servings != null && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      👥 {recipe.servings} servings
                    </Typography>
                  )}

                  {recipe.caloriesPerServing != null && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      🔥 {recipe.caloriesPerServing} cal
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Your rating:
                  </Typography>

                  <Rating
                    name={`rating-${recipe.id}`}
                    value={recipe.rating ?? 0}
                    onChange={(event, newValue) =>
                      handleSetRating(recipe, newValue)
                    }
                    precision={1}
                    emptyIcon={
                      <StarIcon
                        style={{ opacity: 0.3 }}
                        fontSize="inherit"
                      />
                    }
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    ({recipe.rating ?? 0}/5)
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() =>
                    dispatch(removeFavoriteRecipe(recipe.id))
                  }
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mt: 4,
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <Typography variant="body1">
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
