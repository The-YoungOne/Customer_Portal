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

    // Generate JWT Token --> including the role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Generated JWT Token:', token);

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

// Function to seed a default admin
async function seedDefaultAdmin() {
  try {
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('adminpassword', 10); // Hash the admin password
      const defaultAdmin = new User({
        name: 'Admin',
        idNumber: '0000001',
        username: 'admin',
        accountNumber: '123456789',
        password: hashedPassword,
        role: 'admin'
      });
      
      await defaultAdmin.save();
      console.log('Default admin created.');
    } else {
      console.log('Admin already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

// Get all admins
router.get('/admins', authenticateToken, async (req, res) => {
  try {
    // Only allow admin to view other admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new admin
router.post('/admins', authenticateToken, async (req, res) => {
  const { name, idNumber, username, accountNumber, password } = req.body;

  // Only allow an admin to add other admins
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  if (!name || !idNumber || !username || !accountNumber || !password) {
    return createErrorResponse(res, 400, 'All fields are required.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      idNumber,
      username,
      accountNumber,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'New admin added successfully.', admin: newAdmin });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit an existing admin
router.put('/admins/:id', authenticateToken, async (req, res) => {
  const { name, username, accountNumber } = req.body;
  const adminId = req.params.id;

  // Only allow an admin to edit other admins
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const updatedAdmin = await User.findByIdAndUpdate(adminId, {
      name,
      username,
      accountNumber,
    }, { new: true }).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    res.status(200).json({ message: 'Admin updated successfully.', admin: updatedAdmin });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an admin
router.delete('/admins/:id', authenticateToken, async (req, res) => {
  const adminId = req.params.id;

  // Only allow an admin to delete other admins
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const deletedAdmin = await User.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    res.status(200).json({ message: 'Admin deleted successfully.' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments
router.post('/payments', authenticateToken, async (req, res) => {
  const { amount, currency, beneficiaryName, paymentReference, recipientAccountNumber, userAccountNumber } = req.body;

  if (!amount || !currency || !beneficiaryName || !paymentReference || !recipientAccountNumber || !userAccountNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const recipient = await User.findOne({ accountNumber: recipientAccountNumber });
    
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient account number does not exist.' });
    }

    const newPayment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      beneficiaryName,
      paymentReference,
      recipientAccountNumber,
      userAccountNumber,
      status: 'pending',
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment successful', payment: newPayment });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Fetch user payments (sender and recipient)
router.get('/payments', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    console.log('User account number:', user.accountNumber); // Log user's account number

    // Fetch payments where the user is either the sender (payer) or recipient
    const payments = await Payment.find({
      $or: [
        { userAccountNumber: user.accountNumber }, // Outgoing payments (payer)
        { recipientAccountNumber: user.accountNumber } // Incoming payments (recipient)
      ]
    }).sort({ date: -1 }); // Sort by latest date

    // Log the number of payments found
    console.log(`Number of transactions found for account ${user.accountNumber}:`, payments.length);

    // Log each transaction for debugging
    payments.forEach(payment => {
      console.log(`Transaction ID: ${payment._id}, Amount: ${payment.amount}, Status: ${payment.status}`);
    });

    // Return the fetched payments
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error); // Log any error
    res.status(500).json({ error: 'Internal server error' });
  }
});




// DELETE user payments
router.delete('/payments/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    // Use findByIdAndDelete to remove the payment
    await Payment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Transaction successfully deleted' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete the payment' });
  }
});



// Getting all pending transactions for admin
router.get('/transactions/pending', authenticateToken, async (req, res) => {
  try {
    // Only admins should be able to fetch pending transactions
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Fetch transactions where the status is 'pending'
    const pendingTransactions = await Payment.find({ status: 'pending' }).sort({ date: -1 });
    res.status(200).json(pendingTransactions);
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Admins approving payments
router.post('/payments/:id/approve', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    // Find the original payment
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    // Mark the payment as approved
    payment.status = 'approved';
    await payment.save();

    res.status(200).json({ message: 'Payment approved.', payment });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




//admins denying payments
router.post('/payments/:id/deny', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'denied' },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    res.status(200).json({ message: 'Payment denied.', payment });
  } catch (error) {
    console.error('Error denying payment:', error);
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

module.exports = {router, seedDefaultAdmin};
