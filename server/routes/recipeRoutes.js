const router = require('express').Router();
const { getRecipes, getRecipeById, createRecipe } = require('../controllers/recipeController');
const validateRecipe = require('../middleware/validateRecipe');
const requireAuth =  require('../middleware/requireAuth');

router.get('/', requireAuth, getRecipes);
router.get('/:id',requireAuth, getRecipeById);
router.post('/',requireAuth, validateRecipe, createRecipe);

module.exports = router;