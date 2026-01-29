// Buyer Dashboard Component
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { getToken, logout, getUserData } from '../../utils/auth';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/dashboard.css';
import '../../styles/dashboard-theme.css';

// DEMO MODE: Set to true to preview UI without backend
const DEMO_MODE = false;  // Real authentication enabled!

const BuyerDashboard = () => {
    const navigate = useNavigate();
    const { addToCart, getCartCount } = useCart();
    const { toggleFavorite, isFavorite, favorites } = useFavorites();
    const { language, setLanguage, t } = useLanguage();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);

    // Search, Filter, and Sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name'); // name, price-low, price-high
    const [priceRange, setPriceRange] = useState([0, 200]);

    // All products combined
    const allProducts = [
        { id: 1, name: 'Sharbati Wheat', farmer: 'Farmer Ramesh', rating: 4.8, reviews: 150, price: 40, unit: 'kg', image: '🌾', category: 'Wheat' },
        { id: 2, name: 'Lokwan Wheat', farmer: 'Farmer Suresh', rating: 4.5, reviews: 85, price: 35, unit: 'kg', image: '🌾', category: 'Wheat' },
        { id: 3, name: 'Khapli Wheat', farmer: 'Farmer Mahesh', rating: 4.9, reviews: 200, price: 65, unit: 'kg', image: '🌾', category: 'Wheat' },
        { id: 4, name: 'Durum Wheat', farmer: 'Farmer Dinesh', rating: 4.6, reviews: 120, price: 45, unit: 'kg', image: '🌾', category: 'Wheat' },
        { id: 5, name: 'Organic Basmati Rice', farmer: 'Farmer Rajesh', rating: 5.0, reviews: 120, price: 60, unit: 'kg', image: '🍚', category: 'Rice' },
        { id: 6, name: 'Sona Masoori Rice', farmer: 'Farmer Anita', rating: 5.0, reviews: 95, price: 50, unit: 'kg', image: '🍚', category: 'Rice' },
        { id: 7, name: 'Premium Jasmine Rice', farmer: 'Farmer Suresh', rating: 4.0, reviews: 80, price: 70, unit: 'kg', image: '🍚', category: 'Rice' },
        { id: 8, name: 'Brown Rice', farmer: 'Farmer Mohan', rating: 5.0, reviews: 60, price: 55, unit: 'kg', image: '🍚', category: 'Rice' },
        { id: 9, name: 'Yellow Maize', farmer: 'Farmer Hitesh', rating: 4.7, reviews: 90, price: 25, unit: 'kg', image: '🌽', category: 'Grains' },
        { id: 10, name: 'Pearl Millet (Bajra)', farmer: 'Farmer Ganesh', rating: 4.4, reviews: 70, price: 30, unit: 'kg', image: '🌽', category: 'Grains' },
        { id: 11, name: 'Sorghum (Jowar)', farmer: 'Farmer Vignesh', rating: 4.6, reviews: 55, price: 40, unit: 'kg', image: '🌽', category: 'Grains' },
        { id: 12, name: 'Finger Millet (Ragi)', farmer: 'Farmer Lakshmi', rating: 4.9, reviews: 110, price: 50, unit: 'kg', image: '🌽', category: 'Grains' },
        { id: 13, name: 'Fresh Potatoes', farmer: 'Farmer Raju', rating: 4.5, reviews: 300, price: 20, unit: 'kg', image: '🥔', category: 'Vegetables' },
        { id: 14, name: 'Red Onions', farmer: 'Farmer Ramu', rating: 4.3, reviews: 250, price: 25, unit: 'kg', image: '🧅', category: 'Vegetables' },
        { id: 15, name: 'Organic Tomatoes', farmer: 'Farmer Sita', rating: 4.8, reviews: 180, price: 30, unit: 'kg', image: '🍅', category: 'Vegetables' },
        { id: 16, name: 'Green Apples', farmer: 'Farmer Vijay', rating: 4.7, reviews: 140, price: 120, unit: 'kg', image: '🍏', category: 'Fruits' }
    ];

    const categories = ['All', 'Wheat', 'Rice', 'Grains', 'Vegetables', 'Fruits'];

    // Filter and sort products
    const getFilteredProducts = () => {
        let filtered = allProducts;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.farmer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Price range filter
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Sorting
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        return filtered;
    };

    // Fetch user data from backend on component mount
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

    const handleAddToCart = (product) => {
        setAddingToCart(product.id);
        addToCart(product);
        setTimeout(() => setAddingToCart(null), 500); // Visual feedback
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
    const cartCount = getCartCount();

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
                    <button className="profile-btn" onClick={() => navigate('/profile')} style={{ all: 'unset', width: '100%', cursor: 'pointer', textAlign: 'center' }}>
                        <div className="profile-avatar">
                            {user?.profilePhoto ? (
                                <img src={user.profilePhoto} alt="Profile" style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%'
                                }} />
                            ) : (
                                userInitial
                            )}
                        </div>
                        <div className="profile-name">{user?.name || 'Buyer'}</div>
                        <div className="profile-email">{user?.email || ''}</div>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                        {t('nav.dashboard')}
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                        {t('nav.orders')}
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                        {t('nav.cart')}
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/favorites'); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {t('nav.favorites')}
                        {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        {t('nav.profile')}
                    </a>
                </nav>

                {/* Logout Button */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        {t('nav.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                {/* Welcome Header */}
                <div className="dashboard-header">
                    <div className="welcome-message">
                        <h1>{t('dashboard.welcome')}, {user?.name?.split(' ')[0] || 'Buyer'}! 🌾</h1>
                        <p>{t('dashboard.explore')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {/* Language Selector */}
                        <select
                            className="language-selector"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            style={{
                                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.625rem 1rem',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <option value="en">🌐 English</option>
                            <option value="hi">🇮 N हिंदी</option>
                            <option value="ta">🇮🇳 தமிழ்</option>
                            <option value="te">🇮🇳 తెలుగు</option>
                        </select>

                        {/* Bell Button */}
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
                                minWidth: '50px', // Prevent shrinking
                                minHeight: '50px', // Prevent shrinking
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                padding: 0 // Remove any padding
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
                            <span className="notification-dot"></span>
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <section className="search-filter-section" style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        gap: '1rem',
                        marginBottom: '1rem',
                        alignItems: 'center'
                    }}>
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '0.875rem 1.25rem',
                                fontSize: '1rem',
                                border: '2px solid #e1e8ed',
                                borderRadius: '12px',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-green)'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
                        />

                        {/* Category Filter Dropdown */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                padding: '0.875rem 1rem',
                                border: '2px solid #e1e8ed',
                                borderRadius: '12px',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                minWidth: '150px'
                            }}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'All' ? t('common.all') : t(`categories.${category.toLowerCase()}`)}
                                </option>
                            ))}
                        </select>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '0.875rem 1rem',
                                border: '2px solid #e1e8ed',
                                borderRadius: '12px',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                minWidth: '180px'
                            }}
                        >
                            <option value="name">{t('sort.name')}</option>
                            <option value="price-low">{t('sort.priceLow')}</option>
                            <option value="price-high">{t('sort.priceHigh')}</option>
                            <option value="rating">{t('sort.rating')}</option>
                        </select>
                    </div>

                    {/* Results Count */}
                    <div style={{
                        color: '#7f8c8d',
                        fontSize: '0.9rem'
                    }}>
                        {t('common.showing')} {getFilteredProducts().length} {t('common.of')} {allProducts.length} {t('common.products')}
                    </div>
                </section>

                {/* Products Section */}
                <section className="products-section">
                    <div className="products-grid">
                        {getFilteredProducts().length === 0 ? (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#7f8c8d'
                            }}>
                                <h3>{t('common.noproducts')}</h3>
                                <p>{t('common.tryagain')}</p>
                            </div>
                        ) : (
                            getFilteredProducts().map((product) => (
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
                                            {t('dashboard.soldBy')} {product.farmer}
                                        </div>
                                        <div className="product-rating">
                                            <span className="stars">{'★'.repeat(Math.floor(product.rating))}{product.rating % 1 !== 0 ? '☆' : ''}</span>
                                            <span className="rating-count">({product.reviews})</span>
                                        </div>
                                        <div className="product-price">
                                            ₹ {product.price} <span>{t('dashboard.perKg')}</span>
                                        </div>
                                        <div className="product-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={addingToCart === product.id}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}>
                                                    <circle cx="9" cy="21" r="1"></circle>
                                                    <circle cx="20" cy="21" r="1"></circle>
                                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                </svg>
                                                {addingToCart === product.id ? t('dashboard.added') : t('dashboard.addToCart')}
                                            </button>
                                            <button
                                                className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''}`}
                                                onClick={() => toggleFavorite(product)}
                                                style={{
                                                    padding: '0.625rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e1e8ed',
                                                    background: isFavorite(product.id) ? '#ffebee' : 'white',
                                                    cursor: 'pointer',
                                                    color: isFavorite(product.id) ? '#e74c3c' : '#7f8c8d',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default BuyerDashboard;
