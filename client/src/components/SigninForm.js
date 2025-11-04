
import React, { useState } from 'react'; // React hook for local component state


function SigninForm() {
    // component state for user_id, password, and message
    const [user_id, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // SUBMIT button logic
    const handleSubmit = async (event) => {
        event.preventDefault(); // prevent default form submission behavior

        // send sign in data to backend
        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // include cookies for session
                body: JSON.stringify({ user_id, password }), // convert json body to string
            });

            const data = await res.json();

            setMessage(data.message); // then update ui with backend msg

            // if log is is successful
            if (res.ok) {
                // clear form fields
                setUserId('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error during signin:', error);
            setMessage('Error during signin'); // show error message
        }
    };

    // ===== RENDER RETURN (JSX) =====
    return (
        <div className="container mt-4">
            <h3>Sign In</h3>

            {/* Signin form */}
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

                {/* Password input */}
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

                {/* Submit button */}
                <button type="submit" className="btn btn-primary">Sign In</button>
            </form>

            {/* Message display (success or fail) */}
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

// export SigninForm to be imported to app.js
export default SigninForm;
