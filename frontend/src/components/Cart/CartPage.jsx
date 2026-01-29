import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import '../../styles/cart.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { t } = useLanguage();

    const handleCheckout = () => {
        if (cart.length === 0) return;
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        {t('cart.backToShop')}
                    </button>
                    <div className="empty-cart">
                        <ShoppingBag size={64} color="#e1e8ed" />
                        <h2>{t('cart.empty')}</h2>
                        <p>{t('cart.emptyMessage')}</p>
                        <button className="continue-shopping-btn" onClick={() => navigate('/dashboard')}>
                            {t('cart.startShopping')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        {t('cart.backToShop')}
                    </button>
                    <h1>{t('cart.myCart')} ({cart.length} {t('cart.items')})</h1>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-farmer">{t('dashboard.soldBy')}: {item.farmer}</p>
                                    <p className="item-price">₹{item.price}/{item.unit}</p>
                                </div>
                                <div className="item-controls">
                                    <div className="quantity-control">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="item-total">
                                        ₹{item.price * item.quantity}
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                        title="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>{t('cart.orderSummary')}</h2>
                        <div className="summary-row">
                            <span>{t('cart.subtotal')}</span>
                            <span>₹{getCartTotal()}</span>
                        </div>
                        <div className="summary-row">
                            <span>{t('cart.delivery')}</span>
                            <span>{t('cart.free')}</span>
                        </div>
                        <div className="summary-row total">
                            <span>{t('cart.total')}</span>
                            <span>₹{getCartTotal()}</span>
                        </div>
                        <button className="place-order-btn" onClick={handleCheckout}>
                            {t('cart.checkout')}
                        </button>
                        <button className="continue-shopping-btn" onClick={() => navigate('/dashboard')}>
                            {t('cart.continueShopping')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
