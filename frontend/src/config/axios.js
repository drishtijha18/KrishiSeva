// Axios configuration for API requests
import axios from 'axios';
import { getToken } from '../utils/auth';

// Get API URL from environment variables
// In development: http://localhost:5001
// In production: Your deployed backend URL (set in Vercel environment variables)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
