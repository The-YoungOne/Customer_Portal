import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation

const Login = () => {
  const [username, setUsername] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const navigate = useNavigate(); // Use navigate to redirect to Transactions or Home page

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await axios.post('https://localhost:5000/api/user/login', { 
        username, 
        accountNumber, 
        password 
      });
      
      // Check if the response contains a token
      if (response.data.token) {
        setSubmitStatus({ type: 'success', message: 'Login successful!' });

        // Store the token in localStorage to use for authentication
        localStorage.setItem('jwtToken', response.data.token);

        // Redirect to Transactions page after successful login
        navigate('/transactions'); // Change to '/transactions' if that's your desired flow
      } else {
        setSubmitStatus({ type: 'error', message: 'Login failed. Please try again.' });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setSubmitStatus({ type: 'error', message: 'Invalid login credentials. Please try again.' });
        } else if (error.response.status === 500) {
          setSubmitStatus({ type: 'error', message: 'Internal server error. Please try again later.' });
        } else {
          setSubmitStatus({ type: 'error', message: 'An unknown error occurred. Please try again.' });
        }
      } else {
        setSubmitStatus({ type: 'error', message: 'Unable to connect to the server. Please check your internet connection.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Login</h2>

        {submitStatus.message && (
          <div className={`p-4 mb-4 rounded-md ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    
    </div>
    

  );
};

export default Login;
