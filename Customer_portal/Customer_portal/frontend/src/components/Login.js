import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, CreditCard } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await api.post('/api/user/login', {
        username,
        accountNumber,
        password,
      });

      if (response.data.token) {
        setSubmitStatus({ type: 'success', message: 'Login successful!' });
        login(response.data.token);
        const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
        navigate(decodedToken.role === 'admin' ? '/admin' : '/transactions');
      } else {
        setSubmitStatus({ type: 'error', message: 'Login failed. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred during login.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-8 relative">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Sign in to Your Account</h2>

        {submitStatus.message && (
          <div
            className={`p-4 mb-6 rounded-md text-center font-medium ${
              submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-lg font-semibold text-white transition-transform ${
              isLoading ? 'bg-purple-300' : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
