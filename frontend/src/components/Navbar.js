// Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    localStorage.getItem("isAdminLoggedIn") === "true"
  );
  const location = useLocation();

  // Listen for route changes (re-check login status)
  useEffect(() => {
    setIsAdminLoggedIn(localStorage.getItem("isAdminLoggedIn") === "true");
  }, [location]);

  return (
    <nav style={{ padding: "10px", backgroundColor: "#4a90e2", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Link to="/" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Home</Link>
        {!isAdminLoggedIn && (
          <Link to="/admin-login" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Admin Login</Link>
        )}
        {isAdminLoggedIn && (
          <>
            <Link to="/admin-input" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Data Upload</Link>
            <Link to="/analysis" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Analysis</Link>
            <button
              onClick={() => {
                localStorage.removeItem("isAdminLoggedIn");
                setIsAdminLoggedIn(false);
                window.location.href = "/admin-login";
              }}
              style={{
                margin: "0 10px",
                background: "#e94e77",
                color: "white",
                border: "none",
                padding: "8px 16px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
