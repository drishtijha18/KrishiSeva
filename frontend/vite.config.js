import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for React application
export default defineConfig({
    plugins: [react()],

    // Development server configuration
    server: {
        port: 5173,
        // Proxy API requests to backend server
        // This allows frontend to call /api/* without CORS issues during development
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            },
        },
    },
});
