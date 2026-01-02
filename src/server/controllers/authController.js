const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signToken = (obj) => {
  let {id, add} = obj;
  return jwt.sign({id, add}, process.env.JWT_SECRET);
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log('Signup Controller');
  console.log(req.body);
  

  try {
    const {firstName, email, password} = req.body;
  console.log('USer created')
  const v_token = jwt.sign({email, password}, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const link = `http://10.0.0.7:3000/api/v1/verifies/${v_token}`;
  console.log('Signing Up', link);

  const msg = {
    to: `${email}`, // Change to your recipient
    from: 's17_ukalkar_jayesh@mgmcen.ac.in', // Change to your verified sender
    subject: 'Email Verification from Khamang!',
    html: `<h2>Hello ${firstName},</h2><br> Please Click on the link to verify your email.<br><a href=${link}>Click here to verify</a>`,
    // html: `<h2>Hello ${} Please Click on the link to verify your email.</h2><br><a href=${link}>Click here to verify</a>`,
  };
  console.log('Sending Email to ', email);
  sgMail
    .send(msg)
    .then(() => {
      console.log('EMAIL SENT');
    })
    .catch((error) => {
      console.log('SENDER GRID ERROR',error.message,JSON.stringify(error.response.body.errors));
      console.error(error);
    });
    const newUser = await User.create(req.body);
    console.log('new user user', newUser);
    const token = signToken(newUser._id);
    console.log('token created', token.length);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
        message:
          'Verification Mail Sent! Kindly verify your email before Logging In.',
      },
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create user',
      error: err.message,
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  console.log('Login Controller');
  console.log('Login payload:', req.body);
  const {email, password} = req.body;

  // 1) Check if Email-Pass Exists
  if (!email || !password) {
    console.log('Missing email or password');
    return next(new AppError('Please provide email and password', 400));
  }
   console.log('jaydya');
  // 2) Check if the user exists
  const user = await User.findOne({email}).select('+password');
   console.log('hirvya',user);
  if (!user) {
    console.log('User not found');
    return next(new AppError('Incorrect Email or Password', 401));
  }
   console.log('dhotri');
  // 3) Check if password is correct
  let isPasswordCorrect;
  // If the stored password looks like a bcrypt hash, use bcrypt compare
  if (user.password && user.password.startsWith('$2b$')) {
    isPasswordCorrect = await user.correctPassword(password, user.password);
  } else {
    // Plain text fallback (INSECURE, for local testing only)
    isPasswordCorrect = user.password === password;
  }
  console.log('bhatury', isPasswordCorrect);
  if (!isPasswordCorrect) {
    console.log('matury');
    return next(new AppError('Incorrect Email or Password', 401));
  }
    console.log('bisleri');

  // 4) Check if user is verified (commented out for testing)
  // if (!user.verified) {
  //   console.log('User not verified');
  //   return next(new AppError('Email has not been verified', 401));
  // }
  console.log('Missing email or password step5');

  // 5) Everything ok, send jwt to client
  const token = signToken({id: user._id, add: user.address});
  console.log('Login successful, sending token');
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.verifyAccount = catchAsync(async (req, res, next) => {
  const token = req.params.id;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async function (
      err,
      decodedToken,
    ) {
      if (err) {
        return res.status(400).json({
          status: 'failed',
          error: 'Incorrect or expired link',
        });
      }

      const {email, password} = decodedToken;
      const verification = await User.findOneAndUpdate(
        {email},
        {verified: true},
        {
          new: true, // return modified doc, not original
          runValidators: true, // validates the update operation
        },
      );

      res.status(200).send('<p>Account has been successfully verified!!</p>');
    });
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'Something went wrong!',
    });
  }
});

// exports.protect = catchAsync(async (req, res, next) => {
//   /// 1) Getting token and check of it's there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return next(
//       new AppError('You are not logged in! Please log in to get access.', 401),
//     );
//   }

//   // 2) Verification token
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//   // 3) Check if user still exists
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     return next(
//       new AppError(
//         'The user belonging to this token does no longer exist.',
//         401,
//       ),
//     );
//   }

//   // 4) Check if user changed password after the token was issued
//   if (currentUser.changedPasswordAfter(decoded.iat)) {
//     return next(
//       new AppError('User recently changed password! Please log in again.', 401),
//     );
//   }

//   // GRANT ACCESS TO PROTECTED ROUTE
//   req.user = currentUser;
//   next();
// });
