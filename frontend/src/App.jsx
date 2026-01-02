// Main App Component with Routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './utils/auth';
import SignupPage from './components/Auth/SignupPage';
import LoginPage from './components/Auth/LoginPage';
import BuyerDashboard from './components/Dashboard/BuyerDashboard';
import SellerDashboard from './components/Dashboard/SellerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard Router - Routes to correct dashboard based on user role
const DashboardRouter = () => {
    const userRole = getUserRole();

    // If user is a Buyer, show Buyer Dashboard
    if (userRole === 'Buyer') {
        return <BuyerDashboard />;
    }

    // If user is a Seller, show Seller Dashboard
    if (userRole === 'Seller') {
        return <SellerDashboard />;
    }

    // 🎨 DEMO MODE: Show Buyer Dashboard by default if no role
    // This allows previewing the UI without authentication
    // Change to <SellerDashboard /> to see seller view
    if (!userRole) {
        console.log('🎨 DEMO MODE: Showing Buyer Dashboard (no role found)');
        return <BuyerDashboard />;
    }

    // If role is not recognized, redirect to login
    return <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        isAuthenticated() ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={
                        isAuthenticated() ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <SignupPage />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={
                        isAuthenticated() ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <LoginPage />
                        )
                    }
                />

                {/* Protected Route - Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardRouter />
                        </ProtectedRoute>
                    }
                />

                {/* 404 - Redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
