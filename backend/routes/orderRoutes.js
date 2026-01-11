import express from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Create order (checkout)
router.post('/checkout', createOrder);

// Get all orders for the authenticated user
router.get('/', getUserOrders);

// Get single order by ID
router.get('/:id', getOrderById);

export default router;
