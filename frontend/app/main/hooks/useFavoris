import { useEffect, useState } from "react";
import { Produit } from "@/app/main/hooks/usePaginatedFetch";

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()!.split(';').shift() || null;
    }
    return null;
};

const useFavoris = () => {
    const [favorites, setFavorites] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getAuthToken = () => getCookie("token");

    const fetchFavorites = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                setError("Vous devez être connecté pour voir vos favoris");
                setLoading(false);
                return;
            }

            const response = await fetch("http://localhost:6942/api/favoris", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) throw new Error("Échec du chargement des favoris");
            const data = await response.json();
            setFavorites(data);
        } catch (err) {
            setError("Erreur lors de la récupération des favoris.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (idProduit: number) => {
        try {
            const token = getAuthToken();
            if (!token) {
                setError("Vous devez être connecté pour supprimer des favoris");
                return;
            }

            const response = await fetch(`http://localhost:6942/api/favoris/${idProduit}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) throw new Error();
            setFavorites((prev) => prev.filter((product) => product.id !== idProduit));
        } catch {
            setError("Erreur lors de la suppression du favori.");
        }
    };

    const handleAddFavorite = async (produit: Produit) => {
        const token = getAuthToken();
        try {
            const response = await fetch("http://localhost:6942/api/favoris", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ idProduit: produit.id }),
            });

            if (!response.ok) throw new Error("Erreur ajout favori");

            setFavorites((prev) => [...prev, produit]);
        } catch {
            setError("Erreur lors de l'ajout du favori.");
        }
    };

    const isFavorite = (idProduit: number) =>
        favorites.some((produit) => produit.id === idProduit);

    useEffect(() => {
        fetchFavorites();
    }, []);

    return {
        favorites,
        loading,
        error,
        handleAddFavorite,
        handleRemoveFavorite,
        isFavorite,
    };
};

export default useFavoris;
