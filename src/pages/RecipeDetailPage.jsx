import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteRecipe, removeFavoriteRecipe } from '../features/userProfile/userProfileSlice';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardMedia,
  Alert,
  Rating,
  Grid,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { selectAllRecipes } from '../features/recipes/recipesSlice';

function RecipeDetailSkeleton() {
  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <Skeleton variant="rectangular" height={36} width={100} animation="wave" sx={{ mb: 3 }} />
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <Skeleton variant="rectangular" height={300} animation="wave" />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={48} width="60%" animation="wave" />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Skeleton variant="rectangular" height={32} width={80} animation="wave" />
              <Skeleton variant="rectangular" height={32} width={80} animation="wave" />
            </Box>
            <Skeleton variant="rectangular" height={48} width={200} animation="wave" sx={{ mb: 2 }} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Skeleton variant="text" height={40} width="40%" animation="wave" />
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} variant="text" height={48} animation="wave" sx={{ my: 1 }} />
        ))}
      </Paper>
    </Container>
  );
}

function RecipeDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const recipes = useSelector(selectAllRecipes);
  const { status } = useSelector((state) => state.recipes);
  const favoriteIds = useSelector((state) => state.userProfile.favoriteIds);

  if (status === 'loading' || status === 'idle') {
    return <RecipeDetailSkeleton />;
  }

  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Recipe not found.</Alert>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back home
        </Button>
      </Container>
    );
  }

  const isFavorite = favoriteIds.includes(recipe.id);

  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={recipe.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {recipe.name}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label={recipe.difficulty || 'Easy'}
                color={recipe.difficulty === 'Hard' ? 'error' : recipe.difficulty === 'Medium' ? 'warning' : 'success'}
              />
              {recipe.cuisine && (
                <Chip label={recipe.cuisine} variant="outlined" />
              )}
            </Box>

            {/* Time and Servings Info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {recipe.prepTimeMinutes && ` Prep: ${recipe.prepTimeMinutes} min`}
                {recipe.cookTimeMinutes && ` | Cook: ${recipe.cookTimeMinutes} min`}
                {recipe.servings && ` |  Servings: ${recipe.servings}`}
              </Typography>
              {recipe.caloriesPerServing && (
                <Typography variant="body2" color="text.secondary">
                   {recipe.caloriesPerServing} calories per serving
                </Typography>
              )}
            </Box>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Rating:
              </Typography>
              <Rating
                value={recipe.rating || 0}
                readOnly
                precision={1}
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
              {recipe.rating && (
                <Typography variant="body2" color="text.secondary">
                  ({recipe.rating}/5)
                </Typography>
              )}
              {recipe.reviewCount && (
                <Typography variant="body2" color="text.secondary">
                  ({recipe.reviewCount} reviews)
                </Typography>
              )}
            </Box>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tags:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {recipe.tags.map((tag, i) => (
                    <Chip key={i} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Meal Type */}
            {recipe.mealType && recipe.mealType.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Meal Type:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {recipe.mealType.map((type, i) => (
                    <Chip key={i} label={type} size="small" color="primary" />
                  ))}
                </Box>
              </Box>
            )}

            <Button
              variant={isFavorite ? 'outlined' : 'contained'}
              color={isFavorite ? 'error' : 'primary'}
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() =>
                isFavorite
                  ? dispatch(removeFavoriteRecipe(recipe.id))
                  : dispatch(addFavoriteRecipe(recipe.id))
              }
              fullWidth
              sx={{ mb: 2 }}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" component="h2" gutterBottom>
          Ingredients
        </Typography>
        <List>
          {recipe.ingredients?.map((ingredient, i) => (
            <ListItem key={i}>
              <ListItemText primary={ingredient} />
            </ListItem>
          ))}
        </List>

        {recipe.instructions && recipe.instructions.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Instructions
            </Typography>
            <List>
              {recipe.instructions.map((instruction, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`Step ${i + 1}`}
                    secondary={instruction}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default RecipeDetailPage;