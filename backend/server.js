// KrishiSeva Backend Server
// Main server file for the authentication system
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cropPricesRoutes = require('./routes/cropprices');
const orderRoutes = require('./routes/order');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware

// Enable CORS for frontend communication
// Supports both development and production environments
const allowedOrigins = [
    'http://localhost:5173', // Local development
    process.env.FRONTEND_URL  // Production frontend URL (set in environment variables)
].filter(Boolean); // Remove undefined values

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked request from origin: ${origin}`);
                callback(null, true); // Allow for now, can be strict in production
            }
        },
        credentials: true,
    })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for development)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'KrishiSeva API is running! 🌾',
        status: 'Active',
        version: '1.0.0',
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Crop prices routes
app.use('/api/cropprices', cropPricesRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// 404 Error handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log('🌾 KrishiSeva Backend Server Started 🌾');
    console.log('═══════════════════════════════════════');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/`);
    console.log('═══════════════════════════════════════');
});
