// Authentication Controllers - Handle signup, login, and dashboard logic
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

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered. Please use a different email or login.',
            });
        }

        // Create new user in database
        
        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        // Generate JWT token for the new user
        const token = generateToken(user._id, user.email, user.role);

        // Send success response with token and user data
        res.status(201).json({
            success: true,
            message: 'User registered successfully! Welcome to KrishiSeva.',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Signup Error:', error);
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

        //comparePassword 
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = generateToken(user._id, user.email, user.role);

        
        res.status(200).json({
            success: true,
            message: 'Login successful! Welcome back to KrishiSeva.',
            token: token,
            user: {
                id: user._id,
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
        
        const user = await User.findById(req.user.id).select('-password');

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
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
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
