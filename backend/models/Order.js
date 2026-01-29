// Order Model - Defines the structure of order data in MongoDB
const mongoose = require('mongoose');

// Define the Order Schema
const orderSchema = new mongoose.Schema(
    {
        // Reference to the buyer (User who placed the order)
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Buyer is required'],
        },

        // Buyer's name (cached for easier access)
        buyerName: {
            type: String,
            required: true,
        },

        // Buyer's email (cached for easier access)
        buyerEmail: {
            type: String,
            required: true,
        },

        // Array of ordered items
        items: [
            {
                productId: {
                    type: Number,
                    required: true,
                },
                productName: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'],
                },
                pricePerKg: {
                    type: Number,
                    required: true,
                    min: [0, 'Price must be positive'],
                },
                totalPrice: {
                    type: Number,
                    required: true,
                },
                farmerName: {
                    type: String,
                    required: true,
                },
            },
        ],

        // Total amount for the order
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total amount must be positive'],
        },

        // Order status
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },

        // Delivery address
        deliveryAddress: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            phone: String,
        },

        // Payment status
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },

        // Notes or special instructions
        notes: {
            type: String,
            maxlength: 500,
        },

        // Cancellation details
        cancellationReason: {
            type: String,
            maxlength: 500,
        },

        cancelledAt: {
            type: Date,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
