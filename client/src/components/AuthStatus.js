// src/components/AuthStatus.js

import React, { useState, useEffect } from 'react';

function AuthStatus() {
  const [status, setStatus] = useState({ loggedIn: false, name: '' });

  // ✅ Check session when component mounts
  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' }) // include cookies
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error('Session check failed:', err));
  }, []);

  // ✅ Log out handler
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include', // ensure cookie is sent
      });

      if (res.ok) {
        setStatus({ loggedIn: false, name: '' }); // reset state
        console.log('User logged out');
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="container mt-3">
      {status.loggedIn ? (
        <>
          <p>Welcome, {status.name}!</p>
          {/* ✅ Logout Button */}
          <button className="btn btn-danger" onClick={handleLogout}>
            Log Out
          </button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default AuthStatus;
