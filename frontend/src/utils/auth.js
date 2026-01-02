// Authentication Utility Functions..
// Helper functions for JWT token management and user authentication

import { jwtDecode } from 'jwt-decode';

// Local storage key for JWT token
const TOKEN_KEY = 'krishiseva_token';

// Get JWT token from localStorage
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Save JWT token to localStorage
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Remove JWT token from localStorage (logout)
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
// Returns true if valid token exists, false otherwise
export const isAuthenticated = () => {
    const token = getToken();

    if (!token) {
        return false;
    }

    try {
        // Decode the token to check expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        // Check if token is expired
        if (decoded.exp < currentTime) {
            // Token expired, remove it
            removeToken();
            return false;
        }

        return true;
    } catch (error) {
        // Invalid token, remove it
        removeToken();
        return false;
    }
};

// Get user role from JWT token
// Returns 'Buyer', 'Seller', or null
export const getUserRole = () => {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return decoded.role || null;
    } catch (error) {
        return null;
    }
};

// Get complete user data from JWT token
// Returns user object or null
export const getUserData = () => {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
    } catch (error) {
        return null;
    }
};

// Logout user by removing token and redirecting to login
export const logout = () => {
    removeToken();
    window.location.href = '/login';
};
