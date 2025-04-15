"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProduitsSearch from '../main/components/ProduitsSearch';
import "./page.css";
import Header from "@/app/main/components/Header";

interface Produit {
    id: number;
    produit: string;
    categorie: string;
    prix: number;
    image: string;
}

export default function SearchPage() {
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

        if (category && category !== "") {
            filtered = filtered.filter((p) => p.categorie === category);
        }

        setFilteredProducts(filtered);
    }, [query, category, products]);

    return (
        <div>
            <Header />
                <div className="search-results-container">
                    <h1>Résultats pour &quot;{query}&quot;</h1>

                        {filteredProducts.length > 0 ? (
                            <div className="products-grid">
                            {filteredProducts.map((p) => (
                                <ProduitsSearch
                            key={p.id}
                            produit={p.produit}
                            categorie={p.categorie}
                            prix={p.prix}
                            image={`../assets/${p.produit.toLowerCase()}.jpg`}
                                />
                        ))}
                    </div>
                    ) : (
                    <p>Aucun produit trouvé.</p>
                )}
            </div>
        </div>
    );
}