import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_BASE_URL from '../../config/api.js';
import { useCart } from '../../contexts/CartContext.jsx';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart: addToCartContext, getCartItemCount } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [addToCartMessage, setAddToCartMessage] = useState('');
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (err) {
                console.error('Error parsing user data:', err);
            }
        }
    }, []);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            const data = await response.json();
            
            if (data.success) {
                setProduct(data.data);
                // Set default size to first available size
                if (data.data.sizes && data.data.sizes.length > 0) {
                    setSelectedSize(data.data.sizes[0]);
                }
            } else {
                setError('Product not found');
            }
        } catch (err) {
            setError('Error loading product. Please make sure the backend server is running.');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setAddToCartMessage('Please select a size');
            setTimeout(() => setAddToCartMessage(''), 3000);
            return;
        }

        const result = await addToCartContext(product._id, selectedSize, 1);
        if (result.success) {
            setAddToCartMessage(`Added ${product.name} (Size: ${selectedSize}) to cart!`);
        } else {
            setAddToCartMessage(result.message || 'Failed to add item to cart');
        }
        setTimeout(() => setAddToCartMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowUserMenu(false);
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading product...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <div className="text-center py-12">
                        <p className="text-red-600">{error || 'Product not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-blue-600 hover:text-blue-800">
                            ← Back to Home
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            {/* Cart Icon */}
                            <Link
                                to="/cart"
                                className="relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 transition-colors"
                                aria-label="Shopping cart"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {getCartItemCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                                    </span>
                                )}
                            </Link>
                            
                            {/* User Icon - Only show when logged in */}
                            {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label="User menu"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </button>
                                
                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserMenu(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/orders"
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-gray-900 font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Product Detail */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden bg-gray-200 rounded-lg">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/500?text=No+Image';
                                }}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                                    {product.category}
                                </span>
                            </div>
                            
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            
                            <p className="text-2xl font-bold text-gray-900 mb-6">
                                ${product.price.toFixed(2)}
                            </p>
                            
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Size Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Size:
                                </label>
                                <div className="flex gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-6 py-2 border-2 rounded-lg font-medium transition-colors ${
                                                selectedSize === size
                                                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Stock Status */}
                            {product.stock !== undefined && (
                                <div className="mb-6">
                                    <span className={`text-sm font-medium ${
                                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {product.stock > 0 
                                            ? `✓ In Stock (${product.stock} available)` 
                                            : '✗ Out of Stock'}
                                    </span>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                                    product.stock > 0
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>

                            {/* Add to Cart Message */}
                            {addToCartMessage && (
                                <div className={`mt-4 p-3 rounded-lg text-sm ${
                                    addToCartMessage.includes('Please select')
                                        ? 'bg-yellow-50 text-yellow-800'
                                        : 'bg-green-50 text-green-800'
                                }`}>
                                    {addToCartMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
