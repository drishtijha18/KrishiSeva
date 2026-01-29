import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, Check } from 'lucide-react';
import axios from '../../config/axios';
import { getToken } from '../../utils/auth';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/orders.css';

const OrdersPage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [trackingOrder, setTrackingOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = getToken();
            const response = await axios.get('/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setShowCancelModal(true);
        setCancelReason('');
    };

    const confirmCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }

        setCancellingOrderId(selectedOrderId);

        try {
            const token = getToken();
            const response = await axios.post(
                `/api/orders/${selectedOrderId}/cancel`,
                { reason: cancelReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Update the order in the local state
                setOrders(orders.map(order =>
                    order.id === selectedOrderId
                        ? { ...order, status: 'cancelled', cancellationReason: cancelReason }
                        : order
                ));
                setShowCancelModal(false);
                setCancelReason('');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert(error.response?.data?.error || 'Failed to cancel order');
        } finally {
            setCancellingOrderId(null);
        }
    };

    const handleTrackOrder = (order) => {
        setTrackingOrder(order);
        setShowTrackingModal(true);
    };

    const getOrderTimeline = (order) => {
        const statuses = [
            {
                status: 'pending',
                label: t('orders.status.pending'),
                description: 'Your order has been placed successfully',
                icon: '📦',
                completed: true,
                timestamp: order.createdAt
            },
            {
                status: 'confirmed',
                label: t('orders.status.confirmed'),
                description: 'Seller has confirmed your order',
                icon: '✓',
                completed: ['confirmed', 'shipped', 'delivered'].includes(order.status),
                timestamp: order.updatedAt
            },
            {
                status: 'shipped',
                label: t('orders.status.shipped'),
                description: 'Your order is on the way',
                icon: '🚚',
                completed: ['shipped', 'delivered'].includes(order.status),
                timestamp: order.updatedAt
            },
            {
                status: 'delivered',
                label: t('orders.status.delivered'),
                description: 'Order delivered successfully',
                icon: '✅',
                completed: order.status === 'delivered',
                timestamp: order.updatedAt
            }
        ];

        if (order.status === 'cancelled') {
            return [{
                status: 'cancelled',
                label: t('orders.status.cancelled'),
                description: order.cancellationReason || 'Order was cancelled',
                icon: '❌',
                completed: true,
                timestamp: order.cancelledAt || order.updatedAt
            }];
        }

        return statuses;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f39c12',
            confirmed: '#3498db',
            shipped: '#9b59b6',
            delivered: '#2ecc71',
            cancelled: '#e74c3c'
        };
        return colors[status] || '#95a5a6';
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-container">
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-container">
                <div className="orders-header">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        {t('nav.dashboard')}
                    </button>
                    <h1>{t('orders.title')}</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <Package size={64} color="#e1e8ed" />
                        <h2>{t('orders.noOrders')}</h2>
                        <p>{t('orders.noOrdersMessage')}</p>
                        <button className="continue-shopping-btn" onClick={() => navigate('/dashboard')}>
                            {t('cart.startShopping')}
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">
                                        <span>{t('orders.orderId')}</span> {order.id}
                                    </div>
                                    <div className="order-date">
                                        {t('orders.placedOn')} {formatDate(order.createdAt)}
                                    </div>
                                    <div
                                        className={`order-status ${order.status}`}
                                        style={{
                                            backgroundColor: `${getStatusColor(order.status)}20`,
                                            color: getStatusColor(order.status),
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {order.status}
                                    </div>
                                </div>

                                <div className="order-content">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <div className="item-details">
                                                <h4>{item.productName} ({item.quantity} kg)</h4>
                                                <div className="item-meta">{t('dashboard.soldBy')} {item.farmerName}</div>
                                            </div>
                                            <div className="item-price">₹{item.totalPrice}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        {t('orders.totalAmount')} <span>₹{order.totalAmount}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {['pending', 'confirmed', 'shipped'].includes(order.status) && (
                                            <button
                                                className="track-btn"
                                                onClick={() => handleTrackOrder(order)}
                                            >
                                                {t('orders.trackOrder')}
                                            </button>
                                        )}
                                        {['pending', 'confirmed'].includes(order.status) && (
                                            <button
                                                className="cancel-btn"
                                                onClick={() => handleCancelOrder(order.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#fee',
                                                    color: '#e74c3c',
                                                    border: '1px solid #e74c3c',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#e74c3c';
                                                    e.target.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#fee';
                                                    e.target.style.color = '#e74c3c';
                                                }}
                                            >
                                                {t('orders.cancelOrder')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{t('orders.cancelOrder')}</h2>
                        <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
                            Are you sure you want to cancel this order?
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter cancellation reason..."
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #e1e8ed',
                                fontSize: '0.95rem',
                                resize: 'vertical',
                                marginBottom: '1.5rem'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason('');
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#ecf0f1',
                                    color: '#2c3e50',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: '500'
                                }}
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                disabled={cancellingOrderId !== null}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: cancellingOrderId ? 'not-allowed' : 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    opacity: cancellingOrderId ? 0.6 : 1
                                }}
                            >
                                {cancellingOrderId ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Tracking Modal */}
            {showTrackingModal && trackingOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Track Order</h2>
                            <button
                                onClick={() => setShowTrackingModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#7f8c8d'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Order Info */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Order ID:</strong> {trackingOrder.id}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Total Amount:</strong> ₹{trackingOrder.totalAmount}
                            </div>
                            <div>
                                <strong>Delivery Address:</strong> {trackingOrder.deliveryAddress.street}, {trackingOrder.deliveryAddress.city}, {trackingOrder.deliveryAddress.state} - {trackingOrder.deliveryAddress.pincode}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
                            {getOrderTimeline(trackingOrder).map((step, index, array) => (
                                <div key={step.status} style={{ position: 'relative', paddingBottom: '2rem' }}>
                                    {/* Timeline Line */}
                                    {index < array.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '-1.75rem',
                                            top: '2.5rem',
                                            width: '2px',
                                            height: 'calc(100% - 1.5rem)',
                                            backgroundColor: step.completed ? '#2ecc71' : '#e1e8ed'
                                        }} />
                                    )}

                                    {/* Timeline Node */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-2.25rem',
                                        top: '0',
                                        width: '3rem',
                                        height: '3rem',
                                        borderRadius: '50%',
                                        backgroundColor: step.completed ? '#2ecc71' : '#e1e8ed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        border: '3px solid white',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        {step.icon}
                                    </div>

                                    {/* Step Content */}
                                    <div style={{
                                        backgroundColor: step.completed ? '#eafaf1' : '#f8f9fa',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: `2px solid ${step.completed ? '#2ecc71' : '#e1e8ed'}`
                                    }}>
                                        <div style={{
                                            fontWeight: '600',
                                            color: step.completed ? '#27ae60' : '#7f8c8d',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {step.label}
                                        </div>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            color: '#7f8c8d',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {step.description}
                                        </div>
                                        {step.completed && step.timestamp && (
                                            <div style={{
                                                fontSize: '0.85rem',
                                                color: '#95a5a6'
                                            }}>
                                                {formatDate(step.timestamp)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Items Summary */}
                        <div style={{
                            marginTop: '2rem',
                            borderTop: '1px solid #e1e8ed',
                            paddingTop: '1.5rem'
                        }}>
                            <h3 style={{ marginBottom: '1rem', color: '#2c3e50', fontSize: '1.1rem' }}>Order Items</h3>
                            {trackingOrder.items.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '6px',
                                    marginBottom: '0.5rem'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '500', color: '#2c3e50' }}>
                                            {item.productName} ({item.quantity} kg)
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                                            by {item.farmerName}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '600', color: '#27ae60' }}>
                                        ₹{item.totalPrice}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
