// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import PostList from './components/PostList';
import BlogForm from './components/BlogForm';
import SignupForm from './components/SignupForm';
import SigninForm from './components/SigninForm';
import AuthStatus from './components/AuthStatus';



function App() {

  // Auto Reload functionlity
  const [posts, setPosts] = useState([]);
  const [authStatus, setAuthStatus] = useState({ loggedIn: false, name: '', user_id: '' });
  const [reload, setReload] = useState(false); // used to re-run useEffect

// ===== useEffect: Fetch Blog Posts =====

useEffect(() => {

  // Attempt to fetch all blog posts from backend API
  fetch('/api/blogs', { credentials: 'include' })
    .then(async (res) => {
      // If response is not OK, log the status for debugging
      if (!res.ok) {
        console.error('Fetch /api/blogs failed:', res.status);
        const errorText = await res.text();
        console.error('Response text:', errorText);
        throw new Error('Failed to fetch blogs');
      }

      // Parse response as JSON safely
      const data = await res.json();

      // Log the received blog data to browser console
      console.log("Fetched blogs:", data);

      // Update local component state with blog list
      setPosts(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      // Catch and print any network or JSON parsing errors
      console.error('Error fetching posts:', err);
    });
}, [reload]); // Runs when reload state changes

  // check log in status
  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then(res => res.json())
      .then(
        data => setAuthStatus(data))
      .catch(err => console.error('Error checking auth status:', err));
  }, []);

  // function to trigger reload of posts

  const refreshPosts = () => { setReload(prev => !prev); };

  return (
    <Router>
      <div className="container mt-4">
        {/* ===== Navbar ===== */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light rounded px-3 mb-4">
          <Link className="navbar-brand fw-bold" to="/">MiniBlog</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/signin">Sign In</Link>
            <Link className="nav-link" to="/signup">Sign Up</Link>
          </div>
        </nav>

        {/* ===== Auth status ===== */}
        <AuthStatus />

        {/* ===== Routes ===== */}
        <Routes>
            {/* === Homepage (Blog Feed + Create Form) === */}
            <Route
              path="/" // root path
              element={
                <>
                  {authStatus.loggedIn && (
                    <BlogForm 
                    setPosts={setPosts} 
                    refreshPosts={refreshPosts}
                    authStatus={authStatus} />
                  )}
                  <PostList
                  posts={posts}
                  refreshPosts={refreshPosts}
                  currentUser={authStatus}
                />
              </>
            }
          />

          {/* === Signup & Signin Pages === */}
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/signin" element={<SigninForm />} />

        </Routes>
      </div>
    </Router>
  );
}

// ===== Export App =====
export default App;