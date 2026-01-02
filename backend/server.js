// KrishiSeva Backend Server
// Main server file for the authentication system
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware

// Enable CORS for frontend communication
app.use(
    cors({
        origin: 'http://localhost:5173', // Frontend URL (Vite default port)
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
