const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// router.param('id', menuController.checkID);
router
  .route('/')
  .get(orderController.getOrders)
  .post(orderController.createOrder);

router
  .route('/:id')
  .delete(orderController.deleteOrder)
  .get(orderController.getOrder)
  .patch(orderController.updateOrder);

module.exports = router;
