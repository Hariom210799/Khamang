const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'A user must have a role'],
    enum: {
      values: ['maker', 'user'],
      message: 'Role is either: "maker" or "user"',
    },
  },
  firstName: {
    type: String,
    required: [true, 'A user must have a firstName.'],
  },
  lastName: {
    type: String,
    // required: [true, 'A user must have a lastName'],
  },
  aboutme: {
    type: String,
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    // validate: validator.isEmail(this.email),
    validate: {
      validator: function (el) {
        return validator.isEmail(el);
      },
      message: 'Not a valid Email Id',
    },
  },
  password: {
    type: String,
    required: [true, 'A user must have password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  address: {
    type: String,
    // required: [true, 'A user must have an address'],
  },
  orders: {
    type: [mongoose.ObjectId],
    default: [],
  },
  verified: {
    type: Boolean,
    default: true,
  },
  shopOpen: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre('save', async function () {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return;
  console.log('[PRE-SAVE] Plain password:', this.password);
  const hash = await bcrypt.hash(this.password, 12);
  console.log('[PRE-SAVE] Hashed password:', hash);
  this.password = hash;
  this.confirmPassword = undefined;
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword,
) {
  console.log('[COMPARE] Candidate:', candidatePassword);
  console.log('[COMPARE] User hash:', userPassword);
  return bcrypt.compare(candidatePassword, userPassword).then(result => {
    console.log('[COMPARE] Result:', result);
    return result;
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
