const express = require('express');
const router = express.Router();

// Comprehensive Demo data covering all major Indian states and districts
const DEMO_CROP_PRICES = [
    // Punjab
    { state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2050, max_price: 2150, modal_price: 2100 },
    { state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3500, max_price: 3800, modal_price: 3650 },
    { state: 'Punjab', district: 'Amritsar', market: 'Amritsar Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 2000, max_price: 2100, modal_price: 2050 },
    { state: 'Punjab', district: 'Amritsar', market: 'Amritsar Mandi', commodity: 'Rice', variety: 'Basmati 1121', arrival_date: new Date().toISOString().split('T')[0], min_price: 4000, max_price: 4200, modal_price: 4100 },
    { state: 'Punjab', district: 'Jalandhar', market: 'Jalandhar Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2040, max_price: 2140, modal_price: 2090 },
    { state: 'Punjab', district: 'Patiala', market: 'Patiala Mandi', commodity: 'Rice', variety: 'Pusa Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3600, max_price: 3900, modal_price: 3750 },

    // Haryana
    { state: 'Haryana', district: 'Karnal', market: 'Karnal Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 2000, max_price: 2100, modal_price: 2050 },
    { state: 'Haryana', district: 'Karnal', market: 'Karnal Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3550, max_price: 3850, modal_price: 3700 },
    { state: 'Haryana', district: 'Ambala', market: 'Ambala Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2030, max_price: 2130, modal_price: 2080 },
    { state: 'Haryana', district: 'Panipat', market: 'Panipat Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3500, max_price: 3800, modal_price: 3650 },
    { state: 'Haryana', district: 'Hisar', market: 'Hisar Mandi', commodity: 'Cotton', variety: 'Medium Staple', arrival_date: new Date().toISOString().split('T')[0], min_price: 5400, max_price: 5700, modal_price: 5550 },

    // Uttar Pradesh
    { state: 'Uttar Pradesh', district: 'Meerut', market: 'Meerut Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2020, max_price: 2120, modal_price: 2070 },
    { state: 'Uttar Pradesh', district: 'Meerut', market: 'Meerut Mandi', commodity: 'Rice', variety: 'Sona Masoori', arrival_date: new Date().toISOString().split('T')[0], min_price: 2800, max_price: 3000, modal_price: 2900 },
    { state: 'Uttar Pradesh', district: 'Agra', market: 'Agra Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 2010, max_price: 2110, modal_price: 2060 },
    { state: 'Uttar Pradesh', district: 'Lucknow', market: 'Lucknow Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3450, max_price: 3750, modal_price: 3600 },
    { state: 'Uttar Pradesh', district: 'Varanasi', market: 'Varanasi Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2000, max_price: 2100, modal_price: 2050 },
    { state: 'Uttar Pradesh', district: 'Kanpur', market: 'Kanpur Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 850, max_price: 1050, modal_price: 950 },

    // Maharashtra
    { state: 'Maharashtra', district: 'Nashik', market: 'Nashik Mandi', commodity: 'Tomato', variety: 'Hybrid', arrival_date: new Date().toISOString().split('T')[0], min_price: 1500, max_price: 2000, modal_price: 1750 },
    { state: 'Maharashtra', district: 'Nashik', market: 'Nashik Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1200, max_price: 1500, modal_price: 1350 },
    { state: 'Maharashtra', district: 'Pune', market: 'Pune Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1200, max_price: 1500, modal_price: 1350 },
    { state: 'Maharashtra', district: 'Pune', market: 'Pune Mandi', commodity: 'Tomato', variety: 'Hybrid', arrival_date: new Date().toISOString().split('T')[0], min_price: 1450, max_price: 1950, modal_price: 1700 },
    { state: 'Maharashtra', district: 'Mumbai', market: 'Mumbai Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 900, max_price: 1100, modal_price: 1000 },
    { state: 'Maharashtra', district: 'Nagpur', market: 'Nagpur Mandi', commodity: 'Cotton', variety: 'Medium Staple', arrival_date: new Date().toISOString().split('T')[0], min_price: 5500, max_price: 5800, modal_price: 5650 },
    { state: 'Maharashtra', district: 'Aurangabad', market: 'Aurangabad Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1150, max_price: 1450, modal_price: 1300 },

    // Karnataka
    { state: 'Karnataka', district: 'Bangalore', market: 'Bangalore Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 800, max_price: 1000, modal_price: 900 },
    { state: 'Karnataka', district: 'Bangalore', market: 'Bangalore Mandi', commodity: 'Tomato', variety: 'Hybrid', arrival_date: new Date().toISOString().split('T')[0], min_price: 1400, max_price: 1900, modal_price: 1650 },
    { state: 'Karnataka', district: 'Mysore', market: 'Mysore Mandi', commodity: 'Rice', variety: 'Sona Masoori', arrival_date: new Date().toISOString().split('T')[0], min_price: 2750, max_price: 2950, modal_price: 2850 },
    { state: 'Karnataka', district: 'Mangalore', market: 'Mangalore Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1250, max_price: 1550, modal_price: 1400 },
    { state: 'Karnataka', district: 'Hubli', market: 'Hubli Mandi', commodity: 'Cotton', variety: 'Medium Staple', arrival_date: new Date().toISOString().split('T')[0], min_price: 5450, max_price: 5750, modal_price: 5600 },

    // Gujarat
    { state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad Mandi', commodity: 'Cotton', variety: 'Medium Staple', arrival_date: new Date().toISOString().split('T')[0], min_price: 5500, max_price: 5800, modal_price: 5650 },
    { state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 2030, max_price: 2130, modal_price: 2080 },
    { state: 'Gujarat', district: 'Surat', market: 'Surat Mandi', commodity: 'Cotton', variety: 'Long Staple', arrival_date: new Date().toISOString().split('T')[0], min_price: 5600, max_price: 5900, modal_price: 5750 },
    { state: 'Gujarat', district: 'Rajkot', market: 'Rajkot Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1180, max_price: 1480, modal_price: 1330 },
    { state: 'Gujarat', district: 'Vadodara', market: 'Vadodara Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2040, max_price: 2140, modal_price: 2090 },

    // Rajasthan
    { state: 'Rajasthan', district: 'Jaipur', market: 'Jaipur Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 2010, max_price: 2110, modal_price: 2060 },
    { state: 'Rajasthan', district: 'Jaipur', market: 'Jaipur Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 820, max_price: 1020, modal_price: 920 },
    { state: 'Rajasthan', district: 'Jodhpur', market: 'Jodhpur Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2020, max_price: 2120, modal_price: 2070 },
    { state: 'Rajasthan', district: 'Kota', market: 'Kota Mandi', commodity: 'Cotton', variety: 'Medium Staple', arrival_date: new Date().toISOString().split('T')[0], min_price: 5400, max_price: 5700, modal_price: 5550 },
    { state: 'Rajasthan', district: 'Udaipur', market: 'Udaipur Mandi', commodity: 'Onion', variety: 'White', arrival_date: new Date().toISOString().split('T')[0], min_price: 1100, max_price: 1400, modal_price: 1250 },

    // Madhya Pradesh
    { state: 'Madhya Pradesh', district: 'Indore', market: 'Indore Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2025, max_price: 2125, modal_price: 2075 },
    { state: 'Madhya Pradesh', district: 'Indore', market: 'Indore Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1150, max_price: 1450, modal_price: 1300 },
    { state: 'Madhya Pradesh', district: 'Bhopal', market: 'Bhopal Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 2015, max_price: 2115, modal_price: 2065 },
    { state: 'Madhya Pradesh', district: 'Jabalpur', market: 'Jabalpur Mandi', commodity: 'Rice', variety: 'Sona Masoori', arrival_date: new Date().toISOString().split('T')[0], min_price: 2780, max_price: 2980, modal_price: 2880 },
    { state: 'Madhya Pradesh', district: 'Gwalior', market: 'Gwalior Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 830, max_price: 1030, modal_price: 930 },

    // Tamil Nadu
    { state: 'Tamil Nadu', district: 'Chennai', market: 'Chennai Mandi', commodity: 'Rice', variety: 'Sona Masoori', arrival_date: new Date().toISOString().split('T')[0], min_price: 2820, max_price: 3020, modal_price: 2920 },
    { state: 'Tamil Nadu', district: 'Chennai', market: 'Chennai Mandi', commodity: 'Tomato', variety: 'Hybrid', arrival_date: new Date().toISOString().split('T')[0], min_price: 1480, max_price: 1980, modal_price: 1730 },
    { state: 'Tamil Nadu', district: 'Coimbatore', market: 'Coimbatore Mandi', commodity: 'Rice', variety: 'Ponni', arrival_date: new Date().toISOString().split('T')[0], min_price: 2700, max_price: 2900, modal_price: 2800 },
    { state: 'Tamil Nadu', district: 'Madurai', market: 'Madurai Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1220, max_price: 1520, modal_price: 1370 },
    { state: 'Tamil Nadu', district: 'Salem', market: 'Salem Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 810, max_price: 1010, modal_price: 910 },

    // West Bengal
    { state: 'West Bengal', district: 'Kolkata', market: 'Kolkata Mandi', commodity: 'Rice', variety: 'Gobindobhog', arrival_date: new Date().toISOString().split('T')[0], min_price: 3200, max_price: 3500, modal_price: 3350 },
    { state: 'West Bengal', district: 'Kolkata', market: 'Kolkata Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 840, max_price: 1040, modal_price: 940 },
    { state: 'West Bengal', district: 'Siliguri', market: 'Siliguri Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3400, max_price: 3700, modal_price: 3550 },
    { state: 'West Bengal', district: 'Durgapur', market: 'Durgapur Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1170, max_price: 1470, modal_price: 1320 },

    // Andhra Pradesh
    { state: 'Andhra Pradesh', district: 'Vijayawada', market: 'Vijayawada Mandi', commodity: 'Rice', variety: 'Sona Masoori', arrival_date: new Date().toISOString().split('T')[0], min_price: 2850, max_price: 3050, modal_price: 2950 },
    { state: 'Andhra Pradesh', district: 'Vijayawada', market: 'Vijayawada Mandi', commodity: 'Tomato', variety: 'Hybrid', arrival_date: new Date().toISOString().split('T')[0], min_price: 1460, max_price: 1960, modal_price: 1710 },
    { state: 'Andhra Pradesh', district: 'Visakhapatnam', market: 'Visakhapatnam Mandi', commodity: 'Rice', variety: 'Ponni', arrival_date: new Date().toISOString().split('T')[0], min_price: 2720, max_price: 2920, modal_price: 2820 },
    { state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1190, max_price: 1490, modal_price: 1340 },

    // Telangana
    { state: 'Telangana', district: 'Hyderabad', market: 'Hyderabad Mandi', commodity: 'Rice', variety: 'Sona Masoori', arrival_date: new Date().toISOString().split('T')[0], min_price: 2830, max_price: 3030, modal_price: 2930 },
    { state: 'Telangana', district: 'Hyderabad', market: 'Hyderabad Mandi', commodity: 'Cotton', variety: 'Medium Staple', arrival_date: new Date().toISOString().split('T')[0], min_price: 5480, max_price: 5780, modal_price: 5630 },
    { state: 'Telangana', district: 'Warangal', market: 'Warangal Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3420, max_price: 3720, modal_price: 3570 },

    // Kerala
    { state: 'Kerala', district: 'Kochi', market: 'Kochi Mandi', commodity: 'Rice', variety: 'Jaya', arrival_date: new Date().toISOString().split('T')[0], min_price: 2900, max_price: 3100, modal_price: 3000 },
    { state: 'Kerala', district: 'Thiruvananthapuram', market: 'Thiruvananthapuram Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 860, max_price: 1060, modal_price: 960 },
    { state: 'Kerala', district: 'Kozhikode', market: 'Kozhikode Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1240, max_price: 1540, modal_price: 1390 },

    // Bihar
    { state: 'Bihar', district: 'Patna', market: 'Patna Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2005, max_price: 2105, modal_price: 2055 },
    { state: 'Bihar', district: 'Patna', market: 'Patna Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3380, max_price: 3680, modal_price: 3530 },
    { state: 'Bihar', district: 'Gaya', market: 'Gaya Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 1995, max_price: 2095, modal_price: 2045 },
    { state: 'Bihar', district: 'Muzaffarpur', market: 'Muzaffarpur Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 825, max_price: 1025, modal_price: 925 },

    // Odisha
    { state: 'Odisha', district: 'Bhubaneswar', market: 'Bhubaneswar Mandi', commodity: 'Rice', variety: 'Swarna', arrival_date: new Date().toISOString().split('T')[0], min_price: 2650, max_price: 2850, modal_price: 2750 },
    { state: 'Odisha', district: 'Cuttack', market: 'Cuttack Mandi', commodity: 'Rice', variety: 'Sona Masoori', arrival_date: new Date().toISOString().split('T')[0], min_price: 2750, max_price: 2950, modal_price: 2850 },
    { state: 'Odisha', district: 'Puri', market: 'Puri Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1160, max_price: 1460, modal_price: 1310 },

    // Jharkhand
    { state: 'Jharkhand', district: 'Ranchi', market: 'Ranchi Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3350, max_price: 3650, modal_price: 3500 },
    { state: 'Jharkhand', district: 'Jamshedpur', market: 'Jamshedpur Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 835, max_price: 1035, modal_price: 935 },

    // Chhattisgarh
    { state: 'Chhattisgarh', district: 'Raipur', market: 'Raipur Mandi', commodity: 'Rice', variety: 'Swarna', arrival_date: new Date().toISOString().split('T')[0], min_price: 2680, max_price: 2880, modal_price: 2780 },
    { state: 'Chhattisgarh', district: 'Bilaspur', market: 'Bilaspur Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 2000, max_price: 2100, modal_price: 2050 },

    // Assam
    { state: 'Assam', district: 'Guwahati', market: 'Guwahati Mandi', commodity: 'Rice', variety: 'Joha', arrival_date: new Date().toISOString().split('T')[0], min_price: 3100, max_price: 3400, modal_price: 3250 },
    { state: 'Assam', district: 'Dibrugarh', market: 'Dibrugarh Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 845, max_price: 1045, modal_price: 945 },

    // Uttarakhand
    { state: 'Uttarakhand', district: 'Dehradun', market: 'Dehradun Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2035, max_price: 2135, modal_price: 2085 },
    { state: 'Uttarakhand', district: 'Haridwar', market: 'Haridwar Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3430, max_price: 3730, modal_price: 3580 },

    // Himachal Pradesh
    { state: 'Himachal Pradesh', district: 'Shimla', market: 'Shimla Mandi', commodity: 'Potato', variety: 'Local', arrival_date: new Date().toISOString().split('T')[0], min_price: 880, max_price: 1080, modal_price: 980 },
    { state: 'Himachal Pradesh', district: 'Mandi', market: 'Mandi Mandi', commodity: 'Wheat', variety: 'Lokwan', arrival_date: new Date().toISOString().split('T')[0], min_price: 2025, max_price: 2125, modal_price: 2075 },

    // Jammu and Kashmir
    { state: 'Jammu and Kashmir', district: 'Srinagar', market: 'Srinagar Mandi', commodity: 'Rice', variety: 'Basmati', arrival_date: new Date().toISOString().split('T')[0], min_price: 3650, max_price: 3950, modal_price: 3800 },
    { state: 'Jammu and Kashmir', district: 'Jammu', market: 'Jammu Mandi', commodity: 'Wheat', variety: 'Sharbati', arrival_date: new Date().toISOString().split('T')[0], min_price: 2045, max_price: 2145, modal_price: 2095 },

    // Goa
    { state: 'Goa', district: 'Panaji', market: 'Panaji Mandi', commodity: 'Rice', variety: 'Jaya', arrival_date: new Date().toISOString().split('T')[0], min_price: 2920, max_price: 3120, modal_price: 3020 },
    { state: 'Goa', district: 'Margao', market: 'Margao Mandi', commodity: 'Onion', variety: 'Red', arrival_date: new Date().toISOString().split('T')[0], min_price: 1260, max_price: 1560, modal_price: 1410 }
];

// Cache for API results (to avoid hitting rate limits)
let cache = {
    data: null,
    timestamp: null,
    TTL: 5 * 60 * 1000 // 5 minutes
};

// GET /api/cropprices - Fetch crop prices
router.get('/', async (req, res) => {
    try {
        const { state, commodity } = req.query;

        // Check if we have valid cached data
        const now = Date.now();
        if (cache.data && cache.timestamp && (now - cache.timestamp < cache.TTL)) {
            let filteredData = cache.data;

            // Apply filters if provided
            if (state) {
                filteredData = filteredData.filter(item =>
                    item.state.toLowerCase().includes(state.toLowerCase())
                );
            }
            if (req.query.district) {
                filteredData = filteredData.filter(item =>
                    item.district.toLowerCase().includes(req.query.district.toLowerCase())
                );
            }
            if (commodity) {
                filteredData = filteredData.filter(item =>
                    item.commodity.toLowerCase().includes(commodity.toLowerCase())
                );
            }

            return res.json({
                success: true,
                data: filteredData,
                source: 'cache',
                timestamp: new Date(cache.timestamp).toISOString(),
                message: 'Data from cache'
            });
        }

        // Check if API key is configured
        const API_KEY = process.env.DATA_GOV_API_KEY;

        if (!API_KEY || API_KEY === 'your_api_key_here') {
            // Use demo data
            console.log('Using demo crop price data (no API key configured)');

            cache.data = DEMO_CROP_PRICES;
            cache.timestamp = now;

            let filteredData = DEMO_CROP_PRICES;

            if (state) {
                filteredData = filteredData.filter(item =>
                    item.state.toLowerCase().includes(state.toLowerCase())
                );
            }
            if (commodity) {
                filteredData = filteredData.filter(item =>
                    item.commodity.toLowerCase().includes(commodity.toLowerCase())
                );
            }

            return res.json({
                success: true,
                data: filteredData,
                source: 'demo',
                timestamp: new Date().toISOString(),
                message: 'Using demo data. Configure DATA_GOV_API_KEY in .env for real-time data.'
            });
        }

        // Fetch from Data.gov.in Agmarknet API
        // Resource ID for daily prices: 9ef84268-d588-465a-a308-a864a43d0070
        const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';
        const apiUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${API_KEY}&format=json&limit=100`;

        const fetch = (await import('node-fetch')).default;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const apiData = await response.json();

        // Transform API data to our format
        const transformedData = apiData.records?.map(record => ({
            state: record.state || 'N/A',
            district: record.district || 'N/A',
            market: record.market || 'N/A',
            commodity: record.commodity || 'N/A',
            variety: record.variety || 'N/A',
            arrival_date: record.arrival_date || new Date().toISOString().split('T')[0],
            min_price: parseFloat(record.min_price) || 0,
            max_price: parseFloat(record.max_price) || 0,
            modal_price: parseFloat(record.modal_price) || 0
        })) || [];

        // Update cache
        cache.data = transformedData;
        cache.timestamp = now;

        let filteredData = transformedData;

        if (state) {
            filteredData = filteredData.filter(item =>
                item.state.toLowerCase().includes(state.toLowerCase())
            );
        }
        if (commodity) {
            filteredData = filteredData.filter(item =>
                item.commodity.toLowerCase().includes(commodity.toLowerCase())
            );
        }

        res.json({
            success: true,
            data: filteredData,
            source: 'api',
            timestamp: new Date().toISOString(),
            message: 'Live data from Agmarknet'
        });

    } catch (error) {
        console.error('Error fetching crop prices:', error);

        // Fallback to demo data on error
        let filteredData = DEMO_CROP_PRICES;
        const { state, commodity } = req.query;

        if (state) {
            filteredData = filteredData.filter(item =>
                item.state.toLowerCase().includes(state.toLowerCase())
            );
        }
        if (commodity) {
            filteredData = filteredData.filter(item =>
                item.commodity.toLowerCase().includes(commodity.toLowerCase())
            );
        }

        res.json({
            success: true,
            data: filteredData,
            source: 'demo',
            timestamp: new Date().toISOString(),
            message: 'Using demo data due to API error',
            error: error.message
        });
    }
});

// GET /api/cropprices/states - Get all unique states
router.get('/states', async (req, res) => {
    try {
        const data = cache.data || DEMO_CROP_PRICES;
        const states = [...new Set(data.map(item => item.state))].sort();

        res.json({
            success: true,
            data: states
        });
    } catch (error) {
        res.json({
            success: true,
            data: [...new Set(DEMO_CROP_PRICES.map(item => item.state))].sort()
        });
    }
});

// GET /api/cropprices/districts - Get districts for a state
router.get('/districts', async (req, res) => {
    try {
        const { state } = req.query;
        if (!state) {
            return res.status(400).json({
                success: false,
                message: 'State parameter is required'
            });
        }

        const data = cache.data || DEMO_CROP_PRICES;
        const districts = [...new Set(
            data
                .filter(item => item.state === state)
                .map(item => item.district)
        )].sort();

        res.json({
            success: true,
            data: districts
        });
    } catch (error) {
        res.json({
            success: true,
            data: []
        });
    }
});

// GET /api/cropprices/commodities - Get commodities for a state and optionally district
router.get('/commodities', async (req, res) => {
    try {
        const { state, district } = req.query;
        if (!state) {
            return res.status(400).json({
                success: false,
                message: 'State parameter is required'
            });
        }

        const data = cache.data || DEMO_CROP_PRICES;
        let filteredData = data.filter(item => item.state === state);

        if (district) {
            filteredData = filteredData.filter(item => item.district === district);
        }

        const commodities = [...new Set(filteredData.map(item => item.commodity))].sort();

        res.json({
            success: true,
            data: commodities
        });
    } catch (error) {
        res.json({
            success: true,
            data: []
        });
    }
});

module.exports = router;
