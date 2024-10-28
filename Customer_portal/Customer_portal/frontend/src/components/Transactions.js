import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, Trash2 } from 'lucide-react';

const Transactions = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]); // Holds the payments fetched from the backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      navigate('/login'); // Redirect to login if the token is missing
      return;
    }

    // Fetch user profile
    axios.get('https://localhost:5000/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` } // Send the token in the Authorization header
    })
    .then((response) => {
      setUserProfile(response.data); // Set user profile data
    })
    .catch((error) => {
      setError('Error fetching user profile.');
      navigate('/login'); // Redirect to login if there's an error
    });

    // Fetch user payments
    axios.get('https://localhost:5000/api/user/payments', {
      headers: { Authorization: `Bearer ${token}` } // Send the token in the Authorization header
    })
    .then((response) => {
      setTransactions(response.data); // Set the fetched transactions
    })
    .catch((error) => {
      setError('Error fetching payments.');
    })
    .finally(() => {
      setLoading(false); // End the loading state
    });
  }, [navigate]);

  // Function to handle the deletion of a transaction
  const handleDelete = async (transactionId) => {
    const isConfirmed = window.confirm('Are you sure you want to cancel this transaction?');
    if (!isConfirmed) return;

    const token = localStorage.getItem('jwtToken');
    
    try {
      await axios.delete(`https://localhost:5000/api/user/payments/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transactions.filter(transaction => transaction._id !== transactionId));
    } catch (error) {
      setError('Failed to delete the transaction. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>; // Show the loading state
  if (error) return <p className="text-red-600">{error}</p>; // Show the error

  // Function to handle navigation to Payment.js
  const handlePayment = () => {
    navigate('/payment');
  };

  // Function to get the appropriate text color and sign based on transaction direction
  const getTransactionStyle = (transaction) => {
    // Ensure userProfile and account number exist
    if (!userProfile || !userProfile.accountNumber) {
      return {
        colorClass: 'text-gray-600', // Default color if userProfile is not available
        sign: '' // No sign
      };
    }

    // Check if the logged-in user is the payer or the recipient
    const isPayer = transaction.userAccountNumber === userProfile.accountNumber;
    const isRecipient = transaction.recipientAccountNumber === userProfile.accountNumber;

    if (isPayer) {
      // Outgoing payment (payer): Red and negative sign
      return {
        colorClass: 'text-red-600',
        sign: '-'
      };
    } else if (isRecipient) {
      // Incoming payment (recipient): Green and positive sign
      return {
        colorClass: 'text-green-600',
        sign: '+'
      };
    }

    // Default styling for undefined states
    return {
      colorClass: 'text-gray-600',
      sign: ''
    };
  };

  // Function to get the status color
  const getStatusTextColor = (status) => {
    if (status === 'approved') return 'text-green-600'; // Green for approved
    if (status === 'denied') return 'text-red-600'; // Red for denied
    return 'text-gray-600'; // Gray for pending
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
            {transactions.map(transaction => {
              const { colorClass, sign } = getTransactionStyle(transaction);
              return (
                <div key={transaction._id} className="flex justify-between py-4 border-b last:border-0">
                  <div>
                    <p className="font-medium"><strong>Beneficiary:</strong> {transaction.beneficiaryName}</p>
                    <p className="text-sm text-gray-500"><strong>Reference:</strong> {transaction.paymentReference}</p>
                    <p className="text-sm text-gray-500"><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
                    <p className={`text-sm ${getStatusTextColor(transaction.status)}`}>
                      <strong>Status:</strong> {transaction.status}
                    </p>
                    <div className="text-right mt-2">
                      <span className={`font-semibold ${colorClass}`}>
                        {sign}{transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {/* Bin icon for deleting transaction */}
                  {transaction.status === 'pending' && (
                    <div className="flex items-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(transaction._id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No payments have been made yet.</p>
        )}
      </div>

      {/* Payment Button */}
      <div className="flex justify-center">
        <button 
          onClick={handlePayment}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg flex items-center hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Transactions;
