import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Transactions from './components/Transactions';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import Administrators from './components/Administrators';
import PendingTransactions from './components/PendingTransaction';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page */}
            <Route path="/login" element={<Login />} /> {/* Login page */}
            <Route path="/register" element={<Register />} /> {/* Register page */}
            <Route path="/transactions" element={<Transactions />} /> {/* Transactions page */}
            <Route path="/payment" element={<Payment />} /> {/* Payment page */}
            <Route path="/confirmation" element={<Confirmation />} /> {/* Confirmation page */}
            <Route path="/admin" element={<Administrators />} /> {/* Administrator page */}
            <Route path="/pending-transactions" element={<PendingTransactions />} /> {/* Pending Transactions page */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
