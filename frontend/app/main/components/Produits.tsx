"use client"

import { useEffect } from "react";
import ProduitCard from "./ProduitCard";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { useInfoComp } from "../hooks/useInfoComp";
import ProductDetailsPopup from "./ProductDetailsPopup";

import "../css/Produits.css";

function Produit() {
    //Récupère les produits paginés et fonctions depuis usePaginatedFetch
    const { products, loading, error, hasMore, fetchNext } = usePaginatedFetch(5);

    //Passe les produits paginés au hook useInfoComp, bien laissé comme ca sinon c'est la cata
    const {
        products: productsInfo,
        openProductDetails,
        selectedProduct,
        composition,
        closeProductDetails,
        isLoading,
    } = useInfoComp(products);

    //Au chargement du composant, on récupère la première page de produit
    useEffect(() => {
        fetchNext();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;
    if (!products || products.length === 0) return <p>Aucun produit disponible.</p>;

    return (
        <div className="produit-container">
            <div className="produit-grid">
                {/* affiche la liste des produits paginés */}
                {products.map((p) => (
                    <ProduitCard key={p.id} product={p} onDetailsClick={() => openProductDetails(p)} />
                ))}
            </div>

            {isLoading && <p>Chargement des détails...</p>}

            {hasMore && !loading && (
                <div className="load-more-wrapper">
                    <button className="load-more-button" onClick={fetchNext}>
                        Charger plus
                    </button>
                </div>
            )}

            {/* Popup pour afficher les détails si un produit est sélectionné */}
            {selectedProduct && (
                <ProductDetailsPopup
                    product={selectedProduct}
                    nutrition={composition.nutrition}
                    allergenes={composition.allergenes}
                    ingredients={composition.ingredients}
                    isLoading={isLoading}
                    onClose={closeProductDetails}
                    onAddToFavorites={() => { /* fonction ajout favoris */ }}
                    onAddToCart={() => { /* fonction ajout panier */ }}
                />
            )}
        </div>
    );
}

export default Produit;
