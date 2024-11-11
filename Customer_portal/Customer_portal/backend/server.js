process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const https = require('https');  // Use HTTPS module for secure server
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const {router: userRoutes, seedDefaultAdmin} = require('./routes/user');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// MongoDB Connection with error handling
try {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      seedDefaultAdmin(); //Ensures default admin is created
    })
    .catch(err => console.error('MongoDB connection error:', err));
} catch (error) {
  console.error('Unexpected error while connecting to MongoDB:', error);
}

// Routes
app.use('/api/user', userRoutes);

// SSL configuration: Load the SSL certificate and private key from .env or default to keys folder
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || path.join(__dirname, 'keys', 'localhost+2-key.pem')),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || path.join(__dirname, 'keys', 'localhost+2.pem'))
};

// Start the HTTPS server with error handling on port 5000
try {
  const PORT = process.env.PORT || 5000;  // Set HTTPS to use port 5000
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure HTTPS server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Error starting HTTPS server:', error);
}
