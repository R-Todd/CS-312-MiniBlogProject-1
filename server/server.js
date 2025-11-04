// copied from index.js and edited for react front end
// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Import dependencies
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pool from './db/pool.js';        // shared db pool
import authRoutes from './routes/auth.js';


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
    secret: 'secretSession123445',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,            // prevent client-side JS access
        secure: false,             // false for localhost; set true in production (HTTPS)
        sameSite: 'lax',          //  cross-origin cookies
    }
}));


// ---------------- END OF SETUP ---------------- //


// ============ API ROUTES ============ //
// Use auth routes
app.use('/api/auth', authRoutes);

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
        const result = await pool.query(`
            SELECT
                blogs.blog_id,
                blogs.title,
                blogs.body,
                blogs.date_created,
                blogs.creator_user_id,
                users.name AS creator_name
            FROM blogs
            JOIN users ON blogs.creator_user_id = users.user_id
            ORDER BY blogs.date_created DESC;`);

        // instead of res.render we will use res.json and send the same result rows
        res.json(result.rows);

    } catch (error) {
        console.error('Error fetching blog posts(home):', error);
        // instead of .send(``) send json error
        res.status(500).json({ error: 'Error fetching blog posts' });
    }
});

//======== post route handler ========
// Create post route handler - copied/edited from index.js
app.post('/api/blogs', async (req, res) => {
    try 
    {
        const user = req.session.user_id ? {
            user_id: req.session.user_id,
            name: req.session.name
        } : null;

        if (!user) {
            return res.status(401).json({ message: 'You must be signed in to post.' });
        }
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
            
        `INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created)
        VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,

        [user.name, user.user_id, title, body]
    );

        // respond with inserted post (as json)
        res.status(201).json(result.rows[0]); // top of array
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: 'Error creating blog post' });
    }

});


app.delete('/api/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user?.user_id;

    if (!userId) return res.status(401).json({ message: 'Not authorized' });


    try {
        // verify user owns the post before deleting
        const result = await pool.query(
        'DELETE FROM blogs WHERE blog_id = $1 AND creator_user_id = $2 RETURNING *',
        [id, userId]
        );

        if (result.rowCount === 0) {
        return res.status(403).json({ message: 'Cannot delete another user’s post' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
    });


app.put('/api/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;
    const userId = req.session.user?.user_id;

    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    try {
        const result = await pool.query(
            `UPDATE blogs
            SET title = $1, body = $2
            WHERE blog_id = $3 AND creator_user_id = $4
            RETURNING *`,
            [title, body, id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({ message: 'Cannot edit another user’s post' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post' });
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