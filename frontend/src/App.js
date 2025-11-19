import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import UserInput from './components/UserInput';
import AnalysisPage from './components/AnalysisPage';
// ... other imports

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/User-input" element={<UserInput/>} />
         <Route path="/Analysis" element={<AnalysisPage/>} />

        {/* ... other routes */}
      </Routes>
    </Router>
  );
}

export default App;
