require('dotenv').config();

const express = require('express');


const cors = require('cors');
const session = require('express-session');

const connectDB = require('./config/db');


const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const PORT = process.env.PORT || 3001;

//allow react requests
app.use (
    cors({
        origin: 'http://localhost:5173',
        credentials : true,
    })
);
// parse incoming json request bodies
app.use(express.json());

// manage login sessions using cookies 
app.use(

    session({
        name: 'recipebox.sid',
        secret: process.env.SESSION_SECRET,
        resave : false,
        saveUninitialized: false,
        cookie:{
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24* 60* 60 * 1000,
        },
    })
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Recipe box api is running' });
});
//recipe routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

//central error handler
app.use(errorHandler);
// starts the server after connecting to mongo db

connectDB().then(() => {
    app.listen(PORT, () => 
        console.log(`Recipe Box API running at http://localhost:${PORT}`));
});