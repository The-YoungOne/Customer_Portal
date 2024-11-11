import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import the custom axios instance

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZAR');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [userAccountNumber, setUserAccountNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAccountNumber = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserAccountNumber(response.data.accountNumber);
      } catch (error) {
        setError('Error fetching user account number.');
        console.error('Error fetching user account number:', error);
      }
    };

    fetchUserAccountNumber();
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_API_KEY}/latest/ZAR`
        );
        const data = await response.json();
        if (data.result === 'success') {
          setExchangeRates(data.conversion_rates);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch exchange rates');
        }
      } catch (error) {
        setError('Failed to fetch exchange rates.');
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    updateConvertedAmount(amount, newCurrency);
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    updateConvertedAmount(newAmount, currency);
  };

  const updateConvertedAmount = (amount, selectedCurrency) => {
    const rate = exchangeRates[selectedCurrency] || 1;
    const converted = (amount * rate).toFixed(2);
    setConvertedAmount(converted);
  };

  const validateForm = () => {
    if (!amount || !currency || !beneficiaryName || !paymentReference || !recipientAccountNumber) {
      setFormError('All fields are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    const token = localStorage.getItem('jwtToken');
    try {
      const response = await api.post(
        '/api/user/payments',
        {
          amount,
          currency,
          beneficiaryName,
          paymentReference,
          recipientAccountNumber,
          userAccountNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigate('/confirmation');
      } else {
        setFormError('Failed to process the payment. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data.error === 'Recipient account number does not exist.') {
        setFormError('Recipient account number does not exist.');
      } else {
        setFormError('An error occurred while processing your payment. Please try again.');
      }
      console.error('Error processing payment:', error.response?.data || error.message);
    }
  };

  if (loading) return <p>Loading exchange rates...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h1>

        {formError && <p className="text-red-600 mb-4">{formError}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
            <div className="input-group flex-grow">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input 
                type="number" 
                id="amount" 
                name="amount"
                value={amount}
                onChange={handleAmountChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required 
                step="0.01" 
                min="0.01"
              />
            </div>

            <div className="input-group w-1/3">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                id="currency" 
                name="currency"
                value={currency}
                onChange={handleCurrencyChange} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {Object.keys(exchangeRates).map((currencyOption) => (
                  <option key={currencyOption} value={currencyOption}>
                    {currencyOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="beneficiaryName" className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Name</label>
            <input 
              type="text" 
              id="beneficiaryName" 
              name="beneficiaryName"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="recipientAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">Recipient Account Number</label>
            <input 
              type="text" 
              id="recipientAccountNumber" 
              name="recipientAccountNumber"
              value={recipientAccountNumber}
              onChange={(e) => setRecipientAccountNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="userAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">Your Account Number</label>
            <input 
              type="text" 
              id="userAccountNumber" 
              name="userAccountNumber"
              value={userAccountNumber} 
              readOnly 
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="input-group">
            <label htmlFor="paymentReference" className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
            <textarea 
              id="paymentReference" 
              name="paymentReference"
              rows="2"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Proceed with Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
