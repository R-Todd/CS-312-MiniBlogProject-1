//src/components/BlogForm.js


import React, { useState } from 'react';

// aded setPosts for auto reload 
function BlogForm({ setPosts }) {


    // set component state for title and body & state variable for title and body
    const [title, setTitle] = useState('');

    const [body, setBody] = useState('');

    // SUBMIT button logic
    const handleSubmit = (event) => {

        event.preventDefault(); // prevent default form submission behavior

        // create new blog post
        const newPost = { title, body };

        // Step 1) send data to api/blogs endpoint
        fetch('/api/blogs', {
            method: 'POST', // POST request
            headers: {
                'Content-Type': 'application/json', // JSON Format
            },
            // now we have to convert the JS objacked to JSON so server can interpret
            body: JSON.stringify(newPost), // convert newPost to JSON string
        })

        // response from backed --> js object
        .then(res => res.json())

        // successful respone
        .then(data => {
            console.log('Blog Created:', data); // log success message
            // == auto reload ==
            setPosts(prevPosts => [data, ...prevPosts]); // add new post to top of posts list
            // clear form fields
            setTitle('');
            setBody('');
        })

        // error handling
        .catch(err => console.error('Error creating blog post:', err));

    };

    /// ===== RENDER Return (JSX) =====
    return (

        <div className="container mt-4">
            <h2>Create New Blog Post</h2>

            {/* Blog submit button */}
            <form onSubmit={handleSubmit}>

                {/* Title input */}
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title} //this sets the input vlaue to title
                        onChange={(event) => setTitle(event.target.value)} // this line actualy updates the title state on input change
                        required
                    />
                </div>

                {/* Body input */}
                <div className="mb-3">
                    <label className="form-label">Body</label>
                    <textarea
                        className="form-control"
                        rows="4" // text box = 4 lines tall
                        value={body} // binds textarea value to body state
                        onChange={(event) => setBody(event.target.value)} // updates body state on input change same as title
                        required
                        />
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary">
                    Submit Post
                </button>

            </form>
        </div>
    );
                        
                    

    }
// Import into app.js
export default BlogForm;