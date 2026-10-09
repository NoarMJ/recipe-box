import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addRecipe } from '../features/recipes/recipesSlice';

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const emptyForm = {
  name: '',
  cuisine: '',
  difficulty: 'Easy',
  prepTimeMinutes: '',
  cookTimeMinutes: '',
  servings: '',
  caloriesPerServing: '',
  image: '',
  imageFile: null,
};


function AddRecipePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);

  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const addIngredient = () => {
    setIngredients((prev) => [...prev, '']);
  };


  const handleIngredientChange = (index, value) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };


  const addInstruction = () => {
    setInstructions((prev) => [...prev, '']);
  };


  const handleInstructionChange = (index, value) => {
    setInstructions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };


  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Recipe name is required';
    }

    // Prep time validation
    if (form.prepTimeMinutes !== '') {
      const prepTime = Number(form.prepTimeMinutes);
      if (isNaN(prepTime)) {
        newErrors.prepTimeMinutes = 'Prep time must be a number';
      } else if (prepTime < 0) {
        newErrors.prepTimeMinutes = 'Prep time cannot be negative';
      } else if (prepTime > 1440) {
        newErrors.prepTimeMinutes = 'Prep time cannot exceed 24 hours (1440 minutes)';
      }
    }

    // Cook time validation
    if (form.cookTimeMinutes !== '') {
      const cookTime = Number(form.cookTimeMinutes);
      if (isNaN(cookTime)) {
        newErrors.cookTimeMinutes = 'Cook time must be a number';
      } else if (cookTime < 0) {
        newErrors.cookTimeMinutes = 'Cook time cannot be negative';
      } else if (cookTime > 1440) {
        newErrors.cookTimeMinutes = 'Cook time cannot exceed 24 hours (1440 minutes)';
      }
    }

    // Servings validation
    if (form.servings !== '') {
      const servings = Number(form.servings);
      if (isNaN(servings)) {
        newErrors.servings = 'Servings must be a number';
      } else if (servings <= 0) {
        newErrors.servings = 'Servings must be positive';
      } else if (servings > 100) {
        newErrors.servings = 'Servings cannot exceed 100';
      }
    }

    // Calories validation
    if (form.caloriesPerServing !== '') {
      const calories = Number(form.caloriesPerServing);
      if (isNaN(calories)) {
        newErrors.caloriesPerServing = 'Calories must be a number';
      } else if (calories < 0) {
        newErrors.caloriesPerServing = 'Calories cannot be negative';
      } else if (calories > 10000) {
        newErrors.caloriesPerServing = 'Calories cannot exceed 10,000';
      }
    }

    // Image validation (only validate URL if no file is uploaded)
    if (!form.imageFile && form.image.trim() && !/^https?:\/\//.test(form.image.trim())) {
      newErrors.image = 'Image must be a link starting with http:// or https://, or upload a file';
    }

    const validIngredients = ingredients
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);

    if (validIngredients.length === 0) {
      newErrors.ingredients = 'Add at least one ingredient';
    }

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Handle image - use uploaded file if available, otherwise use URL
    let finalImage = form.image.trim();
    if (form.imageFile) {
      finalImage = imagePreview;
    }

    const newRecipe = {
      id: Date.now(),
      name: form.name.trim(),
      cuisine: form.cuisine.trim() || 'Not specified',
      difficulty: form.difficulty,
      prepTimeMinutes: Number(form.prepTimeMinutes) || 0,
      cookTimeMinutes: Number(form.cookTimeMinutes) || 0,
      servings: Number(form.servings) || 1,
      caloriesPerServing: Number(form.caloriesPerServing) || 0,
      image: finalImage,
      ingredients: ingredients
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
      instructions: instructions
        .map((instruction) => instruction.trim())
        .filter(Boolean),
      rating: 0,
    };

    dispatch(addRecipe(newRecipe));
    navigate(`/recipes/${newRecipe.id}`);
  };


  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>

      <Button
        component={Link}
        variant="outlined"
        color="secondary"
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Centered Page Title */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Add a Recipe
      </Typography>

      {/* Form Container */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <Grid container spacing={3}>

            {/* Recipe Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipe Name *"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            {/* Cuisine */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cuisine"
                name="cuisine"
                value={form.cuisine}
                onChange={handleChange}
              />
            </Grid>

            {/* Difficulty */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Difficulty</FormLabel>
                <RadioGroup
                  row
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                  <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                  <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Prep Time */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Prep Time (minutes)"
                name="prepTimeMinutes"
                type="number"
                value={form.prepTimeMinutes}
                onChange={handleChange}
                error={!!errors.prepTimeMinutes}
                helperText={errors.prepTimeMinutes}
                inputProps={{ min: 0, max: 1440 }}
              />
            </Grid>

            {/* Cook Time */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cook Time (minutes)"
                name="cookTimeMinutes"
                type="number"
                value={form.cookTimeMinutes}
                onChange={handleChange}
                error={!!errors.cookTimeMinutes}
                helperText={errors.cookTimeMinutes}
                inputProps={{ min: 0, max: 1440 }}
              />
            </Grid>

            {/* Servings */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Servings"
                name="servings"
                type="number"
                value={form.servings}
                onChange={handleChange}
                error={!!errors.servings}
                helperText={errors.servings}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>

            {/* Calories */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calories per Serving"
                name="caloriesPerServing"
                type="number"
                value={form.caloriesPerServing}
                onChange={handleChange}
                error={!!errors.caloriesPerServing}
                helperText={errors.caloriesPerServing}
                inputProps={{ min: 0, max: 10000 }}
              />
            </Grid>

            {/* Image Upload or URL */}
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Image (Upload or URL)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ flex: 1 }}
                  >
                    Upload File
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    or
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Image URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={handleChange}
                error={!!errors.image}
                helperText={errors.image}
              />
            </Grid>

            {/* Image Preview */}
            {imagePreview && (
              <Grid item xs={12}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 'auto',
                    borderRadius: 1,
                    mt: 1,
                  }}
                />
              </Grid>
            )}

            {/* Ingredients */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ingredients *
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {ingredients.map((ingredient, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                  >
                    <Typography sx={{ minWidth: 25, fontWeight: 'bold' }}>
                      {index + 1}.
                    </Typography>
                    <TextField
                      fullWidth
                      label={`Ingredient ${index + 1}`}
                      placeholder="Enter ingredient"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                    />
                  </Box>
                ))}
              </Box>
              <Button
                type="button"
                variant="outlined"
                onClick={addIngredient}
                sx={{ mt: 2 }}
              >
                + Add Ingredient
              </Button>
              {errors.ingredients && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.ingredients}
                </Typography>
              )}
            </Grid>

            {/* Instructions */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Instructions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {instructions.map((instruction, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
                  >
                    <Typography sx={{ minWidth: 25, fontWeight: 'bold', mt: 1.5 }}>
                      {index + 1}.
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label={`Step ${index + 1}`}
                      placeholder="Enter instruction"
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                    />
                  </Box>
                ))}
              </Box>
              <Button
                type="button"
                variant="outlined"
                onClick={addInstruction}
                sx={{ mt: 2 }}
              >
                + Add Instruction
              </Button>
            </Grid>

            {/* Save Recipe - centered at bottom */}
            <Grid item xs={12} sx={{ mt: 4, display: 'block', textAlign: 'right' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ minWidth: 200, py: 1.5 }}
              >
                Save Recipe
              </Button>
            </Grid>

          </Grid>
        </Box>
      </Paper>

    </Container>
  );
}


export default AddRecipePage;
