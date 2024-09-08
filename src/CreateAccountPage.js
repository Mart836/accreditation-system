import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './brand.png';
import { auth } from './firebase'; // Import the auth object
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import the createUserWithEmailAndPassword function

function CreateAccountPage() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null); // For handling errors

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      // Use Firebase to create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      // After successful account creation, redirect to the home page
      navigate('/home');
    } catch (err) {
      // Handle and display error if account creation fails
      setError(err.message);
      console.error('Account creation error:', err);
    }
  };

  return (
    <div className="create-account-page">
      <div className="login-header">
        <h1>Create Account</h1>
      </div>
      <div className="logo2">
        <img src={logo} alt="Logo" className="logo2" />
      </div>
      <div className="form-container">
        <form className="create-account-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Institution name/Person name:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="Enter name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />

          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Choose a password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <label htmlFor="verify-password">Verify Password:</label>
          <input 
            type="password" 
            id="verify-password" 
            name="verify-password" 
            placeholder="Verify password" 
            required 
          />

          <button type="submit" className="create-account-button">Create Account</button>

          {/* Display error message if account creation fails */}
          {error && <p className="error-message">{error}</p>}

          <div className="create-account">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountPage;
