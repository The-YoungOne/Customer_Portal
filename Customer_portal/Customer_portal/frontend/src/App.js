import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router, Route, Routes
import Navbar from './components/Navbar'; // Ensure Navbar is correctly imported
import Home from './components/Home'; // Ensure Home is correctly imported
import Register from './components/Register'; // Ensure Register is correctly imported
import Login from './components/Login'; // Ensure Login is correctly imported
import Transactions from './components/Transactions'; // Ensure Transactions is correctly imported
import Payment from './components/Payment'; // Ensure Payment is correctly imported
import Confirmation from './components/Confirmation'; // Ensure Confirmation is correctly imported

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
          <Route path="/payment" element={<Payment />} /> {/* Payment page */}
          <Route path="/confirmation" element={<Confirmation />} /> {/* Confirmation page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
