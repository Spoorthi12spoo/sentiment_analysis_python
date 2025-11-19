import { useState } from 'react';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/adminlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Login successful');
      } else {
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "15px", color: message.includes('success') ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AdminLogin;
