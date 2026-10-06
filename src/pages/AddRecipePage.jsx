import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addRecipe } from '../features/recipes/recipesSlice';

const emptyForm = {
  name: '',
  cuisine: '',
  difficulty: 'Easy',
  prepTimeMinutes: '',
  image: '',
  ingredients: '',   // one per line, converted to an array on submit
  instructions: '',  // one step per line
};

function AddRecipePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();// navigate to another page, easier to use rather than link when we want to do it programmatically after an action like form submission


  const [form, setForm] = useState(emptyForm); // form state, one object for all fields


  const [errors, setErrors] = useState({}); // state for validation errors

  // one handler for every field, using the input's name attribute
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {


    const newErrors = {};
    if (!form.name.trim())
         newErrors.name = 'Recipe name is required';
    if (form.prepTimeMinutes !== '' && Number(form.prepTimeMinutes) <= 0) {
      newErrors.prepTimeMinutes = 'Prep time must be a positive number';
    }


    if (form.image.trim() && !/^https?:\/\//.test(form.image.trim())) {
      newErrors.image = 'Image must be a link starting with http:// or https://';
    }


    const ingredientList = toList(form.ingredients);
    if (ingredientList.length === 0) {
      newErrors.ingredients = 'Add at least one ingredient';
    }

    return newErrors;
  };

  const toList = (text) =>
    
    text.split('\n').map((line) => line.trim()).filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser from reloading the page

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const newRecipe = {
      id: Date.now(),
      name: form.name.trim(),
      cuisine: form.cuisine.trim() || 'Not specified',
      difficulty: form.difficulty,
      prepTimeMinutes: Number(form.prepTimeMinutes) || 0,
      image: form.image.trim(),
      ingredients: toList(form.ingredients),
      instructions: toList(form.instructions),
      rating: 0,
    };

    dispatch(addRecipe(newRecipe));
    navigate(`/recipes/${newRecipe.id}`); // go straight to the new recipe
  };

  return (
    <div>
      <Link to="/">← Back</Link>
      <h1>Add a Recipe</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="cuisine">Cuisine</label>
          <input id="cuisine" name="cuisine" value={form.cuisine} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="prepTimeMinutes">Prep time (minutes)</label>
          <input
            id="prepTimeMinutes"
            name="prepTimeMinutes"
            type="number"
            value={form.prepTimeMinutes}
            onChange={handleChange}
          />
          {errors.prepTimeMinutes && <p style={{ color: 'red' }}>{errors.prepTimeMinutes}</p>}
        </div>

        <div>
          <label htmlFor="image">Image link</label>
          <input id="image" name="image" value={form.image} onChange={handleChange} />
          {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
        </div>

        <div>
          <label htmlFor="ingredients">Ingredients * (one per line)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            rows="5"
            value={form.ingredients}
            onChange={handleChange}
          />
          {errors.ingredients && <p style={{ color: 'red' }}>{errors.ingredients}</p>}
        </div>

        <div>
          <label htmlFor="instructions">Instructions (one step per line)</label>
          <textarea
            id="instructions"
            name="instructions"
            rows="5"
            value={form.instructions}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Recipe</button>
      </form>
    </div>
  );
}

export default AddRecipePage;