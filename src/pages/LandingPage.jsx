import { useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Typography, Button, Box } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { selectAllRecipes } from '../features/recipes/recipesSlice';

// Palette for the hero only. Sections below use theme tokens so dark mode keeps working.
const PINE = '#17382E';
const SAFFRON = '#F2B531';
const TOMATO = '#D8452F';

// Optional: add Fraunces via a Google Fonts <link> in index.html.
// Without it the headline falls back to Georgia.
const headlineFont = "'Fraunces', Georgia, 'Times New Roman', serif";

const features = [
  {
    icon: RestaurantIcon,
    title: 'Browse recipes',
    text: 'Recipes from many cuisines, each with ingredients, steps, prep and cook time, and calories.',
  },
  {
    icon: EditNoteIcon,
    title: 'Add your own',
    text: 'Write down a recipe with a photo, ingredients, and steps. It is saved on this device.',
  },
  {
    icon: FavoriteBorderIcon,
    title: 'Save favorites',
    text: 'Tap the heart on any recipe to keep it handy for next time.',
  },
];

function RecipeTile({ recipe, offset }) {
  return (
    <Box
      component={RouterLink}
      to={`/recipes/${recipe.id}`}
      sx={{
        position: 'relative',
        display: 'block',
        aspectRatio: '1 / 1',
        borderRadius: 2,
        overflow: 'hidden',
        mt: offset ? 5 : 0,
        backgroundColor: 'rgba(255,255,255,0.08)',
        '&:hover img': { transform: 'scale(1.04)' },
        '&:focus-visible': { outline: `3px solid ${SAFFRON}`, outlineOffset: 3 },
      }}
    >
      <Box
        component="img"
        src={recipe.image}
        alt={recipe.name}
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.3s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          p: 1.5,
          pt: 4,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'white', lineHeight: 1.25 }}>
          {recipe.name}
        </Typography>
      </Box>
    </Box>
  );
}

function PlaceholderTile({ offset, color }) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        aspectRatio: '1 / 1',
        borderRadius: 2,
        mt: offset ? 5 : 0,
        backgroundColor: color,
        opacity: 0.85,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <RestaurantIcon sx={{ fontSize: 48, color: PINE }} />
    </Box>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const recipes = useSelector(selectAllRecipes);

  // Four real recipe photos for the hero. Falls back to placeholders until the fetch finishes.
  const featured = useMemo(
    () => recipes.filter((r) => r.image).slice(0, 4),
    [recipes]
  );

  const placeholderColors = [SAFFRON, TOMATO, SAFFRON, TOMATO];

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ backgroundColor: PINE, color: 'white', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
              gap: { xs: 5, md: 8 },
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontFamily: headlineFont,
                  fontWeight: 600,
                  fontSize: { xs: '2.4rem', md: '3.4rem' },
                  lineHeight: 1.1,
                  mb: 2.5,
                }}
              >
                Every recipe you want to cook, in one place
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{ fontWeight: 400, opacity: 0.85, maxWidth: 480, mb: 4 }}
              >
                Browse recipes from around the world, add your own, and favorite
                the ones you want to make again.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/homePage')}
                  sx={{
                    backgroundColor: SAFFRON,
                    color: PINE,
                    fontWeight: 700,
                    px: 4,
                    '&:hover': { backgroundColor: '#f5c459' },
                  }}
                >
                  Browse recipes
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/add-recipe')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.6)',
                    px: 4,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  Add a recipe
                </Button>
              </Box>
            </Box>

            {/* Real recipes from the store */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
              }}
            >
              {featured.length === 4
                ? featured.map((recipe, i) => (
                    <RecipeTile key={recipe.id} recipe={recipe} offset={i % 2 === 1} />
                  ))
                : placeholderColors.map((color, i) => (
                    <PlaceholderTile key={i} color={color} offset={i % 2 === 1} />
                  ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* What you can do */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 9 } }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontFamily: headlineFont, fontWeight: 600, mb: 5 }}
        >
          What you can do
        </Typography>

        <Box>
          {features.map(({ icon: Icon, title, text }, i) => (
            <Box
              key={title}
              sx={{
                display: 'flex',
                gap: 3,
                alignItems: 'flex-start',
                py: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                ...(i === features.length - 1 && {
                  borderBottom: '1px solid',
                  borderBottomColor: 'divider',
                }),
              }}
            >
              <Icon sx={{ fontSize: 32, mt: 0.5, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 520 }}
                >
                  {text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Closing call to action */}
      <Box sx={{ backgroundColor: 'background.paper', py: { xs: 6, md: 8 } }}>
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontFamily: headlineFont, fontWeight: 600 }}
          >
            Found something to cook tonight?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/homePage')}
            sx={{ px: 4, flexShrink: 0 }}
          >
            Browse recipes
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;