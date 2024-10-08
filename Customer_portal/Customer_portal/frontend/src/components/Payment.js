import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // To handle the API call

const Payment = () => {
  const [amount, setAmount] = useState(''); // Initial amount input (in ZAR)
  const [currency, setCurrency] = useState('ZAR'); // Default currency is ZAR
  const [exchangeRates, setExchangeRates] = useState({});
  const [beneficiaryName, setBeneficiaryName] = useState(''); // Beneficiary name input
  const [paymentReference, setPaymentReference] = useState(''); // Payment reference input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(''); // Field validation error message

  const navigate = useNavigate(); // To redirect after successful payment

  // Fetch exchange rates when the component mounts
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_API_KEY}/latest/ZAR`
        );
        const data = await response.json();
        if (data.result === 'success') {
          setExchangeRates(data.conversion_rates); // Set conversion rates
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

  // Handle the currency change and update the converted amount
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    updateConvertedAmount(amount, newCurrency); // Update conversion when currency changes
  };

  // Handle the amount input and update the state (converts the amount when currency changes)
  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    updateConvertedAmount(newAmount, currency); // Convert amount to selected currency
  };

  // Update the amount input with the converted value
  const updateConvertedAmount = (amount, selectedCurrency) => {
    const rate = exchangeRates[selectedCurrency] || 1; // Default rate of 1 if no exchange rate is found
    const converted = (amount * rate).toFixed(2); // Convert amount to selected currency
    setAmount(converted); // Update the input field with the converted amount
  };

  // Validate form inputs
  const validateForm = () => {
    if (!amount || !currency || !beneficiaryName || !paymentReference) {
      setFormError('All fields are required.');
      return false;
    }
    return true;
  };

  // Handle form submission (sending the payment to the backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset form error before validation
    setFormError('');

    // Validate form inputs
    if (!validateForm()) return;

    // Get the JWT token from localStorage (assuming the user is logged in)
    const token = localStorage.getItem('jwtToken');

    try {
      // Send the payment data to the backend
      const response = await axios.post(
        'https://localhost:5000/api/user/payments', // Corrected API endpoint
        {
          amount,
          currency,
          beneficiaryName,
          paymentReference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in headers
          },
        }
      );
      

      if (response.status === 200 || response.status === 201) {
        // If the payment is successful, navigate to the confirmation page
        navigate('/confirmation'); // Redirect to Confirmation.js
      } else {
        setFormError('Failed to process the payment. Please try again.');
      }
    } catch (error) {
      console.error('Error processing the payment:', error);
      setFormError('An error occurred while processing your payment. Please try again.');
    }
  };

  if (loading) return <p>Loading exchange rates...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h1>

        {formError && <p className="text-red-600 mb-4">{formError}</p>} {/* Display form errors */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
            <div className="input-group flex-grow">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <input 
                  type="number" 
                  id="amount" 
                  name="amount"
                  value={amount}
                  onChange={handleAmountChange} // Update amount and convert
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required 
                  step="0.01" 
                  min="0.01"
                />
              </div>
            </div>

            <div className="input-group w-1/3">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                id="currency" 
                name="currency"
                value={currency}
                onChange={handleCurrencyChange} // Update currency on selection change
                className="custom-select mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {Object.keys(exchangeRates).map((currencyOption) => (
                  <option key={currencyOption} value={currencyOption}>
                    {currencyOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Beneficiary Name */}
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

          {/* Payment Reference */}
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
            Proceed wtih Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
