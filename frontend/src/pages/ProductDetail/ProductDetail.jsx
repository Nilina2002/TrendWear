import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_BASE_URL from '../../config/api.js';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [addToCartMessage, setAddToCartMessage] = useState('');

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

    const handleAddToCart = () => {
        if (!selectedSize) {
            setAddToCartMessage('Please select a size');
            setTimeout(() => setAddToCartMessage(''), 3000);
            return;
        }

        // TODO: Implement actual cart functionality
        setAddToCartMessage(`Added ${product.name} (Size: ${selectedSize}) to cart!`);
        setTimeout(() => setAddToCartMessage(''), 3000);
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
                    <Link to="/" className="text-blue-600 hover:text-blue-800">
                        ← Back to Home
                    </Link>
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
