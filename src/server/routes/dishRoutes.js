const express = require('express');
const multer = require('multer');
const dishController = require('../controllers/dishController');
const router = express.Router();

// ✅ FIXED: Use memoryStorage so file stays in RAM as buffer (needed for Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // ✅ Accept image files only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// ✅ Use .array('image', 1) instead of .single('image') - more reliable
router
  .route('/')
  .get(dishController.getAllDishes)
  .post(upload.array('image', 1), dishController.createDish);
router
  .route('/:id')
  .delete(dishController.deleteDish)
  .get(dishController.getSingleDish)
  .patch(upload.array('image', 1), dishController.updateDish);

module.exports = router;
