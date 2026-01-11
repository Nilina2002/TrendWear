import express from 'express';
import { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    mergeCarts
} from '../controllers/cartController.js';
import { optionalAuthenticate } from '../middleware/optionalAuth.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes use optional auth (works for both logged in and guest users)
router.use(optionalAuthenticate);

// Get cart (works for both logged in and guest users)
router.get('/', getCart);

// Add to cart (works for both logged in and guest users)
router.post('/add', addToCart);

// Update cart item quantity
router.put('/item/:itemId', updateCartItem);

// Remove item from cart
router.delete('/item/:itemId', removeFromCart);

// Clear cart
router.delete('/clear', clearCart);

// Merge guest cart with user cart (requires authentication)
router.post('/merge', authenticate, mergeCarts);

export default router;
