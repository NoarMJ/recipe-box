const express = require('express');

const app = express();
const PORT = 3001;

app.use(express.json());

let recipes = [
  {
    id: 1,
    name: 'Vegetable Pasta',
    cuisine: 'Italian',
    difficulty: 'Easy',
    ingredients: ['Pasta', 'Tomatoes', 'Onion'],
    instructions: [
      'Boil the pasta',
      'Prepare the sauce',
      'Mix and serve',
    ],
  },
];





app.get('/api/health' , (req, res) => {
    res.json({
        status: 'ok',
        message: 'Recipe box api is runnning',
    });
});

app.get('/api/recipes' , (req , res) => {
    res.json(recipes);
})

app.get('/api/recipes/:id' ,(req , res ) => {

    const recipe = recipes.find((item) => 

        String(item.id) === req.params.id
    );

    if(!recipe) {
        return res.status(404).json({
            message: 'Recipe not found',
        });
    }
    res.json(recipe);
});

app.post('/api/recipes' , (req, res) => {
    const {name , cuisine , difficulty ,ingredients ,instructions} = req.body;

    if(!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            message: 'Recipe name is required',
        })
    }

    if(!cuisine || typeof cuisine !== 'string' || !cuisine.trim()) {
        return res.status(400).json({
            message:'No Cuisine entry',
        });
    }

    const allowedDifficulties =['Easy' ,'Medium' , 'Hard'];

    if( !allowedDifficulties.includes(difficulty)) { 
        return res.status(400).json({
            message :'set required difficulty',
        });
    }

    if(
        !Array.isArray(ingredients) || !ingredients === 0 || !ingredients.every(
        
    (item) => typeof item === 'string' && item.trim()    
) ) {
    return res.status(400).json({
        message:'ingredeints must be a non empty array text'
    })
}


    if(
        !Array.isArray(instructions) || !instructions ===0 || !instructions.every (
            (item) =>  typeof item ==='string' && item.trim()
        )
    ) 
    {
        return res.status(400).json({
            message:'instrunctions must be a non empty array'
        });
    }


    const newRecipe = {
        id: Date.now(),
        name: name.trim(),
        cuisine: cuisine.trim(),
        difficulty,
        ingredients :ingredients.map((item) => item.trim()),
        instructions: instructions.map((item) => item.trim()),
    };

    recipes.push(newRecipe);

    res.status(201).json(newRecipe);



});


    
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err
  ) {
    return res.status(400).json({
      message: 'Invalid JSON in request body.',
    });
  }

  next(err);
});


app.listen(PORT , () => {
    console.log(`Recipe Box API running at http://localhost:${PORT}`);

});