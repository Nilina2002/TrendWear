import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api.js';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const url = selectedCategory === 'All' 
                    ? `${API_BASE_URL}/products`
                    : `${API_BASE_URL}/products?category=${selectedCategory}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    setProducts(data.data);
                } else {
                    setError('Failed to fetch products');
                }
            } catch (err) {
                setError('Error loading products. Please make sure the backend server is running.');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    const categories = ['All', 'Men', 'Women', 'Kids'];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-3xl font-bold text-gray-900">TrendWear</h1>
                </div>
            </header>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-4 mb-6">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Make sure to run: npm run seed:products in the backend directory
                        </p>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && (
                    <>
                        <div className="mb-4">
                            <p className="text-gray-600">
                                Showing {products.length} product{products.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-200">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/500?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-2">
                                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                {product.category}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-gray-900">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Sizes: {product.sizes.join(', ')}
                                            </span>
                                        </div>
                                        {product.stock !== undefined && (
                                            <div className="mt-2">
                                                <span className={`text-xs ${
                                                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {products.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-600">No products found in this category.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
