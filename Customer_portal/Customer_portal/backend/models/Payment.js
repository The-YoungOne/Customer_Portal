const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Payment schema
const paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming a User model exists
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
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
