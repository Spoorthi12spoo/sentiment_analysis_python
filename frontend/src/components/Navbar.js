// Navbar.js
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{padding: "10px", backgroundColor: "#4a90e2", color: "white"}}>
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
      }}>
        <Link to="/" style={{margin: "0 10px", color: "white", textDecoration: "none"}}>Home</Link>
        <Link to="/admin-login" style={{margin: "0 10px", color: "white", textDecoration: "none"}}>Admin Login</Link>
        <Link to="/user-input" style={{margin: "0 10px", color: "white", textDecoration: "none"}}>User Input</Link>
        <Link to="/analysis" style={{margin: "0 10px", color: "white", textDecoration: "none"}}>Analysis</Link>
      </div>
    </nav>
  );
}

export default Navbar;
