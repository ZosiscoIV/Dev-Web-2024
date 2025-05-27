import { useState} from "react";
import { useSearchParams } from "next/navigation";
import { Produit } from "@/app/main/hooks/useFetch";


//pourquoi séparé en deux comme ca ? car plus simple à réutiliser dans plusieurs component avec que certaine interface
export interface InfosNutritionnelles {
    calories?: number;
    proteines?: number;
    glucides?: number;
    lipides?: number;
    fibres?: number;
    sel?: number;
}

export interface Composition {
    nutrition: InfosNutritionnelles | null;
    allergenes: string[];
    ingredients: string[];
}
// initialProducts: Produits prend initialsProducts qui est un tableau d'objets Produit. pour le donner à Produits.tsx
export const useInfoComp = (initialProducts: Produit[] = []) => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";

    const [products, setProducts] = useState<Produit[]>(initialProducts);
    const [filteredProducts, setFilteredProducts] = useState<Produit[]>(initialProducts);
    const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null);
    const [composition, setComposition] = useState<Composition>({
        nutrition: null,
        allergenes: [],
        ingredients: []
    });
    const [isLoading, setIsLoading] = useState(false);

    const openProductDetails = async (product: Produit) => {
        setIsLoading(true);
        setSelectedProduct(product);
        try {
            const res = await fetch(`http://localhost:6942/api/produit/${product.id}/composition`);
            const data = await res.json();

            const allergeneNames = data.allergenes?.map((a: { nom: string }) => a.nom) || [];
            const sortedIngredients = data.ingredients?.sort((a: any, b: any) => a.ordre - b.ordre) || [];
            const ingredientNames = sortedIngredients.map((i: any) => i.nom);

            setComposition({
                nutrition: data.nutrition || null,
                allergenes: allergeneNames,
                ingredients: ingredientNames
            });
        } catch (err) {
            console.error("Erreur récupération composition:", err);
            setComposition({
                nutrition: null,
                allergenes: [],
                ingredients: []
            });
        } finally {
            setIsLoading(false);
        }
    };

// Fermer la popup
    const closeProductDetails = () => {
        setSelectedProduct(null);
        setComposition({
            nutrition: null,
            allergenes: [],
            ingredients: []
        });
    };
    return {
        products,
        filteredProducts,
        selectedProduct,
        composition,
        isLoading,
        openProductDetails,
        closeProductDetails
    };
}