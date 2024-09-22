import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import CreateAccountPage from './CreateAccountPage';
import HomePage from './HomePage'; // Placeholder for the HomePage component
import AccreditationForm from './AccreditationForm';
import ReAccreditationForm from './ReAccreditationForm';
import Expansion from './Expansion';
import TrackApplication from './applicationtrack'; 
import './App.css';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <img src="/brand Logo.png" alt="brand Logo" className="logo" />
      <h1 className="slogan">Quality Assured Qualification</h1>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true); // Controls splash screen visibility
  const [isLoggedIn] = useState(false); // Simulating login status

  useEffect(() => {
    // Show the splash screen for 3 seconds
    const timer = setTimeout(() => {
      setLoading(false); // Hide splash screen after 3 seconds
    }, 1000); // Splash screen delay is set to 3 seconds

    return () => clearTimeout(timer); // Clean up the timer when component unmounts
  }, []);

  return (
    <Router>
      {loading ? (
        <SplashScreen />
      ) : (
        <Routes>
          {/* Redirect to login if not logged in */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/track-application" element={<TrackApplication />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/accreditation-form" element={<AccreditationForm />} /> 
          <Route path="/reaccreditation-form" element={<ReAccreditationForm />} />
          <Route path="/Expansionaccreditation-form" element={<Expansion />} />
          {/* Catch all other routes and redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
