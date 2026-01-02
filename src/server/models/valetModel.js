const mongoose = require('mongoose');

const valetSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A valet must have a firstName.'],
  },
  lastName: {
    type: String,
    required: [true, 'A valet must have a lastName'],
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
    required: [true, 'A valet must have an email'],
  },
  address: {
    type: String,
    required: [true, 'A valet must have an address'],
  },
  orders: {
    type: Array,
    default: [],
  },
});
