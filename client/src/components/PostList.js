//src/components/PostList.js

//import react w/ hooks
import React from 'react';

// useState - store and update component state
// useEffect - perform side effects like fetching data


// ===== PostList Functional Component =====
function PostList({ posts }) {

    /* // set inital component state to empty array
        // state variable (posts) holds list of blog posts
        // "setter" function (setPosts) updates posts state
    const [posts, setPosts] = useState([]);

    // useEffect hook 
    useEffect(() => {


        // fetches blogs from api
            // 1) makes GET request to /api/posts endpoint
            // 2) forwards the request to http://localhost:8000/api/blogs
        fetch('/api/blogs')

            // converts server response (JSON text) to JS object/array
            .then(res => res.json()) // parse JSON response

            // update the post state w/ collected data
            .then(data => setPosts(data)) // set posts state

            // error handling
            .catch(err => console.error('Error fetching posts:', err));

      // ONLY RUN useEffect ONCE
        // [dependency] since this [] is empty only run when a component appears on screen
    }, []); // empty dependency array = run once on mount
    */
   // -- Moved to app.js for auto reload  -- //
    
    // ===== RENDER Return (JSX) =====
    return (
        <div className="container mt-4">
            <h2>Blog Posts</h2>

            {/* Check if posts array is empty */}
            {posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                // loop through posts array and render each post
                posts.map((post) => (

                    <div key={post.blog_id} className="card mb-3">

                        <div className="card-body">
                            {/* Post Title */}
                            <h5 className="card-title">{post.title}</h5>

                            {/* Post Body */}
                            <p className="card-text">{post.body}</p>

                            {/* creator name */}
                            <p className = "text-muted">By: {post.creator_name}</p>

                            {/* edit and delete buttons */}
                            {currentUser && currentUser.user_id === post.creator_user_id && (
                                <div className="mt-2">
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEdit(post.blog_id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(post.blog_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                ))
            )}
        </div>
    );
// PostList end bracket
}


// export PostList to be imported to app.js
export default PostList;