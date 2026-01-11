import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '../config/api.js';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState(null);

    // Get or create session ID from localStorage
    useEffect(() => {
        let storedSessionId = localStorage.getItem('cartSessionId');
        if (!storedSessionId) {
            storedSessionId = generateSessionId();
            localStorage.setItem('cartSessionId', storedSessionId);
        }
        setSessionId(storedSessionId);
    }, []);

    // Generate a simple session ID
    const generateSessionId = () => {
        return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    // Fetch cart from API
    const fetchCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (sessionId) {
                headers['x-session-id'] = sessionId;
            }

            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'GET',
                headers
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.data);
                // Update session ID if returned from server
                if (data.sessionId) {
                    setSessionId(data.sessionId);
                    localStorage.setItem('cartSessionId', data.sessionId);
                }
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load cart on mount and when sessionId changes
    useEffect(() => {
        if (sessionId) {
            fetchCart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    // Reload cart when user logs in/out
    useEffect(() => {
        const handleStorageChange = () => {
            fetchCart();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Add item to cart
    const addToCart = async (productId, size, quantity = 1) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (sessionId) {
                headers['x-session-id'] = sessionId;
            }

            const response = await fetch(`${API_BASE_URL}/cart/add`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ productId, size, quantity })
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.data);
                if (data.sessionId) {
                    setSessionId(data.sessionId);
                    localStorage.setItem('cartSessionId', data.sessionId);
                }
                return { success: true, message: 'Item added to cart' };
            } else {
                return { success: false, message: data.message || 'Failed to add item to cart' };
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            return { success: false, message: 'Error adding item to cart' };
        }
    };

    // Update cart item quantity
    const updateCartItem = async (itemId, quantity) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (sessionId) {
                headers['x-session-id'] = sessionId;
            }

            const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ quantity })
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.data);
                if (data.sessionId) {
                    setSessionId(data.sessionId);
                    localStorage.setItem('cartSessionId', data.sessionId);
                }
                return { success: true, message: 'Cart updated' };
            } else {
                return { success: false, message: data.message || 'Failed to update cart' };
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            return { success: false, message: 'Error updating cart' };
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (sessionId) {
                headers['x-session-id'] = sessionId;
            }

            const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
                method: 'DELETE',
                headers
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.data);
                if (data.sessionId) {
                    setSessionId(data.sessionId);
                    localStorage.setItem('cartSessionId', data.sessionId);
                }
                return { success: true, message: 'Item removed from cart' };
            } else {
                return { success: false, message: data.message || 'Failed to remove item' };
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { success: false, message: 'Error removing item from cart' };
        }
    };

    // Clear cart
    const clearCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (sessionId) {
                headers['x-session-id'] = sessionId;
            }

            const response = await fetch(`${API_BASE_URL}/cart/clear`, {
                method: 'DELETE',
                headers
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.data);
                return { success: true, message: 'Cart cleared' };
            } else {
                return { success: false, message: data.message || 'Failed to clear cart' };
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            return { success: false, message: 'Error clearing cart' };
        }
    };

    // Merge guest cart with user cart on login
    const mergeCarts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return { success: false, message: 'User must be logged in' };
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            if (sessionId) {
                headers['x-session-id'] = sessionId;
            }

            const response = await fetch(`${API_BASE_URL}/cart/merge`, {
                method: 'POST',
                headers
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.data);
                return { success: true, message: 'Carts merged successfully' };
            } else {
                return { success: false, message: data.message || 'Failed to merge carts' };
            }
        } catch (error) {
            console.error('Error merging carts:', error);
            return { success: false, message: 'Error merging carts' };
        }
    };

    // Get cart item count
    const getCartItemCount = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    // Get cart total
    const getCartTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const value = {
        cart,
        loading,
        sessionId,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        mergeCarts,
        fetchCart,
        getCartItemCount,
        getCartTotal
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
