// Order Controllers - Handle order creation and management
const Order = require('../models/Order');
const User = require('../models/User');

// CREATE ORDER Controller
// Creates a new order from cart items
exports.createOrder = async (req, res) => {
    try {
        console.log('📦 Create Order Request:', { userId: req.user.id });

        const { items, deliveryAddress, notes } = req.body;

        // Validate: Check if items exist
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Order must contain at least one item',
            });
        }

        // Get user details
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        // Check if user profile is complete
        if (!user.profileCompleted) {
            return res.status(400).json({
                success: false,
                error: 'Please complete your profile (phone and address) before placing an order',
                profileCompleted: false,
            });
        }

        // Use provided address or fall back to user's saved address
        const finalAddress = deliveryAddress || user.address;

        if (!finalAddress || !finalAddress.street || !finalAddress.city) {
            return res.status(400).json({
                success: false,
                error: 'Delivery address is required',
            });
        }

        // Calculate total amount
        let totalAmount = 0;
        const orderItems = items.map((item) => {
            const itemTotal = item.pricePerKg * item.quantity;
            totalAmount += itemTotal;

            return {
                ...item,
                totalPrice: itemTotal,
            };
        });

        // Create new order
        const order = await Order.create({
            buyer: user._id,
            buyerName: user.name,
            buyerEmail: user.email,
            items: orderItems,
            totalAmount,
            deliveryAddress: {
                street: finalAddress.street,
                city: finalAddress.city,
                state: finalAddress.state,
                pincode: finalAddress.pincode,
                phone: user.phone, // Use user's phone
            },
            notes: notes || '',
        });

        console.log('✅ Order created successfully:', order._id);

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order: {
                id: order._id,
                items: order.items,
                totalAmount: order.totalAmount,
                status: order.status,
                deliveryAddress: order.deliveryAddress,
                createdAt: order.createdAt,
            },
        });
    } catch (error) {
        console.error('❌ Create Order Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create order. Please try again.',
        });
    }
};

// GET USER ORDERS Controller
// Retrieves all orders for the logged-in user
exports.getOrders = async (req, res) => {
    try {
        console.log('📋 Get Orders Request:', { userId: req.user.id });

        const orders = await Order.find({ buyer: req.user.id })
            .sort({ createdAt: -1 }); // Most recent first

        res.status(200).json({
            success: true,
            count: orders.length,
            orders: orders.map(order => ({
                id: order._id,
                items: order.items,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                deliveryAddress: order.deliveryAddress,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                cancellationReason: order.cancellationReason,
                cancelledAt: order.cancelledAt,
            })),
        });
    } catch (error) {
        console.error('❌ Get Orders Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders. Please try again.',
        });
    }
};

// GET ORDER BY ID Controller
// Retrieves a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 Get Order By ID Request:', { orderId: id, userId: req.user.id });

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }

        // Check if order belongs to the requesting user
        if (order.buyer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to view this order',
            });
        }

        res.status(200).json({
            success: true,
            order: {
                id: order._id,
                buyerName: order.buyerName,
                buyerEmail: order.buyerEmail,
                items: order.items,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                deliveryAddress: order.deliveryAddress,
                notes: order.notes,
                cancellationReason: order.cancellationReason,
                cancelledAt: order.cancelledAt,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
        });
    } catch (error) {
        console.error('❌ Get Order By ID Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order. Please try again.',
        });
    }
};

// UPDATE ORDER STATUS Controller
// Updates order status (for admin/seller use in future)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log('🔄 Update Order Status Request:', { orderId: id, newStatus: status });

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order status',
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }

        // For now, only allow buyers to cancel their own orders
        if (status === 'cancelled' && order.buyer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to cancel this order',
            });
        }

        order.status = status;
        await order.save();

        console.log('✅ Order status updated:', { orderId: id, status });

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: {
                id: order._id,
                status: order.status,
                updatedAt: order.updatedAt,
            },
        });
    } catch (error) {
        console.error('❌ Update Order Status Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status. Please try again.',
        });
    }
};

// CANCEL ORDER Controller
// Allows users to cancel their orders with a reason
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        console.log('❌ Cancel Order Request:', { orderId: id, userId: req.user.id });

        if (!reason || reason.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cancellation reason is required',
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }

        // Check if order belongs to the requesting user
        if (order.buyer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to cancel this order',
            });
        }

        // Check if order can be cancelled (only pending or confirmed orders)
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                error: `Cannot cancel order with status: ${order.status}`,
            });
        }

        // Update order
        order.status = 'cancelled';
        order.cancellationReason = reason;
        order.cancelledAt = new Date();
        await order.save();

        console.log('✅ Order cancelled successfully:', { orderId: id });

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order: {
                id: order._id,
                status: order.status,
                cancellationReason: order.cancellationReason,
                cancelledAt: order.cancelledAt,
            },
        });
    } catch (error) {
        console.error('❌  Cancel Order Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cancel order. Please try again.',
        });
    }
};
