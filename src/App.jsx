import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import PatientData from './pages/PatientData';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for authentication status on initial load
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    return storedAuthStatus === 'true';
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
      }
      setLoading(false); // Set loading to false once authentication check is complete
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking auth status
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/patients"
          element={isAuthenticated ? <PatientData /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />}
        />
        <Route
          path="/alerts"
          element={isAuthenticated ? <Alerts /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
