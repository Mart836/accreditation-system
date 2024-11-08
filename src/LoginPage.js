import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // Import the CSS styles
import logo from './brand.png';
import { auth } from './firebase'; // Import the auth object
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Import the necessary functions

function LoginPage() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // For storing any error messages
  const [resetMessage, setResetMessage] = useState(null); // Message for password reset

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      // Use Firebase authentication to sign in
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the home page after successful login
      navigate('/home');
    } catch (err) {
      // Handle and display error if authentication fails
      setError(err.message);
      console.error('Authentication error:', err);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent! Check your inbox.');
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to send reset email. Make sure you entered a valid email address.');
      console.error('Password reset error:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1>Login Page</h1>
      </div>
      <div className="logo2">
        <img src={logo} alt="Logo" className="logo2" />
      </div>
      <div className="form-container">
        <form className="login-form" onSubmit={handleSubmit}> {/* Handle form submission */}
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            required 
            autoComplete="off"
          />

          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" 
            required 
            autoComplete="off"
          />

          <button type="submit" className="login-button">Login</button>

          {/* Display error message if authentication fails */}
          {error && <p className="text-danger">{error}</p>}
          {resetMessage && <p className="text-success">{resetMessage}</p>}

          <div className="d-flex justify-content-between align-items-center mt-2">
            <button type="button" className="btn btn-link p-0" onClick={handlePasswordReset}>
              Forgot Password?
            </button>
          </div>

          <div className="create-account">
            <p>Don't have an account? <Link to="/create-account">Create one</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
