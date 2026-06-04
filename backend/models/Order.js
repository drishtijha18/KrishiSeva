// Order Model - Supabase PostgreSQL version
// Helper module for order database operations
const { supabase } = require('../config/db');

// Convert DB row (snake_case) to app format (camelCase)
// This keeps the API responses identical to the old MongoDB version
function toAppFormat(row) {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        buyer: row.buyer,
        buyerName: row.buyer_name,
        buyerEmail: row.buyer_email,
        items: row.items || [],
        totalAmount: parseFloat(row.total_amount),
        status: row.status,
        deliveryAddress: {
            street: row.delivery_street || '',
            city: row.delivery_city || '',
            state: row.delivery_state || '',
            pincode: row.delivery_pincode || '',
            phone: row.delivery_phone || '',
        },
        paymentStatus: row.payment_status,
        notes: row.notes || '',
        cancellationReason: row.cancellation_reason || '',
        cancelledAt: row.cancelled_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

const Order = {
    // Create a new order
    async create(orderData) {
        const { data, error } = await supabase
            .from('orders')
            .insert({
                buyer: orderData.buyer,
                buyer_name: orderData.buyerName,
                buyer_email: orderData.buyerEmail,
                items: orderData.items,
                total_amount: orderData.totalAmount,
                delivery_street: orderData.deliveryAddress?.street || '',
                delivery_city: orderData.deliveryAddress?.city || '',
                delivery_state: orderData.deliveryAddress?.state || '',
                delivery_pincode: orderData.deliveryAddress?.pincode || '',
                delivery_phone: orderData.deliveryAddress?.phone || '',
                notes: orderData.notes || '',
            })
            .select()
            .single();

        if (error) throw error;
        return toAppFormat(data);
    },

    // Find all orders for a buyer, sorted by most recent first
    async findByBuyer(buyerId) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('buyer', buyerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(toAppFormat);
    },

    // Find a single order by ID
    async findById(id) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data ? toAppFormat(data) : null;
    },

    // Update an order's fields
    async update(id, updates) {
        const dbUpdates = {};

        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.cancellationReason !== undefined) dbUpdates.cancellation_reason = updates.cancellationReason;
        if (updates.cancelledAt !== undefined) dbUpdates.cancelled_at = updates.cancelledAt;
        if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;

        const { data, error } = await supabase
            .from('orders')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return toAppFormat(data);
    },
};

module.exports = Order;
