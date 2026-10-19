const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');


const app = express();
const PORT = 3001;

app.use(express.json());

app.use( // coonect with the front end
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(
    session({
        name: 'recipebox.sid',
        secret: process.env.SESSION_SECRET || 'development-only-secret-change-before-deployment',
        resave: false,
        saveUninitialized:false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24,

        },
    })
);

let recipes = [
  {
    id: 1,
    name: 'Vegetable Pasta',
    cuisine: 'Italian',
    difficulty: 'Easy',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings:2,
    caloriesPerServing:350,
    image:'',
    ingredients: ['Pasta', 'Tomatoes', 'Onion'],
    instructions: [
      'Boil the pasta',
      'Prepare the sauce',
      'Mix and serve',
    ],
    rating:0,
  },
];


let users = [];




app.get('/api/health' , (req, res) => {
    res.json({
        status: 'ok',
        message: 'Recipe box api is runnning',
    });
});
// regestration endpoint 

app.post('/api/auth/register'  , async (req, res) => {
    try{
        const {name , email , password} = req.body;

        if(
            typeof name !== 'string' || !name.trim() ||
            typeof email !== 'string' ||!email.trim() ||
            typeof password !== 'string' || password.length < 8
        ) {
            return res.status(400).json({
                message: 'Name and Email are Recorded. Password Length must be atleast 8 characters.',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();


        const existingUser =  users.find((user) => user.email === normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                message:'An account with the email already exists',
            })
        }

        const passwordHash = await bcrypt.hash(password,12);


        const newUser ={
            id: Date.now(),
            name:name.trim(),
            email: normalizedEmail,
            passwordHash,

        };

        users.push(newUser);


        return res.status(201).json({
            message: 'Account created Succesfully ',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch(error) {
        console.error('registration error :' ,error);
        return res.status(500).json({
            message: 'an unexpected error occured during regestration .',
        })
    }
})

//login end point 


    app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate the input
        if (
        typeof email !== 'string' ||
        !email.trim() ||
        typeof password !== 'string' ||
        !password
        ) {
        return res.status(400).json({
            message: 'Email and password are required.',
        });
        }

        // 2. Find the registered user
        const normalizedEmail = email.trim().toLowerCase();

        const user = users.find(
        (item) => item.email === normalizedEmail
        );

        // 3. Reject unknown emails or incorrect passwords
        if (
        !user ||
        !(await bcrypt.compare(password, user.passwordHash))
        ) {
        return res.status(401).json({
            message: 'Invalid email or password.',
        });
        }

        req.session.userId = user.id;// session

        // 4. Return public user details
        return res.status(200).json({
        message: 'Login successful.',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        });
    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
        message: 'An unexpected error occurred during login.',
        });
    }
    });

    //save login session endpoint

    app.get('/api/auth/me', (req, res) => {
        if(!req.session.userId) {
            return res.status(401).json({

                message: 'NOT AUTHENTICATED',
            });
        }

        const user = users.find(
            (item) => item.id === req.session.userId);


        if(!user) {
            return res.status(401).json({
                message: ' not authenticated',
            });

        }

        return res.status(200).json({
            user: {
                id: user.id,
                name:user.name,
                email:user.email,
            },
        });
    });


    //logout endpoint

    app.post('/api/auth/logout' , (req , res) => {
        if (!req.session) {
            return res.status(500).json({
                message: ' session middlware is not configured correctly ',
            });
        }


        req.session.destroy((error) =>{             ///remove session from the session store 
            if(error) {
                return res.status(500).json({
                    message: 'Could not log out',
                });
            }

            res.clearCookie('recipebox.sid', {          /// tell browser to clear cookie session 
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
            });

            return res.status(200).json({
                message: 'Logged out succesfully',
            });

        });
    });

    // recipes endpoints

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
    const {
        name , 
        cuisine ,
        difficulty ,
        prepTimeMinutes,
        cookTimeMinutes,
        servings,
        caloriesPerServing,
        image,
        ingredients ,
        instructions,
        
    } = req.body;

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

    //preptime & cooktime
    for (const [field, value] of Object.entries({
        prepTimeMinutes,
        cookTimeMinutes,
    })) {
        if(
            typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1440
        )
        {
            return res.status(400).json({
                message: `${field} must be a number between 0 and 1440.`,
            });
        }
    }

    //servings

    if(
        typeof servings !== 'number' || !Number.isInteger(servings) || servings < 1 || servings > 100 
    )   {
        return res.status(400).json({
            message: 'Serving must be a whole number between 1 and 100',
        });
    }



    // calories

    if (
        typeof caloriesPerServing !== 'number' || !Number.isFinite(caloriesPerServing) || 
        caloriesPerServing < 0 || caloriesPerServing >  10000
    ) {
        return res.status(400).json({
            message: ' Calories must be a number beteen 0 and 10000',
        });
    }


    //image
    if (
        image !== undefined && image !== '' && (
            typeof image !== 'string' || !/^https?:\/\/\S+$/i.test(image.trim())
        )
    ) {
        return res.status(400).json({
            message:'image must be a HTTP or HTTPS URL',
        })
    }
 //ingredients

    if(
        !Array.isArray(ingredients) || ingredients.length === 0 || !ingredients.every(
        
    (item) => typeof item === 'string' && item.trim()    
) ) {
    return res.status(400).json({
        message:'ingredeints must be a non empty array text'
    })
}
 // instructions

    if(
        !Array.isArray(instructions) || instructions.length ===0 || !instructions.every (
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
        prepTimeMinutes,
        cookTimeMinutes,
        servings,
        caloriesPerServing,
        image: image? image.trim(): '',
        ingredients :ingredients.map((item) => item.trim()),
        instructions: instructions.map((item) => item.trim()),
        rating: 0,
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