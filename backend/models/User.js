// User Model - Supabase PostgreSQL version
// Helper module for user database operations with bcrypt password hashing
const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

// Convert DB row (snake_case) to app format (camelCase)
// This keeps the API responses identical to the old MongoDB version
function toAppFormat(row) {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        profilePhoto: row.profile_photo,
        phone: row.phone,
        address: {
            street: row.address_street || '',
            city: row.address_city || '',
            state: row.address_state || '',
            pincode: row.address_pincode || '',
        },
        profileCompleted: row.profile_completed,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

const User = {
    // Create a new user with hashed password
    async create({ name, email, password, role }) {
        // Hash password before storing (replaces Mongoose pre-save hook)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
            .from('users')
            .insert({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role,
            })
            .select()
            .single();

        if (error) {
            // Convert Supabase error to match old error format for controller compatibility
            if (error.code === '23505') {
                // Unique constraint violation (duplicate email)
                const err = new Error('Email already registered');
                err.code = 11000; // Match MongoDB duplicate key error code
                throw err;
            }
            if (error.code === '23514') {
                // Check constraint violation (invalid role)
                const err = new Error('Validation failed');
                err.name = 'ValidationError';
                err.errors = { role: { message: 'Role must be either Buyer or Seller' } };
                throw err;
            }
            throw error;
        }

        return toAppFormat(data);
    },

    // Find a user by email
    async findOne({ email }) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle();

        if (error) throw error;
        return data ? toAppFormat(data) : null;
    },

    // Find a user by ID
    // excludePassword: if true, won't include password in result
    async findById(id, excludePassword = false) {
        const columns = excludePassword
            ? 'id, name, email, role, profile_photo, phone, address_street, address_city, address_state, address_pincode, profile_completed, created_at, updated_at'
            : '*';

        const { data, error } = await supabase
            .from('users')
            .select(columns)
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data ? toAppFormat(data) : null;
    },

    // Update user fields
    async update(id, updates) {
        // Convert camelCase app fields to snake_case DB fields
        const dbUpdates = {};

        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.profilePhoto !== undefined) dbUpdates.profile_photo = updates.profilePhoto;
        if (updates.profileCompleted !== undefined) dbUpdates.profile_completed = updates.profileCompleted;
        if (updates.address !== undefined) {
            if (updates.address.street !== undefined) dbUpdates.address_street = updates.address.street;
            if (updates.address.city !== undefined) dbUpdates.address_city = updates.address.city;
            if (updates.address.state !== undefined) dbUpdates.address_state = updates.address.state;
            if (updates.address.pincode !== undefined) dbUpdates.address_pincode = updates.address.pincode;
        }

        const { data, error } = await supabase
            .from('users')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return toAppFormat(data);
    },

    // Compare entered password with hashed password in database
    // Returns true if passwords match, false otherwise
    async comparePassword(enteredPassword, hashedPassword) {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    },
};

module.exports = User;