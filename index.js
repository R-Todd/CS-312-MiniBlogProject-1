// Set the app to use "express"
const express = require('express');
// Create an instance of express
const app = express();

// Link View Engine
app.set('view engine', 'ejs');

// Set the port constant
const port = 3000;

// Set post array
const posts = [
    {
        title: "Post 1",
        content: "This is the content of post 1.",
    },
    {
        title: "Post 2",
        content: "This is the content of post 2.",
    },
];
/* === app.get ===
Step 1) "/" - url path
Step 2) 2 arguments
    a) req - request object
    b) res - response object
Step 3) res.send() - sends a response to the client
*/

app.get('/', (req, res) => {
    // Render the index.ejs file
        // register "index.ejs" as the template
        // pass the posts array to the template ({ posts: posts })
    res.render('index', { posts: posts });
});

// Make the app listen on the specified port

app.listen(port, () => {
    // log console to start server
    console.log(`Server is running at http://localhost:${port}`);
});