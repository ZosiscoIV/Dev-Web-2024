import { useState } from "react";
import { InfosNutritionnelles } from "./useProductSearch";

interface Ingredient {
    nom: string;
    ordre: number;
}

export interface ProductDetailsProps {
    id: string;
    produit: string;
    categorie: string[] | string;
    prix: number;
    image: string;
    status: string;
    onImageError?: () => void;
}

export const useProductDetails = (props: ProductDetailsProps) => {
    const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);
    const [infosNutritionnelles, setInfosNutritionnelles] = useState<InfosNutritionnelles | null>(null);
    const [allergenes, setAllergenes] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour récupérer les données nutritionnelles, allergènes et ingrédients
    const fetchProductDetails = async () => {
        try {
            setIsLoading(true); // Indicateur de chargement

            // Récupérer les informations nutritionnelles et composition
            const res = await fetch(`http://localhost:6942/api/produit/${props.id}/composition`);
            if (!res.ok) {
                throw new Error(`Erreur HTTP : ${res.status}`);
            }

            const data = await res.json();

            // Infos nutritionnelles
            setInfosNutritionnelles(data.nutrition || null);

            // Allergènes
            if (Array.isArray(data.allergenes)) {
                setAllergenes(data.allergenes.map((a: { nom: string }) => a.nom));
            } else {
                setAllergenes([]);
            }

            // Ingrédients (ordonnés)
            if (Array.isArray(data.ingredients)) {
                const sorted = data.ingredients.sort((a: Ingredient, b: Ingredient) => a.ordre - b.ordre);
                setIngredients(sorted.map((i: Ingredient) => i.nom));
            } else {
                setIngredients([]);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la composition :", error);
        } finally {
            setIsLoading(false); // Masquer le loader après la fin du chargement
        }
    };

    const handleProductClick = (e: React.MouseEvent) => {
        e.preventDefault();
        fetchProductDetails();  // Charger les données au clic
        setShowNutritionalInfo(true);
    };

    const closePopup = () => {
        setShowNutritionalInfo(false);
    };

    // Gérer les actions utilisateur
    const addToFavorites = async (event?: React.MouseEvent) => {
        if (event) event.stopPropagation();

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
            alert("Vous devez être connecté pour ajouter aux favoris.");
            return;
        }

        try {
            const response = await fetch("http://localhost:6942/api/favoris", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ idProduit: parseInt(props.id) })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.error || "Erreur inconnue");
            }

            alert("Produit ajouté aux favoris ✅");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout aux favoris");
        }
    };


    const addToCart = (event?: React.MouseEvent) => {
        if (event) event.stopPropagation();
        console.log("Ajouté au panier:", props.id);
    };

    return {
        showNutritionalInfo,
        infosNutritionnelles,
        allergenes,
        ingredients,
        isLoading,
        handleProductClick,
        closePopup,
        addToFavorites,
        addToCart
    };
};