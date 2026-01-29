// Profile Page Component - With Photo Upload
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { getToken, logout, getUserData } from '../../utils/auth';
import { User, Phone, MapPin, ArrowLeft, Save, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/profile.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
        },
        profilePhoto: '',
    });

    const [photoPreview, setPhotoPreview] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = getToken();
            const response = await axios.get('/api/auth/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setUser(response.data.user);
                setFormData({
                    phone: response.data.user.phone || '',
                    address: response.data.user.address || {
                        street: '',
                        city: '',
                        state: '',
                        pincode: '',
                    },
                    profilePhoto: response.data.user.profilePhoto || '',
                });
                setPhotoPreview(response.data.user.profilePhoto || '');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file' });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
            return;
        }

        // Create image preview and resize
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Resize to 200x200
                canvas.width = 200;
                canvas.height = 200;

                ctx.drawImage(img, 0, 0, 200, 200);
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);

                setPhotoPreview(resizedBase64);
                setFormData({ ...formData, profilePhoto: resizedBase64 });
            };
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setSaving(true);

        try {
            const token = getToken();
            const response = await axios.put('/api/auth/profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setUser(response.data.user);
                setMessage({ type: 'success', text: t('profile.success') });

                // Update local storage
                const userData = getUserData();
                if (userData) {
                    localStorage.setItem('user', JSON.stringify({ ...userData, ...response.data.user }));
                }

                // Refresh page after 1 second to update sidebar photo
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || t('profile.error')
            });
        } finally {
            setSaving(false);
        }
    };

    const getProfileCompletion = () => {
        let completed = 2; // name and email
        const total = 7;

        if (formData.phone) completed++;
        if (formData.address.street) completed++;
        if (formData.address.city) completed++;
        if (formData.address.state) completed++;
        if (formData.address.pincode) completed++;

        return Math.round((completed / total) * 100);
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="spinner"></div>
            </div>
        );
    }

    const profileCompletion = getProfileCompletion();
    const isProfileComplete = user?.profileCompleted || false;
    const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Header */}
                <div className="profile-header">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        {t('nav.dashboard')}
                    </button>
                    <h1>{t('profile.title')}</h1>
                    <p className="profile-subtitle">{t('profile.subtitle')}</p>
                </div>

                {/* Profile Photo Section */}
                <div className="profile-photo-section">
                    <div className="photo-preview">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile" />
                        ) : (
                            <div className="photo-placeholder">{userInitial}</div>
                        )}
                    </div>
                    <div className="photo-upload-btn">
                        <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                        <label htmlFor="photo-upload">
                            <Camera size={20} />
                            {photoPreview ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                        </label>
                    </div>
                </div>

                {/* Profile Completion */}
                <div className={`profile-completion ${isProfileComplete ? 'complete' : 'incomplete'}`}>
                    <div className="completion-header">
                        {isProfileComplete ? (
                            <CheckCircle size={24} color="#27ae60" />
                        ) : (
                            <AlertCircle size={24} color="#f39c12" />
                        )}
                        <div>
                            <h3>{isProfileComplete ? t('profile.complete') : t('profile.incomplete')}</h3>
                            <p>
                                {isProfileComplete
                                    ? t('profile.completeMsg')
                                    : t('profile.incompleteMsg')}
                            </p>
                        </div>
                    </div>
                    <div className="completion-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${profileCompletion}%` }}></div>
                        </div>
                        <span className="progress-text">{profileCompletion}% Complete</span>
                    </div>
                </div>

                {/* Message Display */}
                {message.text && (
                    <div className={`profile-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="profile-form">
                    {/* Personal Information */}
                    <div className="form-section">
                        <div className="section-header">
                            <User size={20} />
                            <h2>{t('profile.personalInfo')}</h2>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>{t('checkout.fullName')}</label>
                                <input type="text" value={user?.name || ''} disabled />
                                <span className="field-note">{t('profile.nameNote')}</span>
                            </div>
                            <div className="form-group">
                                <label>{t('profile.email')}</label>
                                <input type="email" value={user?.email || ''} disabled />
                                <span className="field-note">{t('profile.emailNote')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="form-section">
                        <div className="section-header">
                            <Phone size={20} />
                            <h2>{t('profile.contactInfo')}</h2>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">{t('checkout.phone')} *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength="10"
                                pattern="[6-9][0-9]{9}"
                            />
                            <span className="field-note">{t('profile.phoneNote')}</span>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="form-section">
                        <div className="section-header">
                            <MapPin size={20} />
                            <h2>{t('checkout.deliveryAddress')}</h2>
                        </div>
                        <div className="form-group">
                            <label htmlFor="street">{t('checkout.street')} *</label>
                            <input
                                type="text"
                                id="street"
                                name="address.street"
                                placeholder="House number, building name, street"
                                value={formData.address.street}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="city">{t('checkout.city')} *</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="address.city"
                                    placeholder="City name"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">{t('checkout.state')} *</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="address.state"
                                    placeholder="State name"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pincode">{t('checkout.pincode')} *</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="address.pincode"
                                    placeholder="6-digit pincode"
                                    value={formData.address.pincode}
                                    onChange={handleChange}
                                    maxLength="6"
                                    pattern="[0-9]{6}"
                                />
                            </div>
                        </div>
                        <span className="field-note">{t('profile.addressNote')}</span>
                    </div>

                    {/* Save Button */}
                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? (
                                <>
                                    <span className="spinner-sm"></span>
                                    {t('common.loading')}
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    {t('profile.saveChanges')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
