import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be a positive number']
    },
    imageUrl: {
        type: String,
        required: [true, 'Product image URL is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: ['Men', 'Women', 'Kids'],
            message: 'Category must be Men, Women, or Kids'
        }
    },
    sizes: {
        type: [String],
        required: [true, 'Product sizes are required'],
        validate: {
            validator: function(sizes) {
                return sizes.length > 0 && sizes.every(size => ['S', 'M', 'L', 'XL'].includes(size));
            },
            message: 'Sizes must be an array containing S, M, L, or XL'
        }
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
