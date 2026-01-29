// Seller Dashboard Component
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { getToken, logout } from '../../utils/auth';
import '../../styles/dashboard.css';
import '../../styles/dashboard-theme.css';

//  DEMO MODE: Set to true to preview UI without backend
const DEMO_MODE = false;  //  Real authentication enabled!

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data from backend on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        // In demo mode, use mock data
        if (DEMO_MODE) {
            setTimeout(() => {
                setUser({
                    name: 'Anita Sharma',
                    email: 'anita@krishiseva.com',
                    role: 'Seller'
                });
                setLoading(false);
            }, 500);
            return;
        }

        try {
            const token = getToken();
            const response = await axios.get('/api/auth/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // If token is invalid, logout
            logout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    const handleAddProduct = () => {
        alert('Add Product feature coming soon!');
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="spinner"></div>
            </div>
        );
    }

    // Get user's first initial for avatar
    const userInitial = user?.name?.charAt(0).toUpperCase() || 'S';

    return (
        <div className="dashboard seller-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L4 7v10c0 5.55 6 9 8 9s8-3.45 8-9V7l-8-5zm0 2.18l6 3.75v7.57c0 4.09-4.23 6.82-6 7.41-1.77-.59-6-3.32-6-7.41V7.93l6-3.75z" />
                        </svg>
                        <h2>KrishiSeva</h2>
                    </div>
                </div>

                {/* User Profile */}
                <div className="sidebar-profile">
                    <div className="profile-avatar">{userInitial}</div>
                    <div className="profile-name">{user?.name || 'Seller'}</div>
                    <div className="profile-email">{user?.email || ''}</div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <a href="#" className="nav-item active">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                        Dashboard
                    </a>
                    <a href="#" className="nav-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
                        </svg>
                        My Products
                    </a>
                    <a href="#" className="nav-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                        Orders
                    </a>
                    <a href="#" className="nav-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        Profile
                    </a>
                </nav>

                {/* Logout Button */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                {/* Welcome Header */}
                <div className="dashboard-header">
                    <div className="welcome-message">
                        <h1>Welcome, {user?.name?.split(' ')[0] || 'Seller'}! 🌱</h1>
                        <p>Manage your products and grow your agricultural business</p>
                    </div>
                    <button
                        className="bell-icon-btn"
                        onClick={() => navigate('/crop-prices')}
                        title="View Crop Price Updates"
                        style={{
                            background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 204, 113, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 204, 113, 0.3)';
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                        </svg>
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            background: '#e74c3c',
                            borderRadius: '50%',
                            width: '10px',
                            height: '10px',
                            border: '2px solid white'
                        }}></span>
                    </button>
                </div>

                {/* Stats Section */}
                <section className="category-section">
                    <h2 className="section-title">Sales Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">Total Products</div>
                            <div className="stat-value">12</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Active Orders</div>
                            <div className="stat-value">8</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total Sales</div>
                            <div className="stat-value">₹24,500</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total Revenue</div>
                            <div className="stat-value">₹1,45,000</div>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="products-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Your Products</h2>
                        <button className="add-product-btn" onClick={handleAddProduct}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Add New Product
                        </button>
                    </div>

                    <div className="products-grid">
                        {/* Sample Seller Product 1 */}
                        <div className="product-card">
                            <div className="product-image" style={{ backgroundColor: '#f5f1e8' }}>
                                <div style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '4rem'
                                }}>
                                    🌾
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">Premium Wheat</h3>
                                <div className="product-farmer">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                    </svg>
                                    Stock: 500 kg
                                </div>
                                <div className="product-rating">
                                    <span className="stars">★★★★★</span>
                                    <span className="rating-count">(45 reviews)</span>
                                </div>
                                <div className="product-price">
                                    ₹ 35 <span>per kg</span>
                                </div>
                                <div className="product-actions">
                                    <button className="view-details-btn">Edit Product</button>
                                    <button className="favorite-btn" style={{ backgroundColor: '#ffebee' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sample Seller Product 2 */}
                        <div className="product-card">
                            <div className="product-image" style={{ backgroundColor: '#f5f1e8' }}>
                                <div style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '4rem'
                                }}>
                                    🍚
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">Organic Basmati</h3>
                                <div className="product-farmer">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                    </svg>
                                    Stock: 300 kg
                                </div>
                                <div className="product-rating">
                                    <span className="stars">★★★★★</span>
                                    <span className="rating-count">(67 reviews)</span>
                                </div>
                                <div className="product-price">
                                    ₹ 65 <span>per kg</span>
                                </div>
                                <div className="product-actions">
                                    <button className="view-details-btn">Edit Product</button>
                                    <button className="favorite-btn" style={{ backgroundColor: '#ffebee' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sample Seller Product 3 */}
                        <div className="product-card">
                            <div className="product-image" style={{ backgroundColor: '#f5f1e8' }}>
                                <div style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '4rem'
                                }}>
                                    🥔
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">Fresh Potatoes</h3>
                                <div className="product-farmer">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                    </svg>
                                    Stock: 800 kg
                                </div>
                                <div className="product-rating">
                                    <span className="stars">★★★★☆</span>
                                    <span className="rating-count">(32 reviews)</span>
                                </div>
                                <div className="product-price">
                                    ₹ 25 <span>per kg</span>
                                </div>
                                <div className="product-actions">
                                    <button className="view-details-btn">Edit Product</button>
                                    <button className="favorite-btn" style={{ backgroundColor: '#ffebee' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SellerDashboard;
