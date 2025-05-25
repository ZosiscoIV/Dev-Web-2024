import { useState } from "react";

const useAddProductToCart = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addToCart = async (idProduit: number, quantite: number = 1) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:6942/api/addToCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve the token from localStorage
                },
                body: JSON.stringify({
                    idProduit, // ID of the product
                    quantite, // Quantity to add
                }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout au panier.");
            }

            const result = await response.json();
            console.log("Produit ajouté au panier :", result);
            alert("Produit ajouté au panier avec succès !");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Une erreur est survenue.");
            alert("Erreur lors de l'ajout au panier.");
        } finally {
            setIsLoading(false);
        }
    };

    return { addToCart, isLoading, error };
};

export default useAddProductToCart;