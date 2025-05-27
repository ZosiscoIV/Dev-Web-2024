import { useState } from "react";
import axiosClient from "../../fetchWithToken"; // Import de l'instance Axios configurée

const useAddProductToCart = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addToCart = async (idProduit: number, quantite: number = 1) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosClient.post("/addToCart", {
                idProduit, // ID du produit
                quantite, // Quantité à ajouter
            });

            // Affichez le message de l'API dans l'alerte
            alert(response.data.message);
        } catch (err: any) {
            console.error(err);

            // Récupérez le message d'erreur de l'API ou utilisez un message par défaut
            const errorMessage = err.response?.data?.message || "Une erreur est survenue.";
            setError(errorMessage);

            // Affichez le message d'erreur dans l'alerte
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { addToCart, isLoading, error };
};

export default useAddProductToCart;