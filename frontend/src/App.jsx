// Main App Component with Routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './utils/auth';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider } from './context/LanguageContext';
import SignupPage from './components/Auth/SignupPage';
import LoginPage from './components/Auth/LoginPage';
import BuyerDashboard from './components/Dashboard/BuyerDashboard';
import SellerDashboard from './components/Dashboard/SellerDashboard';
import CartPage from './components/Cart/CartPage';
import FavoritesPage from './components/Favorites/FavoritesPage';
import ProfilePage from './components/Profile/ProfilePage';
import CheckoutPage from './components/Checkout/CheckoutPage';
import OrdersPage from './components/Orders/OrdersPage';
import CropPrices from './components/Market/CropPrices';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard Router - Routes to correct dashboard based on user role
const DashboardRouter = () => {
    const role = getUserRole();
    if (role === 'Seller') {
        return <SellerDashboard />;
    }
    return <BuyerDashboard />;
};

const App = () => {
    return (
        <LanguageProvider>
            <FavoritesProvider>
                <CartProvider>
                    <Router>
                        <Routes>
                            {/* Default Route */}
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

                            {/* Authentication Routes */}
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/login" element={<LoginPage />} />

                            {/* Dashboard Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardRouter />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Feature Routes */}
                            <Route
                                path="/cart"
                                element={
                                    <ProtectedRoute>
                                        <CartPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/favorites"
                                element={
                                    <ProtectedRoute>
                                        <FavoritesPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/checkout"
                                element={
                                    <ProtectedRoute>
                                        <CheckoutPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <ProtectedRoute>
                                        <OrdersPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/crop-prices"
                                element={
                                    <ProtectedRoute>
                                        <CropPrices />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </CartProvider>
            </FavoritesProvider>
        </LanguageProvider>
    );
};

export default App;
