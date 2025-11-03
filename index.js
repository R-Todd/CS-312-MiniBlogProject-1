// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const { Pool } = require('pg');              // PostgreSQL
const session = require('express-session');


// Initialize Express app
const app = express();

// View engine setup
app.set('view engine', 'ejs');


// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static('public'));               // css

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,  // pulled from .env
    resave: false,
    saveUninitialized: false
}));


// Database connection
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Makes currentUser + currentName available in all views
// ============================
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user_id || null;
    res.locals.currentName = req.session.name || null;
  next();
});


// Server configuration
const port = 3000;


// ---------- HOME ----------
app.get('/', async (req, res) => {
    try 
    {  
        const result = await pool.query('SELECT * FROM blogs ORDER BY date_created DESC');
        res.render('index', {
        posts: result.rows
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Server error while fetching posts.');
    }
});



//======== post route handler ========
// Create post route handler
app.post('/create-post', async (req, res) => {
    try 
    {
        // check if user is logged in - redirect to signin if not
        if (!req.session.user_id) {
            return res.redirect('/signin');
        }

        // load title and body to request body
        const {title, body} = req.body;

        // verify feilds are not empty
        if (!title || !body) {
            return res.send('Title and content are required.');
        }

        // SET query to insert new post into db
        const query = `
            INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created)
            VALUES ($1, $2, $3, $4, NOW())
        `;

        // insert into db
        await pool.query(query, [
            req.session.name, 
            req.session.user_id, 
            title, 
            body
        ]);

        // redirect to home page
        console.log(`New post titled "${title}" created by user ${req.session.user_id} with body "${body}.`);
        res.redirect('/');

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Server Error during post creation.');
    }

});

//=== end of create post route handler ===




//======== Delete post route handler ========

app.get('/delete-post/:id', async (req, res) => {
    try {
        // check if signed in
        if (!req.session.user_id) {
            return res.redirect('/signin');
        } 

        // get post id
        const postId = parseInt(req.params.id);

        // check post exists and belongs to user
        const PostQuery = 'SELECT * FROM blogs WHERE blog_id = $1 AND creator_user_id = $2';

        // run query
        const verifyResult = await pool.query(PostQuery, [postId, req.session.user_id]);

        // if post does not exist or does not belong to user
        if (verifyResult.rows.length === 0) {
            return res.send('Post not found or you do not have permission to delete this post.');
        }

        // delete only if user owns the post
        const deleteQuery = 'DELETE FROM blogs WHERE blog_id = $1 AND creator_user_id = $2';

        // execute delete query
        await pool.query(deleteQuery, [postId, req.session.user_id]);

        //redirect to home page log conesole content
        console.log(`Post with ID {${postId}} deleted by user ${req.session.user_id}.`);
        res.redirect('/');

    } catch (error) {
        console.error('Error deleting post:', error);

    }
});
//======== End delete post route handler ========

//======== (START) EDIT post route handler ========
app.get('/edit-post/:id', async (req, res) => {
    try {

        // check if signed in
        if (!req.session.user_id) {
            return res.redirect('/signin');
        }

        // query post id
        const editPostId = parseInt(req.params.id);

        // fetch post from db
        const verifyQuery = 'SELECT * FROM blogs WHERE blog_id = $1 AND creator_user_id = $2';
        // get result from query
        const verifyResult = await pool.query(verifyQuery, [editPostId, req.session.user_id]);

        // if post not found or does not belong to user
        if (verifyResult.rows.length === 0) {
            return res.send('You do not have permission to edit this post.');
        }


        /// Render edit.ejs with the post data
        res.render('edit', {
            post: verifyResult.rows[0],
            currentName: req.session.name
        });
        
    } catch (error) {
        console.error('Error loading edit post page:', error);
        res.status(500).send('Server error while loading edit post page.');
    }

});
//======== (END) EDIT post route handler ========

//======== (START) UPDATE post route handler ========
// Handles the "POST" request to actually update the post.
app.post('/update-post/:id', async (req, res) => {
    try {

        // check if signed in
        if (!req.session.user_id) {
            return res.redirect('/signin');
        }

        const editPostId = parseInt(req.params.id);

        // updated title and content from req.body
        const { title, body } = req.body;

        // check if title and body are empty
        if (!title || !body) {
            return res.send('Title and content are required.');
        }

        // fetch post from db
        const verifyQuery = 'SELECT * FROM blogs WHERE blog_id = $1 AND creator_user_id = $2';
        // get result from query
        const verifyResult = await pool.query(verifyQuery, [editPostId, req.session.user_id]);

        //verify ownership
        if (verifyResult.rows.length === 0) {
            return res.send('You do not have permission to edit this post.');
        }

        // update post & query
        const updateQuery = 'UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3 AND creator_user_id = $4';

        // run update query
        await pool.query(updateQuery, [title, body, editPostId, req.session.user_id]);

        //redirect and log console content
        console.log(`Post with ID {${editPostId}} updated by user ${req.session.user_id}.`);
        res.redirect('/');
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Server error while updating post.');
    }
});
//======== (END) UPDATE post route handler ========

// Display signup form
app.get('/signup', (req, res) => {
  res.render('signup');
});

//======== (START) CREATE ACCOUNT route handler ========
app.post('/signup', async (req, res) => {
    // check if user exits
    try 
    {
        const { user_id, password, name } = req.body;
        // check if text feilds are empty
        if (!user_id || !password || !name) {
            return res.send('All fields are required.');
        }

        // check if username is already exits in db
        const checkUserExistsQuery = 'SELECT * FROM users WHERE user_id = $1';
        // $1 is first value in query 
        const existingUser = await pool.query(checkUserExistsQuery, [user_id]);

        // user exists send error
        if (existingUser.rows.length > 0) {
            return res.send('Username already exists. Please choose a different one.');
        }

        // insert new user into db
        const insertUserQuery = 'INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)';
        // inserting into position $1, $2, $3

        // send the values to the query
        await pool.query(insertUserQuery, [user_id, password, name]);


        // redirect to sign in page
        res.redirect('/signin');

    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).send(' Server Error during sign up.');
    
    }
});
    //
//======== (END) CREATE ACCOUNT route handler ========

app.get('/signin', (req, res) => {
    res.render('signin');  // This will render views/signin.ejs
});

// Signin route handler
app.post('/signin', async (req, res) => {
    try {
        const { user_id, password } = req.body;

        // empty feild check
        if (!user_id || !password) {
            return res.send('Both username and password are required.');
        }

        // Check if user exists in the database
        const userQuery = 'SELECT * FROM users WHERE user_id = $1 AND password = $2';
        const existingUser = await pool.query(userQuery, [user_id, password]);

        // If user does not exist or password is incorrect
        if (existingUser.rows.length === 0) {
            return res.send('Invalid username or password.');
        }

        // check if entered password matches the stored password
        const storedPassword = existingUser.rows[0].password;

        if (storedPassword === password) 
            {
                // User authenticated successfully
                console.log(`User ${user_id} signed in successfully.`);
                // store session
                req.session.user_id = existingUser.rows[0].user_id;
                req.session.name = existingUser.rows[0].name;
                res.redirect('/'); // Redirect to home page or dashboard
            }
            else {
                // Passwords do not match
                return res.send('Invalid username or password.');
            }

    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).send('Server Error during sign in.');
    }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/signin');
  });
});
        

// === app.listen ===
// Make the app listen on the specified port

app.listen(port, () => {
    // log console to start server
    console.log(`Server is running at http://localhost:${port}`);
});

// === END app.listen ===