import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign } from 'lucide-react'; // Ensure lucide-react is installed

const Transactions = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]); // Will hold the payments fetched from backend
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
      headers: { Authorization: `Bearer ${token}` } // Send the token in Authorization header
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
    });

    // Fetch user payments
    axios.get('https://localhost:5000/api/user/payments', {
      headers: { Authorization: `Bearer ${token}` } // Send the token in Authorization header
    })
    .then((response) => {
      console.log('Payments Data:', response.data); // Log the payments data
      setTransactions(response.data); // Set the fetched transactions
    })
    .catch((error) => {
      console.error('Error fetching payments:', error);
      setError('Error fetching payments.');
    })
    .finally(() => {
      setLoading(false); // End loading state
    });
  }, [navigate]);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p className="text-red-600">{error}</p>; // Show error

  // Function to handle navigation to Payment.js
  const handlePayment = () => {
    navigate('/payment');
  };

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

        {/* Display transactions or a message if no payments */}
        {transactions.length > 0 ? (
          <div className="overflow-y-auto h-[400px] pr-4">
            {transactions.map(transaction => (
              <div key={transaction._id} className="flex flex-col py-4 border-b last:border-0">
                <div>
                  <p className="font-medium"><strong>Beneficiary:</strong> {transaction.beneficiaryName}</p>
                  <p className="text-sm text-gray-500"><strong>Reference:</strong> {transaction.paymentReference}</p>
                  <p className="text-sm text-gray-500"><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500"><strong>Status:</strong> Pending</p> {/* New Status field */}
                </div>
                <div className="text-right mt-2">
                  <span className="font-semibold text-red-600">
                    -{transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No payments have been made yet.</p>
        )}
      </div>

      {/* Payment Button */}
      <div className="flex justify-center">
        <button 
          onClick={handlePayment} // Navigate to Payment.js on click
          className="bg-purple-600 text-white px-8 py-3 rounded-lg flex items-center hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Transactions;
