import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCodOrder,
  trackOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Razorpay checkout endpoints
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);

// COD endpoint
router.post('/create-cod-order', createCodOrder);

// Tracking endpoint for customer
router.get('/track/:query', trackOrder);

// Admin endpoints
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

export default router;
