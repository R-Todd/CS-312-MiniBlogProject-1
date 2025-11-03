// copied from index.js and edited for react front end
// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors'); // cors to request resources from server (diffent orgin)
const { Pool } = require('pg');              // PostgreSQL
const session = require('express-session');


// Initialize Express app
const app = express();

// View engine !!! removed for react front end
// app.set('view engine', 'ejs');

//enable cors
app.use(cors(
    {
    origin: 'http://localhost:3000', // REACT front end is default on port 3000
    credentials: true // Allow cookies
}));


// use express to parse json bodies
app.use(express.json()); // react sends json data

// ENV Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET,  // pulled from .env
    resave: false,
    saveUninitialized: false
}));

// Database connection - same as index.js
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});


// ---------------- END OF SETUP ---------------- //


// ============ API ROUTES ============ //

// API test route
app.get('/api/test', (req, res) => {
    // send json message to conform server is running, res = response object
    // uses res.json instead of res.send
    res.json({ message: 'Server.js API running with cookie sessions active' }); 
});

// ---------- HOME ----------

// LIST BLOG POSTS
 app.get('/api/blogs', async (req, res) => {
    // fetch blog post from db and send as json to /api/blogs route
    try 
    {  
        // retrieve all blog posts from db -- same as index.js
        const result = await pool.query('SELECT * FROM blogs ORDER BY date_created DESC');
        // instead of res.render we will use res.json and send the same result rows
        res.json(result.rows);

    } catch (error) {
        console.error('Error fetching blog posts(home):', error);
        // instead of .send(``) send json error
        res.status(500).json({ error: 'Error fetching blog posts' });
    }
});

//======== post route handler ========
// Create post route handler - copied from index.js
app.post('/api/blogs', async (req, res) => {
    try 
    {
        // load title and body to request body
        const {title, body} = req.body;

        // verify feilds are not empty
        if (!title || !body) {
            // use res.status(400) instad of res.send
            return res.status(400).json({ error: 'Title and body are required' });
        }

        // SET query to insert new post into db
        // const query = `INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created)
        //     VALUES ($1, $2, $3, $4, NOW())`;

        const result = await pool.query(
            // instead of query call the same query line but load into [title, body]
        'INSERT INTO blogs (title, body, date_created) VALUES ($1, $2, NOW()) RETURNING *',
        [title, body]
        );

        // respond with inserted post (as json)
        res.status(201).json(result.rows[0]); // top of array


    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: 'Error creating blog post' });
    }


});





// ------------- END OF API ROUTES ------------- //


// ======== Server Start ======== //
// SERVER PORT
const PORT = 8000;
// CONSOLE MESSAGE - logs when running node server.js from /server
app.listen(PORT, () => {
    // log message to console and show browser address
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test route (http://localhost:${PORT}/api/test )`);
});