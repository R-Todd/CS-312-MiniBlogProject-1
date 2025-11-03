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


// ========================= END OF SETUP ========================= //


// API test route
app.get('/api/test', (req, res) => {
    // send json message to conform server is running, res = response object
    // uses res.json instead of res.send
    res.json({ message: 'Server.js API running with cookie sessions active' }); 
});

// SERVER PORT
const PORT = 8000;

//
app.listen(PORT, () => {
    // log message to console and show browser address
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test route (http://localhost:$/api/test )`);
});