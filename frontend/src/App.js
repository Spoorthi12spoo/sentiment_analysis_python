// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminInput from './components/AdminInput';
import AnalysisPage from './components/AnalysisPage';

// Wrapper for protecting pages
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/admin-login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/admin-login"
          element={
            localStorage.getItem("isAdminLoggedIn") === "true" ? (
              <Navigate to="/user-input" />
            ) : (
              <AdminLogin />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/user-input"
          element={
            <ProtectedRoute>
              <AdminInput />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
