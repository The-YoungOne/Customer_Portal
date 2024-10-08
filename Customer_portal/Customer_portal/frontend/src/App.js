import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home'; // Import the Home component
import Register from './components/Register'; // Import the Register component
import Login from './components/Login'; // Import the Login component
import Transactions from './components/Transactions'; // Import the Transactions component
import axios from 'axios';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16"> {/* Padding to prevent overlap with fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/login" element={<Login />} /> {/* Login page */}
          <Route path="/register" element={<Register />} /> {/* Register page */}
          <Route path="/transactions" element={<Transactions />} /> {/* Transactions page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
