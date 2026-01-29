// Order Routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// All order routes require authentication
router.use(authMiddleware);

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders for logged-in user
router.get('/', orderController.getOrders);

// Get specific order by ID
router.get('/:id', orderController.getOrderById);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Cancel order with reason
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
