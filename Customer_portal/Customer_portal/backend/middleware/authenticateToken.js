const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

  console.log('Auth Header:', authHeader); // Log the full Authorization header
  console.log('Extracted Token:', token);  // Log the extracted token

  if (!token) {
    console.log('No token provided. Authorization denied.');
    return res.status(401).json({ error: 'No token provided. Authorization denied.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed or expired:', err); // Log token verification errors
      return res.status(403).json({ error: 'Token is not valid or has expired.' });
    }
    req.user = user; // Attach the decoded user to the request object
    console.log('Decoded User from Token:', user); // Log the decoded user details
    next(); // Move to the next middleware or route handler
  });
};

module.exports = authenticateToken;
