// src/components/SignupForm.js
import React, { useState } from 'react';

// ran on sigup button click
function SignupForm() {

    // each input field has its own state
    const [user_id, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState(''); // success or error message

    //form submission 
    const handleSubmit = async (event) => {
        event.preventDefault(); // prevent default form submission

        // send signup data to backend
        try {

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // include cookies for session
                body: JSON.stringify({ user_id, password, name }), // convert json body to string
            });

            const data = await res.json();

            setMessage(data.message); // then update ui with backend msg

            // clear form fields on success
            if (res.ok) {
                setUserId('');
                setPassword('');
                setName('');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setMessage('Error during signup'); // show error message
        }
    };
    // ===== RENDER RETURN (JSX) =====
    return (
        <div className="container mt-4">
            <h3>Sign Up</h3>

            {/* Signup form */}
            <form onSubmit={handleSubmit}>
                {/* User ID input */}
                <div className="mb-3">
                    <label>User ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={user_id} // input value set to user_id state
                        onChange={(event) => setUserId(event.target.value)} // update user_id state while typing
                        required
                    />
                </div>

                {/* Password input - same as username */}
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password} // input value set to password state
                        onChange={(event) => setPassword(event.target.value)} // update password state while typing
                        required
                    />
                </div>

                {/* Name input - same as username */}
                <div className="mb-3">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name} // input value set to name state
                        onChange={(event) => setName(event.target.value)} // update name state while typing
                        required
                    />
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary">
                    Sign Up </button>
            </form>

            {/* Display success or error message */}
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

// export SignupForm to be imported 
export default SignupForm;

            
                        




