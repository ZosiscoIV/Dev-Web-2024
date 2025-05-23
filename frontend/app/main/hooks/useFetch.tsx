import { useState } from "react";

export interface Produit {
    id: number;
    produit: string;
    categorie: string;
    prix: number;
    imageURL: string;
    status?: string;
    dispo?: boolean;
}

export const useFetch = () => {
    //défini l'état interne du hook
    const [product, setProduct] = useState<Produit[]>([]);
    //product est un tableau qui contiendra les produits récupérés depuis l'API
    //on l'initialise a vide et setProducts permet de mettre à jours ce tableau quand les produits sont chargés.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    // pas de use effect pour ne pas activer automatiquement la fonction.
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:6942/api/products");
            const json = await response.json();

            if (Array.isArray(json)) {
                const ProduitDispo = json.filter((p: {dispo: boolean}) => p.dispo === true);
                setProduct(ProduitDispo);
            } else {
                setProduct([]);
            }
        } catch (error) {
            console.log("error", error);
            setError("Erreur de chargement des produits.");
            setProduct([]);
        } finally {
            setLoading(false);
        }
    };
    return { product, loading, error, fetchProducts };
};