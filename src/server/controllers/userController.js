const User = require('../models/userModel');
const catchAsync = require('../../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // console.log(req.query)
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
});

exports.getMakers = catchAsync(async (req, res, next) => {
  const users = await User.find({role: 'maker'});
  // console.log(users);
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    user: user,
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route has not yet implemented.',
  });
};
exports.updateUser = catchAsync(async (req, res, next) => {
  // console.log('REQQQ:', req.body);
  const user = await User.findById(req.params.id);
  if (req.body.orderId != null) {
    user.orders.push(req.body.orderId);
  }
  const update = await User.findByIdAndUpdate(req.params.id, user);

  const maker_user = await User.findById(req.body.makerId);
  if (req.body.orderId != null) {
    user.orders.push(req.body.orderId);
  }
  const maker_update = await User.findByIdAndUpdate(req.body.makerId, user);
  res.status(200).json({
    status: 'success',
    data: {
      user: update,
      maker: maker_update,
    },
  });
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route has not yet implemented.',
  });
};

exports.updateMakerShopStatus = catchAsync(async (req, res, next) => {
  const {shopOpen} = req.body;
  
  const maker = await User.findByIdAndUpdate(
    req.params.id,
    {shopOpen},
    {new: true, runValidators: true}
  );

  if (!maker) {
    return res.status(404).json({
      status: 'error',
      message: 'Maker not found',
    });
  }

  console.log(`🏪 Maker ${maker._id} shop status updated to: ${shopOpen ? 'OPEN' : 'CLOSED'}`);

  res.status(200).json({
    status: 'success',
    data: {
      maker,
    },
  });
});
