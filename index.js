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
        id: 1, title: "Post 1", author: "Donald Duck", content: "This is the content of post 1.",
    },
    {
        id: 2, title: "Post 2", author: "John Doe", content: "This is the content of post 2.",
    }
];
// === END post array ===



//======== post route handler ========
// Create post route handler
app.post('/create-post', (req, res) => {
    // 1. Get title and conent from req.body
    const newPostTitle = req.body.title;
    const newPostContent = req.body.content;
    const newPostAuthor = req.body.author;
    

    // 2. Create a new post object & variable to hold it
    const newPost = {
        id: nextPostId,
        title: newPostTitle, 
        author: newPostAuthor,
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




//======== Delete post route handler ========
// AI comment template
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
//======== End delete post route handler ========

//======== (START) EDIT post route handler ========
// Renders the edit page by the id. Allows user to edit a specific post.
// Does not handle the "POST" request to actually update the post.
app.get('/edit-post/:id', (req, res) => {
    // 1. Get post ID from URL params and convert to an integer.
    const editPostId = parseInt(req.params.id);

    // 2. Finds post object with matching ID
        //    Use the find() method on the 'posts' array.
        //    Using find instead of findIndex because we want the entire post object
    const postToEdit = posts.find(post => post.id === editPostId)

    // 4. In the edit function, we are look for the entire post conect (id,title,author,contenct)
    if (postToEdit) {
        // Post found, (from url)
        //render file send the (post) object to the edit.ejs file
        res.render('edit', { post: postToEdit });
        // optional console log
        console.log(`Post with ID {${editPostId}} found. Reendering edit page.`);
    } else {
        // Post not found, log a message
        console.log(`ERROR - Post with ID {${editPostId}} not found.`);
        res.redirect('/');
    }
});
//======== (END) EDIT post route handler ========

//======== (START) UPDATE post route handler ========
// Handles the "POST" request to actually update the post.
app.post('/update-post/:id', (req, res) => {
    // 1. Get post ID from URL params and convert to an integer.
    const updatePostId = parseInt(req.params.id);
    // 2. Get updated title and content from req.body
    const updatedTitle = req.body.title;
    const updatedContent = req.body.content;
    const updatedAuthor = req.body.author;

    

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