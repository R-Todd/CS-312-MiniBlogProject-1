//src/components/PostList.js

//import react w/ hooks
import React from 'react';

// useState - store and update component state
// useEffect - perform side effects like fetching data


// ===== PostList Functional Component =====
function PostList({ posts, refreshPosts, currentUser }) {


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

   const handleEdit = async (blogId) => 
    {
    const updatedTitle = prompt('Enter new title:');
    const updatedBody = prompt('Enter new body:');


    if (!updatedTitle || !updatedBody) return;

    try {
        // fetch id to edit
        const response = await fetch(`/api/blogs/${blogId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ title: updatedTitle, body: updatedBody }),
        });

        if (response.ok) {
            console.log('Blog post updated');
            refreshPosts(); // Refresh the posts list
        } else {
            console.error('Failed to update blog post');
        }
    } catch (error) {
        console.error('Error updating blog post:', error);
    }


    };



    const handleDelete = async (blogId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await fetch(`/api/blogs/${blogId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Blog post deleted');
                refreshPosts(); // Refresh the posts list
            } else {
                console.error('Failed to delete blog post:', response.status);
            }
        } catch (error) {
            console.error('Error deleting blog post:', error);
        }

    };

    
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