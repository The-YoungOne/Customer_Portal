const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Payment schema
const paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  beneficiaryName: {
    type: String,
    required: true,
  },
  paymentReference: {
    type: String,
  },
  recipientAccountNumber: { 
    type: String,
    required: true,
  },
  userAccountNumber: {
    type: String,
    required: true,
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'denied'], 
    default: 'pending' 
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
