import { createContext, useState, useContext, useEffect } from 'react';
import translations from '../utils/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    // Load language preference from localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('krishiseva_language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    // Save language preference to localStorage
    useEffect(() => {
        localStorage.setItem('krishiseva_language', language);
    }, [language]);

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
