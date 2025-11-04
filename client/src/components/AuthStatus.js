// src/components/AuthStatus.js

// ===== Import React + Hooks =====
import React from 'react';

/* ===============================================
   AuthStatus Component
   -----------------------------------------------
   Purpose:
     - Displays the user’s current login status
     - Allows a logged-in user to log out
     - Syncs with App.js via props (authStatus + setAuthStatus)
   =============================================== */
function AuthStatus({ authStatus, setAuthStatus }) {

  // ===== handleLogout =====
  // Called when user clicks "Log out" button
  // Sends POST to backend /api/auth/logout and clears auth state
  const handleLogout = async () => {
    try {
      // Send logout request to backend
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // include session cookie
      });

      // If successful, clear auth state in parent component
      if (res.ok) {
        console.log('User logged out successfully');
        setAuthStatus({ loggedIn: false, name: '', user_id: '' });
      } else {
        console.error('Logout failed:', res.status);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // ===== RENDER (JSX) =====
  return (
    <div className="auth-status mb-4">
      {/* If user is logged in, show user info + logout */}
      {authStatus && authStatus.loggedIn ? (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          {/* Logged-in message */}
          <span>
            Signed in as <strong>{authStatus.name}</strong>
          </span>

          {/* Logout Button */}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      ) : (
        // Else show not signed in message
        <div className="alert alert-secondary text-center">
          Not signed in.
        </div>
      )}
    </div>
  );
}

// ===== Export AuthStatus =====
export default AuthStatus;
