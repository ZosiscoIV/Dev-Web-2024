"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/app/main/components/Header";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    nutrition?: string;
    ingredients?: string;
    allergens?: string;
}

const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get("/api/favorites", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                setFavorites(response.data);
            } catch (err) {
                setError("Erreur lors de la récupération des favoris.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Produits Favoris</h1>
                {favorites.length === 0 ? (
                    <p>Aucun produit favori pour le moment.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {favorites.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white p-4 shadow rounded cursor-pointer hover:shadow-lg transition"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded" />
                                <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
                                <p>{product.price} €</p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                            >
                                ×
                            </button>
                            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-48 object-cover rounded" />
                            <h2 className="mt-4 text-xl font-bold">{selectedProduct.name}</h2>
                            <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                            <p className="mt-2 font-semibold">{selectedProduct.price} €</p>

                            {/* Nutrition et autres détails, si disponibles */}
                            {selectedProduct.nutrition && (
                                <p className="mt-2 text-sm"><strong>Valeurs nutritionnelles:</strong> {selectedProduct.nutrition}</p>
                            )}
                            {selectedProduct.ingredients && (
                                <p className="mt-2 text-sm"><strong>Ingrédients:</strong> {selectedProduct.ingredients}</p>
                            )}
                            {selectedProduct.allergens && (
                                <p className="mt-2 text-sm"><strong>Allergènes:</strong> {selectedProduct.allergens}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
