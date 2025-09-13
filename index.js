// Set the app to use "express"
const express = require('express');
// Create an instance of express
const app = express();

// Link View Engine
app.set('view engine', 'ejs');

// Set the port constant
const port = 3000;

/* === app.get ===
"/" - url path
2 arguments
    a) req - request object
    b) res - response object
res.send() - sends a response to the client
*/

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Make the app listen on the specified port

app.listen(port, () => {
    // log console to start server
    console.log(`Server is running at http://localhost:${port}`);
});