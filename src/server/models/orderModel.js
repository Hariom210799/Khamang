const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  dishes: {
    type: Array,
  },
  amount: {
    type: Number,
  },
  del_address: {
    type: String,
    // required: [true, 'An order must have an address.'],
  },
  payid: {
    type: String,
  },
  userid: {
    type: mongoose.ObjectId,
  },
  makerid: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  prepared: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // payment_method: {
  //   type: String,
  //   required: [true, 'An order must have a payment method.'],
  // },
});

// ✅ AUTO DELETE: Orders expire and are deleted after 24 hours (86400 seconds)
orderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
