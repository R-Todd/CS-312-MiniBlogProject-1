// src/App.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostList from './components/PostList';
import BlogForm from './components/BlogForm';


function App() {

  // Auto Reload functionlity
  const [posts, setPosts] = useState([]);

  // fetch posts from backend
  useEffect(() => {
    fetch('/api/blogs') // same at PostList.js
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div className="App container">
      <h1 className="my-4 text-center">React + Express Blog</h1>
      <BlogForm setPosts={setPosts} />
      <PostList posts={posts} />
    </div>
  );
}

export default App;
