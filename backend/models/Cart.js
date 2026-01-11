import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    size: {
        type: String,
        required: true,
        enum: ['S', 'M', 'L', 'XL']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, { _id: true });

const cartSchema = new mongoose.Schema({
    // For logged in users
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // For guest users (session ID)
    sessionId: {
        type: String,
        default: null
    },
    items: [cartItemSchema]
}, {
    timestamps: true
});

// Index for efficient queries
cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });

// Ensure either user or sessionId is present
cartSchema.pre('save', async function() {
    if (!this.user && !this.sessionId) {
        throw new Error('Cart must have either a user or sessionId');
    }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
