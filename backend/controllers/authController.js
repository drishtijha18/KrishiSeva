// Authentication Controllers - Handle signup, login, and dashboard logic
// Now using Supabase (PostgreSQL) instead of MongoDB
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function: Generate JWT token
const generateToken = (userId, email, role) => {
    // Create a token that expires in 24 hours
    return jwt.sign(
        { id: userId, email: email, role: role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// SIGNUP Controller
// it will Handle user registration for both Buyers and Sellers
exports.signup = async (req, res) => {
    try {
        // Get user details from request body
        const { name, email, password, role } = req.body;

        // Validate: Check if all required fields are provided
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields (name, email, password, role)',
            });
        }

        // Validate: Check if role is valid
        if (role !== 'Buyer' && role !== 'Seller') {
            return res.status(400).json({
                success: false,
                error: 'Role must be either Buyer or Seller',
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters',
            });
        }

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered. Please use a different email or login.',
            });
        }

        // Create new user in database (password is hashed inside User.create)
        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        // Generate JWT token for the new user
        const token = generateToken(user.id, user.email, user.role);

        // Send success response with token and user data
        res.status(201).json({
            success: true,
            message: 'User registered successfully! Welcome to KrishiSeva.',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Signup Error:', error);

        // Handle duplicate key errors (from Supabase unique constraint)
        if (error.code === 11000 || error.code === '23505') {
            return res.status(400).json({
                success: false,
                error: 'Email already registered. Please use a different email or login.',
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: validationErrors.join(', '),
            });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            error: 'Server error during registration. Please try again.',
        });
    }
};

// LOGIN Controller
// Handles user authentication
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide both email and password',
            });
        }

        // Find email in database
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        // comparePassword — now a static method on User helper
        const isPasswordCorrect = await User.comparePassword(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.email, user.role);


        res.status(200).json({
            success: true,
            message: 'Login successful! Welcome back to KrishiSeva.',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login. Please try again.',
        });
    }
};
// DASHBOARD Controller

exports.getDashboard = async (req, res) => {
    try {

        const user = await User.findById(req.user.id, true); // true = exclude password

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        // Send user data
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                profileCompleted: user.profileCompleted,
                profilePhoto: user.profilePhoto,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error. Please try again.',
        });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        console.log('📝 Update Profile Request:', { userId: req.user.id });

        const { phone, address, profilePhoto } = req.body;

        // Find user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        // Build the update object
        const updates = {};

        if (phone) {
            updates.phone = phone;
        }

        if (profilePhoto !== undefined) {
            updates.profilePhoto = profilePhoto;
        }

        if (address) {
            updates.address = {
                street: address.street || user.address?.street || '',
                city: address.city || user.address?.city || '',
                state: address.state || user.address?.state || '',
                pincode: address.pincode || user.address?.pincode || '',
            };
        }

        // Check if profile is now complete (phone + address)
        const finalPhone = updates.phone || user.phone;
        const finalAddress = updates.address || user.address;
        const isAddressComplete = finalAddress?.street && finalAddress?.city &&
            finalAddress?.state && finalAddress?.pincode;

        if (finalPhone && isAddressComplete) {
            updates.profileCompleted = true;
        }

        // Update user in Supabase
        const updatedUser = await User.update(user.id, updates);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                profileCompleted: updatedUser.profileCompleted,
                profilePhoto: updatedUser.profilePhoto,
            },
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while updating profile',
        });
    }
};
