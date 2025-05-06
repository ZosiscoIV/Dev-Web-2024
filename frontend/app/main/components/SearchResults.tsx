"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Produit {
    id: number;
    produit: string;
    categorie: string;
    prix: number;
    image: string;
}

const SearchResults = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || ""; // Requête recherche
    const category = searchParams.get("category") || ""; // Catégorie

    const [products, setProducts] = useState<Produit[]>([]); // État pour tous les produits
    const [filteredProducts, setFilteredProducts] = useState<Produit[]>([]); // Produits filtrés

    // Charger les produits au démarrage
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:6942/api/products");
                if (!response.ok) throw new Error("Erreur lors de la récupération des produits");
                const data = await response.json();

                console.log("Réponse API produits :", data); // --> Vérifiez ici

                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    // Filtrer les produits en fonction de la recherche et de la catégorie
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

        setFilteredProducts(filtered); // Mettre à jour l'état avec les produits filtrés
    }, [query, category, products]);


        // Affichage de la liste des produits
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Résultats pour &quot;{query}&quot;</h1>

            {filteredProducts.length === 0 ? (
                <p className="text-gray-500">Aucun produit correspondant trouvé.</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {filteredProducts.map((product) => {
                        console.log("Chemin de l'image :", product.image); // Afficher les logs
                        return (
                            <a
                                key={product.id}
                                className="produits p-4 border rounded shadow hover:shadow-lg transition"
                                href={`#product_${product.id}`}
                            >
                                <Image
                                    src={`/assets/${product.image}`}
                                    className="produitImg"
                                    alt={product.produit}
                                    width={200}
                                    height={200}
                                />
                                <h2 className="text-lg font-semibold">{product.produit}</h2>
                                <p className="text-gray-600">{product.categorie}</p>
                                <p className="font-bold">Prix : {product.prix}€</p>
                            </a>
                        );
                    })}
                </div>

            )}
        </div>
    );
};

export default SearchResults;