const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); //  this is the User model
const Payment = require('../models/Payment'); 
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware

// Helper function for standardized error responses
const createErrorResponse = (res, code, message, details) => {
  if (details) {
    console.error(`${code}: ${message} - Details:`, details); // Log full error details if available
  } else {
    console.error(`${code}: ${message}`);
  }
  return res.status(code).json({ error: message });
};

// Register
router.post('/register', async (req, res) => {
  const { name, idNumber, username, accountNumber, password, confirmPassword } = req.body;

  if (!name || !idNumber || !username || !accountNumber || !password || !confirmPassword) {
    return createErrorResponse(res, 400, 'Please fill out all the fields before registering.');
  }

  if (password !== confirmPassword) {
    return createErrorResponse(res, 400, 'Passwords do not match. Please try again.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      idNumber,
      username,
      accountNumber,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'You have successfully registered! You can now log in.' });
  } catch (error) {
    console.error('Error occurred during registration:', error);

    // Send the full error message back for debugging (temporarily)
    return res.status(500).json({ 
      error: 'Something went wrong during registration.', 
      details: error.message, // Include more details about the error
    });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated JWT Token:', token); // Log the generated token

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error); // Log any errors during login
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

// Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('User ID from Token:', req.user.id); // Log user ID from the token

    const user = await User.findById(req.user.id).select('-password'); // Fetch user without password
    if (!user) {
      console.log('User not found.');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User Profile:', user); // Log the user profile being sent back
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log any other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch user payments (rename from transactions)
router.get('/payments', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(payments); // Return an empty array if no payments exist
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/payments - Save a new payment
router.post('/payments', authenticateToken, async (req, res) => {
  const { amount, currency, beneficiaryName, paymentReference } = req.body;

  if (!amount || !currency || !beneficiaryName || !paymentReference) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newPayment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      beneficiaryName,
      paymentReference,
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment successful', payment: newPayment });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;


// Protected Route
router.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  console.log('Protected route accessed.');

  if (!token) {
    console.log('Access denied: No token provided.');
    return createErrorResponse(res, 401, 'You need to log in to access this area.');
  }

  console.log('Verifying JWT token...');
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed or expired:', err);
      return createErrorResponse(res, 403, 'Your session has expired. Please log in again.', err);
    }

    console.log(`Token valid. User authenticated: ID: ${decoded.idNumber}, User ID: ${decoded.id}`);
    res.status(200).json({ message: 'You have successfully accessed the protected route!', decoded });
  });
});

module.exports = router;
