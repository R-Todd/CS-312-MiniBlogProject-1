// Set the app to use "express"
const express = require('express');
// Create an instance of express
const app = express();


// Link View Engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Set the port constant
const port = 3000;

let nextPostId = 3;

// === Set post array ===
const posts = [
    {
        id: 1, title: "Post 1", content: "This is the content of post 1.",
    },
    {
        id: 2, title: "Post 2", content: "This is the content of post 2.",
    }
];
// === END post array ===



//======== Create post route handler ========
    
   
// Create post route handler
app.post('/create-post', (req, res) => {
    // 1. Get title and conent from req.body
    const newPostTitle = req.body.title;
    const newPostContent = req.body.content;
    

    // 2. Create a new post object & variable to hold it
    const newPost = {
        id: nextPostId,
        title: newPostTitle, 
        content: newPostContent};

    // 2.5 Increment the post ID for the next post
    nextPostId++;
    

    // 3. Add the new post to the array using ".push(postObject)"
    posts.push(newPost);

    // optional: log the new post to the console
    console.log(newPost);


    // 4. Redirect to the home page
    res.redirect('/');
});

//=== end of create post route handler ===


// AI comment template
//======== Delete post route handler ========
app.get('/delete-post/:id', (req, res) => {
    // 1. Get post ID from URL params.
        // since we set the route to '/delete-post/:id', we access the id via req.params.id
        // the delete button is tied to the url 
        // so when we clock delete we navage to url and pull data from there
    const postIdStr = req.params.id;
    // 2. Convert the ID from a string to an integer.
    const deletePostId = parseInt(postIdStr);
    

    // 3. Find the index of the post to delete.
    //    Use the findIndex() method on the 'posts' array.
    //    this searches each post until it finds the one with the matching id
    const postIndex = posts.findIndex(post => post.id === deletePostId)
    
    // 4. If post was found (index is not -1), remove it.
    //    Use the splice() method to remove one item at the found index.
    if (postIndex !== -1) {
        // Post found, remove it from array
        posts.splice(postIndex, 1);
        // optional console log
        console.log(`Post with ID {${deletePostId}} deleted.`);
    } else {
        // Post not found, log a message
        console.log(`ERROR - Post with ID {${deletePostId}} not found.`);
    }

    // 5. Redirect to the home page.
    res.redirect('/');
});
//=== end of delete post route handler ===

/* === app.get ===
    Step 1) "/" - url path
    Step 2) 2 arguments
        a) req - request object
        b) res - response object
    Step 3) res.send() - sends a response to the client*/

app.get('/', (req, res) => {
    // Render the index.ejs file
        // register "index.ejs" as the template
        // pass the posts array to the template ({ posts: posts })
    res.render('index', { posts: posts });
});
// === END app.get ===



// === app.listen ===
// Make the app listen on the specified port

app.listen(port, () => {
    // log console to start server
    console.log(`Server is running at http://localhost:${port}`);
});

// === END app.listen ===