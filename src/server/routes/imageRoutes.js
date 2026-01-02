const express = require('express');
const router = express.Router();
const unsplashController = require('../controllers/unsplashController');

router.get('/search', unsplashController.searchImage);

module.exports = router;
