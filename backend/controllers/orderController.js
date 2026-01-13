import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Create order from cart (checkout)
export const createOrder = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User must be authenticated to checkout'
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate all items are still available and calculate total
        let totalPrice = 0;
        const orderItems = [];

        for (const cartItem of cart.items) {
            const product = cartItem.product;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product not found for item ${cartItem._id}`
                });
            }

            // Check if product is still available
            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name} (Size: ${cartItem.size}). Available: ${product.stock}, Requested: ${cartItem.quantity}`
                });
            }

            // Check if size is still available
            if (!product.sizes.includes(cartItem.size)) {
                return res.status(400).json({
                    success: false,
                    message: `Size ${cartItem.size} is no longer available for ${product.name}`
                });
            }

            const itemPrice = product.price * cartItem.quantity;
            totalPrice += itemPrice;

            orderItems.push({
                product: product._id,
                productName: product.name,
                productImage: product.imageUrl,
                size: cartItem.size,
                quantity: cartItem.quantity,
                price: product.price
            });
        }

        // Create order
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            totalPrice: totalPrice,
            orderDate: new Date(),
            status: 'pending'
        });

        await order.save();

        // Update product stock (optional - for inventory management)
        for (const cartItem of cart.items) {
            const product = cartItem.product;
            product.stock -= cartItem.quantity;
            await product.save();
        }

        // Clear the cart after successful order
        cart.items = [];
        await cart.save();

        await order.populate('items.product');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get all orders for the authenticated user
export const getUserOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User must be authenticated'
            });
        }

        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ status });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User must be authenticated'
            });
        }

        const { id } = req.params;

        const order = await Order.findById(id).populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order belongs to the user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};
