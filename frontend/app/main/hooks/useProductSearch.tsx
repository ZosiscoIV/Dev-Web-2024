import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export interface InfosNutritionnelles {
    calories?: number;
    proteines?: number;
    glucides?: number;
    lipides?: number;
    fibres?: number;
    sel?: number;
}

export interface Produit {
    id: number;
    produit: string;
    categorie: string;
    prix: number;
    image: string;
}

export interface ProductComposition {
    nutrition: InfosNutritionnelles | null;
    allergenes: string[];
    ingredients: string[];
}

export const useProductSearch = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";

    const [products, setProducts] = useState<Produit[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Produit[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null);
    const [composition, setComposition] = useState<ProductComposition>({
        nutrition: null,
        allergenes: [],
        ingredients: []
    });
    const [isLoading, setIsLoading] = useState(false);

    // Récupérer tous les produits
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:6942/api/products");
                const data = await response.json();

                if (Array.isArray(data)) {
                    const produitsDisponibles = data.filter((p: { dispo: boolean }) => p.dispo === true);
                    console.log('Les produits disponibles sont ', produitsDisponibles)
                    setProducts(produitsDisponibles);
                } 
                else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Erreur:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    // Filtrer les produits selon la recherche et la catégorie
    useEffect(() => {
        let filtered = products.filter((p) =>
            p.produit.toLowerCase().includes(query.toLowerCase()) ||
            p.categorie.toLowerCase().includes(query.toLowerCase())
        );

        if (category !== "") {
            filtered = filtered.filter((p) =>
                p.categorie.toLowerCase() === category.toLowerCase()
            );
        }

        setFilteredProducts(filtered);
    }, [query, category, products]);

    // Ouvrir la popup de détail du produit
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

    // Gérer les actions utilisateur
    const addToFavorites = async (productId: number, event?: React.MouseEvent) => {
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
                body: JSON.stringify({ idProduit: productId })
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



    const addToCart = (productId: number, event?: React.MouseEvent) => {
        if (event) event.stopPropagation();
        console.log("Ajouté au panier:", productId);
    };

    return {
        query,
        filteredProducts,
        selectedProduct,
        composition,
        isLoading,
        openProductDetails,
        closeProductDetails,
        addToFavorites,
        addToCart
    };
};