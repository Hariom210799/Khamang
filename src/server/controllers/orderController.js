const Dish = require('../models/dishModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Menu = require('../models/menuModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_oyCN745HPQkWRI',
  key_secret: '8fVl1zB51NgwBRDuQXQWdIye',
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate({
      path: 'makerid',
      select: 'shopOpen',
    })
    .sort({createdAt: -1}); // Sort by newest first
  
  // Remove duplicates - keep only the most recent order for each _id
  const uniqueOrders = [];
  const seenIds = new Set();
  
  orders.forEach(order => {
    if (!seenIds.has(order._id.toString())) {
      seenIds.add(order._id.toString());
      uniqueOrders.push(order);
    }
  });
  
  // Format response to include maker data
  const ordersWithMakerData = uniqueOrders.map(order => ({
    ...order.toObject(),
    makerid_data: order.makerid,
  }));
  
  res.status(200).json({
    status: 'success',
    results: uniqueOrders.length,
    data: {
      orders: ordersWithMakerData,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const order = await Order.findById(req.params.id);
  // console.log('DD', order);
  // console.log(req.params.id);
  if (!order) {
    return next(new AppError('No order found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  console.log('Creating Order');
  
  // Import User model to check maker's online time
  const User = require('../models/userModel');
  
  // Get maker info
  const maker = await User.findById(req.body.makerid);
  
  if (!maker) {
    return res.status(404).json({
      status: 'fail',
      message: 'Maker not found',
    });
  }

  // Check if maker's online time is enabled
  if (maker.onlineTimeEnabled && maker.onlineTimeStart && maker.onlineTimeEnd) {
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, '0');
    const currentMin = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHour}:${currentMin}`;

    const [startH, startM] = maker.onlineTimeStart.split(':');
    const [endH, endM] = maker.onlineTimeEnd.split(':');
    
    const startMinutes = parseInt(startH) * 60 + parseInt(startM);
    const endMinutes = parseInt(endH) * 60 + parseInt(endM);
    const currentMinutes = parseInt(currentHour) * 60 + parseInt(currentMin);

    // Check if current time is within online hours
    if (currentMinutes < startMinutes || currentMinutes >= endMinutes) {
      return res.status(400).json({
        status: 'fail',
        message: `Maker is not available at this time. Online hours: ${maker.onlineTimeStart} - ${maker.onlineTimeEnd}`,
      });
    }
  }

  // If online time check passes, create the order
  const newOrder = await Order.create(req.body);
  console.log('Create in Controller:', newOrder);

  res.status(201).json({
    status: 'success',
    data: newOrder,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  console.log('Updating Order', req.params.id, req.body);
  
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return modified doc, not original
    runValidators: true, // validates the update operation
  });

  if (!order) {
    return next(new AppError('No order found with that Id', 404));
  }

  console.log('✅ Order updated:', order);

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  console.log('Updating Dish');

  const menu = await Menu.findById(req.body.menu_id);
  category_index = menu.categories.findIndex(function (category) {
    return category.title === req.body.category_name;
  });
  dish_index = menu.categories[category_index].dishes.findIndex(function (
    dish,
  ) {
    return dish._id === req.params.id;
  });

  menu.categories[category_index].dishes = menu.categories[
    category_index
  ].dishes.filter(function (dish_item) {
    return dish_item._id != req.params.id;
  });
  const update_menu = await Menu.findByIdAndUpdate(menu._id, menu, {
    new: true,
    runValidators: true,
  });
  await Dish.findByIdAndDelete(req.params.id);

  if (!dish) {
    return next(new AppError('No dish found with that Id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {},
  });
});
