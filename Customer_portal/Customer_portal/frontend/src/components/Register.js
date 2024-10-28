import React, { useState } from 'react';
import axios from 'axios';
import https from 'https';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

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

  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
      const axiosInstance = axios.create({
        baseURL: 'https://localhost:5000',
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      const response = await axiosInstance.post('/api/user/register', formData);

      if (response.status === 201) {
        setSubmitStatus({
          type: 'success',
          message: 'Registration successful! You can now log in.'
        });

        // Optionally navigate to login page after registration
        setTimeout(() => {
          navigate('/login'); // Redirect to the login page after a delay
        }, 2000); // Wait for 2 seconds before redirecting
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Register</h2>

        {submitStatus.message && (
          <div className={`p-4 mb-4 rounded-md ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields remain unchanged */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            {errors.name && <span className="text-sm text-red-600">{errors.name}</span>}
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">ID Number</label>
            <input
              id="idNumber"
              name="idNumber"
              type="text"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Enter your ID number"
              required
            />
            {errors.idNumber && <span className="text-sm text-red-600">{errors.idNumber}</span>}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
            {errors.username && <span className="text-sm text-red-600">{errors.username}</span>}
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter your account number"
              required
            />
            {errors.accountNumber && <span className="text-sm text-red-600">{errors.accountNumber}</span>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {errors.password && <span className="text-sm text-red-600">{errors.password}</span>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <span className="text-sm text-red-600">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
