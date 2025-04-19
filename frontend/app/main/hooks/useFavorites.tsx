// 1. Créez un hook personnalisé pour gérer les favoris (hooks/useFavorites.ts)
import { useState, useEffect } from 'react';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<number[]>([]);

    // Charger les favoris depuis localStorage au montage du composant
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Ajouter un produit aux favoris
    const addToFavorites = async (productId: number) => {
        const updatedFavorites = [...favorites, productId];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        // Option: Sauvegarder côté serveur si l'utilisateur est connecté
        try {
            // Commentez cette partie si vous n'avez pas encore d'API
            // await fetch('/api/favorites', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ productId })
            // });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des favoris:', error);
        }
    };

    // Retirer un produit des favoris
    const removeFromFavorites = async (productId: number) => {
        const updatedFavorites = favorites.filter(id => id !== productId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        // Option: Supprimer côté serveur si l'utilisateur est connecté
        try {
            // Commentez cette partie si vous n'avez pas encore d'API
            // await fetch(`/api/favorites/${productId}`, {
            //   method: 'DELETE'
            // });
        } catch (error) {
            console.error('Erreur lors de la suppression des favoris:', error);
        }
    };

    // Vérifier si un produit est dans les favoris
    const isFavorite = (productId: number) => favorites.includes(productId);

    // Basculer entre ajouter/retirer des favoris
    const toggleFavorite = (productId: number) => {
        if (isFavorite(productId)) {
            removeFromFavorites(productId);
        } else {
            addToFavorites(productId);
        }
    };

    return { favorites, toggleFavorite, isFavorite };
};