// /server/routes/auth.js


import express from 'express';
import pool from '../db/pool.js';


const router = express.Router(); // create router instance

router.post('/signup', async (req, res) => {

    // create a new user and start a session
    const { user_id, password, name } = req.body;

    // verify password and userid
    if (!user_id || !password || !name) {
        return res.status(400).json({ error: 'UserId, password, and name are required' });
    }

    try {
        // check if user already exists
        const result = await pool.query(
            'INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3) RETURNING user_id, name',
            [user_id, password, name]
    );

    // create session
    req.session.user_id = result.rows[0].user_id;
    req.session.name = result.rows[0].name;

    // success message
    res.status(201).json({ 
        message: 'User created successfully', 
        user: result.rows[0] 
    });

    } catch (error) {
        console.error('Error during signup:', error);
        
        if (error.code === '23505') { // duplicate primaty key error code
            return res.status(409).json({ message: 'User ID already exists' });
        }

        res.status(500).json({ message: 'Error during signup' }); // 500 server error
    }
});


// ============ SIGN IN LOGIC ============ //
router.post('/signin', async (req, res) => {
    const { user_id, password } = req.body;

    // same as index.js 
    // check if feilds are empty
    if (!user_id || !password) {
        return res.status(400).json({ error: 'User ID and password are required' });
    }

    // search db for user credentials
    try {
        // select user from db
        const result = await pool.query(
            'SELECT * FROM users WHERE user_id = $1 AND password = $2',
            [user_id, password]
        );

        //  invalid credentials - change to json error from index.js
        if (result.rows.length === 0) {
            // return error for invalid credentials
            return res.status(401).json({ error: 'Invalid user ID or password' });
        }

        // save user info to session
        const user = result.rows[0];
        req.session.user_id = user.user_id;
        req.session.name = user.name;

        // success message
        res.json({
            message: 'Sign-in successful',
            user: { user_id: user.user_id, name: user.name }, // send successful user info
            console: console.log('User signed in:', user.user_id)
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ error: 'Error during signin' }); // 500 server error
    }
});

// ============ Sign out logic ============ //
router.post('/signout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        // ✅ Clear cookie on client side
        res.clearCookie('connect.sid');
        return res.json({ message: 'Successfully logged out' });
        });
    } else {
        res.status(200).json({ message: 'No active session' });
    }
});



// ============ session check if active ============ //
router.get('/session', (req, res) => {
    // check if session is active
    if (!req.session.user_id) {
        return res.status(401).json({ loggedIn: false });
    }

    //return current session info
    res.json({
        loggedIn: true,
        user_id: req.session.user_id,
        name: req.session.name,
    });
});


export default router;
