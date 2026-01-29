// Crop Prices Component - Display real-time mandi prices with cascading filters
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import '../../styles/cropprices.css';

const CropPrices = () => {
    const navigate = useNavigate();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cascading filter states
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommodity, setSelectedCommodity] = useState('');

    // Available options for each dropdown
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [commodities, setCommodities] = useState([]);

    const [apiInfo, setApiInfo] = useState({
        source: 'demo',
        timestamp: '',
        message: ''
    });

    // Commodity icons mapping
    const commodityIcons = {
        'Wheat': '🌾',
        'Rice': '🍚',
        'Cotton': '🌱',
        'Tomato': '🍅',
        'Onion': '🧅',
        'Potato': '🥔',
        'default': '🌾'
    };

    // Fetch all states on component mount
    useEffect(() => {
        fetchStates();
        fetchCropPrices(); // Initial load with all data
    }, []);

    const fetchStates = async () => {
        try {
            const response = await axios.get('/api/cropprices/states');
            if (response.data.success) {
                setStates(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const fetchDistricts = async (state) => {
        try {
            const response = await axios.get('/api/cropprices/districts', {
                params: { state }
            });
            if (response.data.success) {
                setDistricts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchCommodities = async (state, district = null) => {
        try {
            const params = { state };
            if (district) params.district = district;

            const response = await axios.get('/api/cropprices/commodities', { params });
            if (response.data.success) {
                setCommodities(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    };

    const fetchCropPrices = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedState) params.state = selectedState;
            if (selectedDistrict) params.district = selectedDistrict;
            if (selectedCommodity) params.commodity = selectedCommodity;

            const response = await axios.get('/api/cropprices', { params });

            if (response.data.success) {
                setPrices(response.data.data);
                setApiInfo({
                    source: response.data.source,
                    timestamp: response.data.timestamp,
                    message: response.data.message
                });
            }
        } catch (error) {
            console.error('Error fetching crop prices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);

        // Reset dependent filters
        setSelectedDistrict('');
        setSelectedCommodity('');
        setDistricts([]);
        setCommodities([]);

        if (state) {
            fetchDistricts(state);
            fetchCommodities(state); // Fetch commodities for the selected state
        }
    };

    const handleDistrictChange = (e) => {
        const district = e.target.value;
        setSelectedDistrict(district);

        // Reset commodity filter
        setSelectedCommodity('');
        setCommodities([]);

        if (selectedState) {
            fetchCommodities(selectedState, district || null);
        }
    };

    const handleCommodityChange = (e) => {
        setSelectedCommodity(e.target.value);
    };

    const handleApplyFilters = () => {
        fetchCropPrices();
    };

    const handleClearFilters = () => {
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedCommodity('');
        setDistricts([]);
        setCommodities([]);
        setTimeout(() => fetchCropPrices(), 100);
    };

    const getCommodityIcon = (commodity) => {
        return commodityIcons[commodity] || commodityIcons['default'];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="crop-prices-container">
            {/* Header */}
            <div className="crop-prices-header">
                <h1>🔔 Crop Price Updates</h1>
                <p>Real-time mandi prices from across India</p>
            </div>

            {/* Main Content */}
            <div className="crop-prices-content">
                {/* Back Button */}
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    Back to Dashboard
                </button>

                {/* Info Banner */}
                <div className={`info-banner ${apiInfo.source}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <div className="info-banner-content">
                        <strong>{apiInfo.message}</strong>
                        {apiInfo.timestamp && (
                            <small>Last updated: {formatDate(apiInfo.timestamp)}</small>
                        )}
                    </div>
                </div>

                {/* Cascading Filters */}
                <div className="filters-section">
                    <h3 style={{ marginBottom: '1rem', color: '#2c3e50', fontSize: '1.1rem' }}>
                        🔍 Filter Prices Step by Step
                    </h3>
                    <div className="filters-grid">
                        {/* Step 1: State */}
                        <div className="filter-group">
                            <label htmlFor="state">
                                <span className="step-badge">1</span> Select State
                            </label>
                            <select
                                id="state"
                                name="state"
                                value={selectedState}
                                onChange={handleStateChange}
                                style={{
                                    padding: '0.75rem',
                                    border: '2px solid #e1e8ed',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">-- Choose State --</option>
                                {states.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        {/* Step 2: District (only shown when state is selected) */}
                        {selectedState && (
                            <div className="filter-group">
                                <label htmlFor="district">
                                    <span className="step-badge">2</span> Select District
                                </label>
                                <select
                                    id="district"
                                    name="district"
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedState}
                                    style={{
                                        padding: '0.75rem',
                                        border: '2px solid #e1e8ed',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">-- All Districts --</option>
                                    {districts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Step 3: Commodity (only shown when state is selected) */}
                        {selectedState && (
                            <div className="filter-group">
                                <label htmlFor="commodity">
                                    <span className="step-badge">3</span> Select Commodity
                                </label>
                                <select
                                    id="commodity"
                                    name="commodity"
                                    value={selectedCommodity}
                                    onChange={handleCommodityChange}
                                    disabled={!selectedState}
                                    style={{
                                        padding: '0.75rem',
                                        border: '2px solid #e1e8ed',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">-- All Commodities --</option>
                                    {commodities.map(commodity => (
                                        <option key={commodity} value={commodity}>{commodity}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="filter-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <button
                                onClick={handleApplyFilters}
                                disabled={!selectedState}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    backgroundColor: selectedState ? 'var(--primary-green, #2ecc71)' : '#95a5a6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: selectedState ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={handleClearFilters}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    backgroundColor: '#7f8c8d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Loading crop prices...</p>
                    </div>
                )}

                {/* Prices Grid */}
                {!loading && prices.length > 0 && (
                    <div className="prices-grid">
                        {prices.map((item, index) => (
                            <div className="price-card" key={index}>
                                <div className="price-card-header">
                                    <div className="commodity-info">
                                        <h3>{item.commodity}</h3>
                                        <div className="variety">{item.variety}</div>
                                    </div>
                                    <div className="commodity-icon">
                                        {getCommodityIcon(item.commodity)}
                                    </div>
                                </div>

                                <div className="price-details">
                                    <div className="price-row">
                                        <span className="price-label">Min Price</span>
                                        <span className="price-value">₹{item.min_price}/q</span>
                                    </div>
                                    <div className="price-row modal">
                                        <span className="price-label">Modal Price</span>
                                        <span className="price-value">₹{item.modal_price}/q</span>
                                    </div>
                                    <div className="price-row">
                                        <span className="price-label">Max Price</span>
                                        <span className="price-value">₹{item.max_price}/q</span>
                                    </div>
                                </div>

                                <div className="location-info">
                                    <div className="location-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        {item.market}, {item.district}
                                    </div>
                                    <div className="location-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                        </svg>
                                        {item.state}
                                    </div>
                                    <div className="date-badge">
                                        📅 {formatDate(item.arrival_date)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && prices.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <h3>No Price Data Found</h3>
                        <p>Try adjusting your filters or check back later for updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropPrices;
