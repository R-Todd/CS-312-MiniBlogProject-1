// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostList from './components/PostList';

function App() {
  return (
    <div className="App container">
      <h1 className="my-4 text-center">React + Express Blog</h1>
      <PostList />
    </div>
  );
}

export default App;
