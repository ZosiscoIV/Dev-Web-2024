// src/hooks/useProductData.ts
import { useEffect, useState } from "react";

interface InfosNutritionnelles {
    calories?: number;
    proteines?: number;
    glucides?: number;
    lipides?: number;
    fibres?: number;
    sel?: number;
}

interface Produit {
    id: number;
    produit: string;
    categorie: string;
    prix: number;
    image: string;
}

export const useProducts = () => {
    const [products, setProducts] = useState<Produit[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:6942/api/products");
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    return { products };
};

export const useProductDetails = (productId: number | null) => {
    const [nutrition, setNutrition] = useState<InfosNutritionnelles | null>(null);
    const [allergenes, setAllergenes] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productId === null) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:6942/api/produit/${productId}/composition`);
                const data = await response.json();

                setNutrition(data.nutrition || null);
                setAllergenes(data.allergenes?.map((a: { nom: string }) => a.nom) || []);
                const sortedIngredients = data.ingredients?.sort((a: any, b: any) => a.ordre - b.ordre) || [];
                setIngredients(sortedIngredients.map((i: any) => i.nom));
            } catch (err) {
                console.error("Erreur récupération composition:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [productId]);

    return { nutrition, allergenes, ingredients, loading };
};
