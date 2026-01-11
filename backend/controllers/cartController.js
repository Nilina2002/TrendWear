import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import crypto from 'crypto';

// Helper function to generate session ID
const generateSessionId = () => {
    return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
};

// Helper function to get or create cart identifier
const getCartIdentifier = (req) => {
    if (req.user) {
        return { user: req.user._id };
    }
    
    // For guest users, use sessionId from header or generate one
    let sessionId = req.headers['x-session-id'];
    if (!sessionId) {
        sessionId = generateSessionId();
    }
    
    return { sessionId };
};

// Get cart for user (logged in or guest)
export const getCart = async (req, res) => {
    try {
        const identifier = getCartIdentifier(req);
        
        let cart = await Cart.findOne(identifier).populate('items.product');
        
        if (!cart) {
            cart = new Cart(identifier);
            await cart.save();
        }
        
        res.status(200).json({
            success: true,
            data: cart,
            sessionId: identifier.sessionId || null
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart',
            error: error.message
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, size, quantity = 1 } = req.body;
        
        if (!productId || !size) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and size are required'
            });
        }
        
        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Verify size is available
        if (!product.sizes.includes(size)) {
            return res.status(400).json({
                success: false,
                message: 'Selected size is not available for this product'
            });
        }
        
        const identifier = getCartIdentifier(req);
        
        let cart = await Cart.findOne(identifier);
        
        if (!cart) {
            cart = new Cart(identifier);
        }
        
        // Check if item with same product and size already exists
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.size === size
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                size,
                quantity
            });
        }
        
        await cart.save();
        await cart.populate('items.product');
        
        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: cart,
            sessionId: identifier.sessionId || null
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }
        
        const identifier = getCartIdentifier(req);
        
        const cart = await Cart.findOne(identifier);
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        
        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product');
        
        res.status(200).json({
            success: true,
            message: 'Cart item updated',
            data: cart,
            sessionId: identifier.sessionId || null
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart item',
            error: error.message
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        
        const identifier = getCartIdentifier(req);
        
        const cart = await Cart.findOne(identifier);
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        
        cart.items.pull(itemId);
        await cart.save();
        await cart.populate('items.product');
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: cart,
            sessionId: identifier.sessionId || null
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item from cart',
            error: error.message
        });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const identifier = getCartIdentifier(req);
        
        const cart = await Cart.findOne(identifier);
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        cart.items = [];
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: cart
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
};

// Merge guest cart with user cart on login
export const mergeCarts = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User must be authenticated'
            });
        }
        
        const sessionId = req.headers['x-session-id'];
        
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }
        
        // Get guest cart
        const guestCart = await Cart.findOne({ sessionId });
        
        // Get or create user cart
        let userCart = await Cart.findOne({ user: req.user._id });
        
        if (!userCart) {
            userCart = new Cart({ user: req.user._id, items: [] });
        }
        
        // Merge items from guest cart to user cart
        if (guestCart && guestCart.items.length > 0) {
            for (const guestItem of guestCart.items) {
                const existingItemIndex = userCart.items.findIndex(
                    item => item.product.toString() === guestItem.product.toString() && 
                            item.size === guestItem.size
                );
                
                if (existingItemIndex > -1) {
                    // Merge quantities
                    userCart.items[existingItemIndex].quantity += guestItem.quantity;
                } else {
                    // Add new item
                    userCart.items.push({
                        product: guestItem.product,
                        size: guestItem.size,
                        quantity: guestItem.quantity
                    });
                }
            }
            
            await userCart.save();
            
            // Delete guest cart
            await Cart.deleteOne({ sessionId });
        }
        
        await userCart.populate('items.product');
        
        res.status(200).json({
            success: true,
            message: 'Carts merged successfully',
            data: userCart
        });
    } catch (error) {
        console.error('Merge carts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error merging carts',
            error: error.message
        });
    }
};
