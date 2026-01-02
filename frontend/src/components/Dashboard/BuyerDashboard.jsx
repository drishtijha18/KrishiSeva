// Buyer Dashboard Component
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { getToken, logout, getUserData } from '../../utils/auth';
import '../../styles/dashboard.css';
import '../../styles/dashboard-theme.css';

// DEMO MODE: Set to true to preview UI without backend
const DEMO_MODE = false;  // Real authentication enabled!

const BuyerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Rice');

    // Dummy product data
    const productsData = {
        'Wheat': [
            { id: 1, name: 'Sharbati Wheat', farmer: 'Farmer Ramesh', rating: 4.8, reviews: 150, price: 40, image: '🌾' },
            { id: 2, name: 'Lokwan Wheat', farmer: 'Farmer Suresh', rating: 4.5, reviews: 85, price: 35, image: '🌾' },
            { id: 3, name: 'Khapli Wheat', farmer: 'Farmer Mahesh', rating: 4.9, reviews: 200, price: 65, image: '🌾' },
            { id: 4, name: 'Durum Wheat', farmer: 'Farmer Dinesh', rating: 4.6, reviews: 120, price: 45, image: '🌾' }
        ],
        'Rice': [
            { id: 5, name: 'Organic Basmati Rice', farmer: 'Farmer Rajesh', rating: 5.0, reviews: 120, price: 60, image: '🍚' },
            { id: 6, name: 'Sona Masoori Rice', farmer: 'Farmer Anita', rating: 5.0, reviews: 95, price: 50, image: '🍚' },
            { id: 7, name: 'Premium Jasmine Rice', farmer: 'Farmer Suresh', rating: 4.0, reviews: 80, price: 70, image: '🍚' },
            { id: 8, name: 'Brown Rice', farmer: 'Farmer Mohan', rating: 5.0, reviews: 60, price: 55, image: '🍚' }
        ],
        'Grains': [
            { id: 9, name: 'Yellow Maize', farmer: 'Farmer Hitesh', rating: 4.7, reviews: 90, price: 25, image: '🌽' },
            { id: 10, name: 'Pearl Millet (Bajra)', farmer: 'Farmer Ganesh', rating: 4.4, reviews: 70, price: 30, image: '🌽' },
            { id: 11, name: 'Sorghum (Jowar)', farmer: 'Farmer Vignesh', rating: 4.6, reviews: 55, price: 40, image: '🌽' },
            { id: 12, name: 'Finger Millet (Ragi)', farmer: 'Farmer Lakshmi', rating: 4.9, reviews: 110, price: 50, image: '🌽' }
        ],
        'Fruits & Vegetables': [
            { id: 13, name: 'Fresh Potatoes', farmer: 'Farmer Raju', rating: 4.5, reviews: 300, price: 20, image: '🥔' },
            { id: 14, name: 'Red Onions', farmer: 'Farmer Ramu', rating: 4.3, reviews: 250, price: 25, image: '🧅' },
            { id: 15, name: 'Organic Tomatoes', farmer: 'Farmer Sita', rating: 4.8, reviews: 180, price: 30, image: '🍅' },
            { id: 16, name: 'Green Apples', farmer: 'Farmer Vijay', rating: 4.7, reviews: 140, price: 120, image: '🍏' }
        ]
    };

    // Fetch user data from backend on component mount...
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        // In demo mode, use mock data
        if (DEMO_MODE) {
            setTimeout(() => {
                setUser({
                    name: 'Rajesh Kumar',
                    email: 'rajesh@krishiseva.com',
                    role: 'Buyer'
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

    if (loading) {
        return (
            <div className="dashboard">
                <div className="spinner"></div>
            </div>
        );
    }

    // Get user's first initial for avatar
    const userInitial = user?.name?.charAt(0).toUpperCase() || 'B';

    return (
        <div className="dashboard buyer-dashboard">
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
                    <div className="profile-name">{user?.name || 'Buyer'}</div>
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
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                        Orders
                    </a>
                    <a href="#" className="nav-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        Favorites
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
                        <h1>Welcome to KrishiSeva, {user?.name?.split(' ')[0] || 'Buyer'}! 🌾</h1>
                        <p>Explore fresh farm products from trusted sellers</p>
                    </div>
                </div>

                {/* Category Section */}
                <section className="category-section">
                    <h2 className="section-title">Select the type of crop you want to explore</h2>
                    <div className="category-grid">
                        <div
                            className={`category-card ${selectedCategory === 'Wheat' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('Wheat')}
                            style={{ borderColor: selectedCategory === 'Wheat' ? 'var(--secondary-green)' : 'transparent' }}
                        >
                            <div className="category-icon">🌾</div>
                            <h3>Wheat</h3>
                        </div>
                        <div
                            className={`category-card ${selectedCategory === 'Rice' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('Rice')}
                            style={{ borderColor: selectedCategory === 'Rice' ? 'var(--secondary-green)' : 'transparent' }}
                        >
                            <div className="category-icon">🍚</div>
                            <h3>Rice</h3>
                        </div>
                        <div
                            className={`category-card ${selectedCategory === 'Grains' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('Grains')}
                            style={{ borderColor: selectedCategory === 'Grains' ? 'var(--secondary-green)' : 'transparent' }}
                        >
                            <div className="category-icon">🌾</div>
                            <h3>Grains</h3>
                        </div>
                        <div
                            className={`category-card ${selectedCategory === 'Fruits & Vegetables' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('Fruits & Vegetables')}
                            style={{ borderColor: selectedCategory === 'Fruits & Vegetables' ? 'var(--secondary-green)' : 'transparent' }}
                        >
                            <div className="category-icon">🍎</div>
                            <h3>Fruits & Vegetables</h3>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="products-section">
                    <h2 className="section-title">{selectedCategory} Listings from Farmers</h2>
                    <div className="products-grid">
                        {productsData[selectedCategory]?.map((product) => (
                            <div className="product-card" key={product.id}>
                                <div className="product-image" style={{ backgroundColor: '#f5f1e8' }}>
                                    <div style={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '4rem'
                                    }}>
                                        {product.image}
                                    </div>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-farmer">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                        {product.farmer}
                                    </div>
                                    <div className="product-rating">
                                        <span className="stars">{'★'.repeat(Math.floor(product.rating))}{product.rating % 1 !== 0 ? '☆' : ''}</span>
                                        <span className="rating-count">({product.reviews})</span>
                                    </div>
                                    <div className="product-price">
                                        ₹ {product.price} <span>per kg</span>
                                    </div>
                                    <div className="product-actions">
                                        <button className="view-details-btn">View Details</button>
                                        <button className="favorite-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default BuyerDashboard;
