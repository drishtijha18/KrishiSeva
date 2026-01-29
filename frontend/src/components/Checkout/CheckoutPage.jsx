import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import axios from '../../config/axios';
import { getToken } from '../../utils/auth';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/checkout.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        notes: ''
    });

    // Fetch user data to pre-fill form
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getToken();
                const response = await axios.get('/api/auth/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success && response.data.user) {
                    const user = response.data.user;
                    setFormData(prev => ({
                        ...prev,
                        name: user.name || '',
                        phone: user.phone || '',
                        street: user.address?.street || '',
                        city: user.address?.city || '',
                        state: user.address?.state || '',
                        pincode: user.address?.pincode || ''
                    }));
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };

        fetchUserData();
    }, []);

    if (cart.length === 0 && step === 1) {
        navigate('/cart');
        return null;
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.phone.trim()) return 'Phone number is required';
        if (!formData.street.trim()) return 'Street address is required';
        if (!formData.city.trim()) return 'City is required';
        if (!formData.state.trim()) return 'State is required';
        if (!formData.pincode.trim()) return 'Pincode is required';
        if (formData.phone.length < 10) return 'Phone number must be at least 10 digits';
        return null;
    };

    const handlePlaceOrder = async () => {
        // Validate form
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = getToken();

            // Prepare order data matching backend expectations
            const orderData = {
                items: cart.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    pricePerKg: item.price, // Using price as pricePerKg
                    farmerName: item.farmer
                })),
                deliveryAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    phone: formData.phone
                },
                notes: formData.notes || ''
            };

            const response = await axios.post('/api/orders', orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setLoading(false);
                setStep(3); // Success step
                clearCart();
            }
        } catch (err) {
            setLoading(false);
            console.error('Order creation error:', err);

            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to place order. Please try again.');
            }
        }
    };

    if (step === 3) {
        return (
            <div className="checkout-page">
                <div className="checkout-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                    <CheckCircle size={80} color="#2ecc71" style={{ marginBottom: '1rem' }} />
                    <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>{t('checkout.success.title')}</h1>
                    <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
                        {t('checkout.success.message')}
                    </p>
                    <button
                        className="place-order-btn"
                        style={{ maxWidth: '300px', margin: '0 auto' }}
                        onClick={() => navigate('/orders')}
                    >
                        {t('checkout.success.viewOrders')}
                    </button>
                    <button
                        className="continue-shopping-btn"
                        style={{ maxWidth: '300px', margin: '1rem auto' }}
                        onClick={() => navigate('/dashboard')}
                    >
                        {t('checkout.success.continueShopping')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <button className="back-btn" onClick={() => navigate('/cart')}>
                        <ArrowLeft size={20} />
                        {t('checkout.backToCart')}
                    </button>
                    <h1>{t('checkout.title')}</h1>
                </div>

                <div className="checkout-content">
                    <div className="checkout-forms">
                        {/* Delivery Address */}
                        <div className="form-section">
                            <div className="section-header">
                                <Truck size={24} />
                                <h2>{t('checkout.deliveryAddress')}</h2>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('checkout.fullName')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('checkout.phoneNumber')}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+91 9876543210"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>{t('checkout.streetAddress')}</label>
                                    <input
                                        type="text"
                                        name="street"
                                        placeholder="123, Green Street, Farmville"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('checkout.city')}</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="Pune"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('checkout.state')}</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="Maharashtra"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('checkout.pincode')}</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        placeholder="411001"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>{t('checkout.deliveryNotes')}</label>
                                    <textarea
                                        name="notes"
                                        placeholder="Any special instructions for delivery..."
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e1e8ed' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="form-section">
                            <div className="section-header">
                                <CreditCard size={24} />
                                <h2>{t('checkout.paymentMethod.title')}</h2>
                            </div>
                            <div className="payment-methods">
                                <div className="payment-method-card active">
                                    <h3>Cash on Delivery</h3>
                                    <p>Pay upon delivery</p>
                                </div>
                                <div className="payment-method-card">
                                    <h3>UPI</h3>
                                    <p>Google Pay / PhonePe</p>
                                </div>
                                <div className="payment-method-card">
                                    <h3>Card</h3>
                                    <p>Credit / Debit Card</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="checkout-summary">
                        <h2>{t('checkout.summary.title')}</h2>
                        <div className="summary-items">
                            {cart.map(item => (
                                <div key={item.id} className="summary-item">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-total">
                            <span>{t('checkout.summary.totalAmount')}</span>
                            <span>₹{getCartTotal()}</span>
                        </div>
                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#fee',
                                border: '1px solid #fcc',
                                borderRadius: '8px',
                                color: '#c33',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}
                        <button
                            className="place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? t('checkout.summary.processing') : t('checkout.summary.placeOrder')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
