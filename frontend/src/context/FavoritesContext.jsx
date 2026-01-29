import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from localStorage on init
    useEffect(() => {
        const savedFavorites = localStorage.getItem('krishiseva_favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('krishiseva_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (product) => {
        setFavorites(prev => {
            if (prev.find(item => item.id === product.id)) {
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromFavorites = (productId) => {
        setFavorites(prev => prev.filter(item => item.id !== productId));
    };

    const isFavorite = (productId) => {
        return favorites.some(item => item.id === productId);
    };

    const toggleFavorite = (product) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addToFavorites,
            removeFromFavorites,
            isFavorite,
            toggleFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};
