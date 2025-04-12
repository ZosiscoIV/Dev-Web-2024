"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Produit {
    id: number;
    produit: string;
    categorie: string;
    prix: number;
    image: string;
}

const SearchResults = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";

    const [products, setProducts] = useState<Produit[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Produit[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:6942/api/products");
                if (!response.ok) throw new Error("Erreur lors de la récupération des produits");
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products.filter((p) =>
            p.produit && p.produit.toLowerCase().includes(query.toLowerCase())
        );

        if (category !== "") {
            filtered = filtered.filter((p) => p.categorie === category);
        }

        setFilteredProducts(filtered);
    }, [query, category, products]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Résultats pour &quot;{query}&quot;</h1>

            <ul className="mt-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                        <li key={p.id} className="border p-2 rounded-md my-2">
                            {p.produit} ({p.categorie}) - {p.prix}€
                        </li>
                    ))
                ) : (
                    <p>Aucun produit trouvé.</p>
                )}
            </ul>
        </div>
    );
};

export default SearchResults;
