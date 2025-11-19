import { useState } from 'react';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // "Login successful"
      } else {
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          style={{ width: "100%", padding: "8px", margin: "10px 0" }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{ width: "100%", padding: "8px", margin: "10px 0" }} 
        />
        <button 
          type="submit" 
          style={{ padding: "10px 20px", backgroundColor: "#4a90e2", color: "white", border: "none" }}
        >
          Login
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminLogin;
