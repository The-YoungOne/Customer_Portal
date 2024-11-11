import React, { useState } from 'react';
import { Lock, User, CreditCard } from 'lucide-react';
import api from '../api'; 
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    username: '',
    accountNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID Number is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await api.post('/api/user/register', formData);

      if (response.status === 201) {
        setSubmitStatus({
          type: 'success',
          message: 'Registration successful! You can now log in.'
        });

        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.details || 'Error registering user. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        {submitStatus.message && (
          <div className={`p-4 mb-4 rounded-md ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-md border shadow-sm focus:border-indigo-400 focus:ring-indigo-300 focus:ring-opacity-50"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            {errors.name && <span className="text-sm text-red-600">{errors.name}</span>}
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="idNumber"
              name="idNumber"
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-md border shadow-sm focus:border-indigo-400 focus:ring-indigo-300 focus:ring-opacity-50"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="ID Number"
              required
            />
            {errors.idNumber && <span className="text-sm text-red-600">{errors.idNumber}</span>}
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="username"
              name="username"
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-md border shadow-sm focus:border-indigo-400 focus:ring-indigo-300 focus:ring-opacity-50"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            {errors.username && <span className="text-sm text-red-600">{errors.username}</span>}
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-md border shadow-sm focus:border-indigo-400 focus:ring-indigo-300 focus:ring-opacity-50"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Account Number"
              required
            />
            {errors.accountNumber && <span className="text-sm text-red-600">{errors.accountNumber}</span>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              className="w-full pl-10 pr-4 py-2 rounded-md border shadow-sm focus:border-indigo-400 focus:ring-indigo-300 focus:ring-opacity-50"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {errors.password && <span className="text-sm text-red-600">{errors.password}</span>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full pl-10 pr-4 py-2 rounded-md border shadow-sm focus:border-indigo-400 focus:ring-indigo-300 focus:ring-opacity-50"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            {errors.confirmPassword && <span className="text-sm text-red-600">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md text-lg font-semibold text-white transition-transform ${
              isLoading ? 'bg-indigo-300' : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
