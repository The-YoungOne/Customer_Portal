import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the centralized Axios instance
import { useNavigate } from 'react-router-dom';
import { Clock, Trash2 } from 'lucide-react';

const Transactions = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user profile and payments
    const fetchUserData = async () => {
      try {
        const profileResponse = await api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(profileResponse.data);

        const paymentsResponse = await api.get('/api/user/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(paymentsResponse.data);
      } catch (error) {
        setError('Error fetching user data.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDelete = async (transactionId) => {
    const isConfirmed = window.confirm('Are you sure you want to cancel this transaction?');
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/user/payments/${transactionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
      });
      setTransactions(transactions.filter(transaction => transaction._id !== transactionId));
    } catch (error) {
      setError('Failed to delete the transaction. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const handlePayment = () => {
    navigate('/payment');
  };

  const getTransactionStyle = (transaction) => {
    if (!userProfile || !userProfile.accountNumber) {
      return { colorClass: 'text-gray-600', sign: '' };
    }

    const isPayer = transaction.userAccountNumber === userProfile.accountNumber;
    const isRecipient = transaction.recipientAccountNumber === userProfile.accountNumber;

    return isPayer
      ? { colorClass: 'text-red-600', sign: '-' }
      : isRecipient
      ? { colorClass: 'text-green-600', sign: '+' }
      : { colorClass: 'text-gray-600', sign: '' };
  };

  const getStatusTextColor = (status) => {
    return status === 'approved' ? 'text-green-600' : status === 'denied' ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {userProfile ? (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name}!</h1>
          <p className="text-gray-500">Here's a summary of your recent transactions</p>
        </div>
      ) : (
        <p>No profile information available.</p>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="border-b pb-4 mb-4 flex items-center">
          <Clock className="mr-2" />
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>

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
