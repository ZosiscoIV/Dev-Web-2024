"use client";

import { useEffect } from "react";
import ProduitCard from "./ProduitCard";
import ProductDetailsPopup from "@/app/main/components/ProductDetailsPopup";
import useFavoris from "@/app/main/hooks/useFavoris";
import { useInfoComp } from "@/app/main/hooks/useInfoComp";
import "../css/Produits.css";

const FavoritesPage = () => {
    const {
        favorites,
        loading,
        error,
        handleRemoveFavorite,
    } = useFavoris();

    const {
        selectedProduct,
        composition,
        isLoading,
        openProductDetails,
        closeProductDetails
    } = useInfoComp(favorites);

    useEffect(() => {
        // reset ou actions au montage si nécessaire
    }, []);

    return (
        <div className="produit-container">
            <h1 className="text-2xl font-bold mb-6">Mes Favoris</h1>

            {loading && <p>Chargement…</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && favorites.length === 0 && (
                <p className="text-gray-500 text-center">Aucun favori trouvé.</p>
            )}

            <div className="produit-grid">
                {favorites.map((product) => (
                    <ProduitCard
                        key={product.id}
                        product={product}
                        onDetailsClick={openProductDetails}
                        onRemoveFavorite={() => handleRemoveFavorite(product.id)}
                        showRemoveButton={true}
                    />
                ))}
            </div>

            {selectedProduct && (
                <ProductDetailsPopup
                    product={selectedProduct}
                    nutrition={composition.nutrition}
                    allergenes={composition.allergenes}
                    ingredients={composition.ingredients}
                    isLoading={isLoading}
                    onClose={closeProductDetails}
                    onAddToFavorites={() => {}} // ou désactiver ce bouton
                    onAddToCart={() => {}}
                />
            )}
        </div>
    );
};

export default FavoritesPage;
