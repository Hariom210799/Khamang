const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const categoryRouter = require('./routes/categoryRoutes');
const userRouter = require('./routes/userRoutes');
const makerRouter = require('./routes/makerRoutes');
const menuRouter = require('./routes/menuRoutes');
const dishRouter = require('./routes/dishRoutes');
const orderRouter = require('./routes/orderRoutes');
const verifyRouter = require('./routes/verifyRoutes');
const imageRouter = require('./routes/imageRoutes');
const cloudinaryRouter = require('./routes/cloudinaryRoutes');
const AppError = require('../utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
var cors = require('cors');

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Allow all origins for development
app.use(cors());

// Early logging middleware - log ALL requests BEFORE parsing
app.use((req, res, next) => {
  console.log('\n🔵 NEW REQUEST:', req.method, req.originalUrl);
  next();
});

// Parse JSON bodies (for non-multipart requests)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Note: Using Cloudinary for images, no local uploads needed

// Log parsed body (after parsing)
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    console.log('📦 Body received:', JSON.stringify(req.body));
  }
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
console.log('📍 Registering routes...');
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/menus', menuRouter);
app.use('/api/v1/dishes', dishRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/makers', makerRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/verifies', verifyRouter);
app.use('/api/v1/images', imageRouter);
app.use('/api/v1/cloudinary', cloudinaryRouter);

// Error handlers
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    console.log('❌ Multer error:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ status: 'error', message: 'File too large (max 10MB)' });
    }
    return res.status(400).json({ status: 'error', message: `Upload error: ${err.message}` });
  }
  next(err);
});

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
