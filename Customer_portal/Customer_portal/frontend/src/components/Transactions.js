import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign } from 'lucide-react'; // Ensure lucide-react is installed

// Mock transaction data (replace this with actual data from your backend later)
const mockTransactions = [
  { id: 1, description: 'Coffee Shop', amount: -4.50, date: '2024-10-08' },
  { id: 2, description: 'Salary Deposit', amount: 2500.00, date: '2024-10-07' },
  { id: 3, description: 'Grocery Store', amount: -65.75, date: '2024-10-06' },
  { id: 4, description: 'Gas Station', amount: -40.00, date: '2024-10-05' },
  { id: 5, description: 'Online Shopping', amount: -129.99, date: '2024-10-04' },
];

const Transactions = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState(mockTransactions); // Mocking transactions for now
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    console.log('JWT Token:', token); // Log the JWT token

    if (!token) {
      console.log('No token found. Redirecting to login.');
      navigate('/login'); // Redirect to login if token is missing
      return;
    }

    // Fetch user profile
    axios.get('https://localhost:5000/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` } // Check token format
    })
    .then((response) => {
      console.log('Profile Data:', response.data); // Log profile data
      setUserProfile(response.data); // Set user profile data
    })
    .catch((error) => {
      if (error.response) {
        console.error('Error response:', error.response); // Log the full error response from server
      } else if (error.request) {
        console.error('No response received:', error.request); // Log if no response was received
      } else {
        console.error('Axios setup error:', error.message); // Log any other errors that occurred
      }
      setError('Error fetching user profile.');
      navigate('/login'); // Redirect to login if there's an error
    })
    .finally(() => {
      setLoading(false); // End loading state
    });
  }, [navigate]);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p className="text-red-600">{error}</p>; // Show error

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* User Profile Information */}
      {userProfile ? (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name}!</h1>
          <p className="text-gray-500">Here's a summary of your recent transactions</p>
        </div>
      ) : (
        <p>No profile information available.</p>
      )}

      {/* Transaction History */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="border-b pb-4 mb-4 flex items-center">
          <Clock className="mr-2" />
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        <div className="overflow-y-auto h-[400px] pr-4">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between py-4 border-b last:border-0">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Button */}
      <div className="flex justify-center">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center">
          <DollarSign className="mr-2 h-4 w-4" />
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Transactions;
