import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import '../../styles/favorites.css';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const { favorites, removeFromFavorites } = useFavorites();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
        // Optional: Show success message
    };

    if (favorites.length === 0) {
        return (
            <div className="favorites-page">
                <div className="favorites-container">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        Back to Shop
                    </button>
                    <div className="empty-favorites">
                        <Heart size={64} color="#e1e8ed" />
                        <h2>No favorites yet</h2>
                        <p>Save items you love to find them easily later.</p>
                        <button className="continue-shopping-btn" onClick={() => navigate('/dashboard')}>
                            Explore Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="favorites-container">
                <div className="favorites-header">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        Back to Shop
                    </button>
                    <h1>My Wishlist ({favorites.length})</h1>
                </div>

                <div className="favorites-grid">
                    {favorites.map(item => (
                        <div key={item.id} className="favorite-card">
                            <div className="product-image">
                                {/* Placeholder for product image */}
                                <span style={{ fontSize: '3rem' }}>{item.image || '🌾'}</span>
                            </div>
                            <div className="product-info">
                                <div className="product-rating">
                                    <div className="stars">
                                        <Star size={16} fill="#ffc107" stroke="#ffc107" />
                                        <span>4.5</span>
                                    </div>
                                    <span className="rating-count">(120 Reviews)</span>
                                </div>
                                <h3 className="product-name">{item.name}</h3>
                                <p className="product-farmer">by {item.farmer}</p>
                                <div className="product-price">
                                    ₹{item.price}<span>/{item.unit}</span>
                                </div>
                                <div className="product-actions">
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>
                                    <button
                                        className="remove-favorite-btn"
                                        onClick={() => removeFromFavorites(item.id)}
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;
