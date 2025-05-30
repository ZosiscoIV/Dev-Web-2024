"use client";

import React from "react";
import Image from "next/image";
import { Produit } from "../hooks/usePaginatedFetch";
import useAddProductToCart from "../hooks/useAddProductToCart";
import useFavoris from "../hooks/useFavoris";
import "../css/ProduitCard.css";

interface ProduitCardProps {
    product: Produit;
    onDetailsClick?: (product: Produit) => void;
    onRemoveFavorite?: () => void;
    showRemoveButton?: boolean;
}

const ProduitCard: React.FC<ProduitCardProps> = React.memo(({ product, onDetailsClick, onRemoveFavorite, showRemoveButton }) => {
    // Utilisation du hook pour ajouter un produit au panier
    const { addToCart, isLoading: isCartLoading } = useAddProductToCart();
    const { handleAddFavorite, handleRemoveFavorite, isFavorite } = useFavoris();

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Empêche l'ouverture de la popup des détails
        try {
            await addToCart(product.id, 1); // Ajoute 1 unité du produit au panier
        } catch (err) {
            console.error("Erreur lors de l'ajout au panier :", err);
        }
    };

    const toggleFavorite = () => {
        if (isFavorite(product.id)) {
            handleRemoveFavorite(product.id);
        } else {
            handleAddFavorite(product);
        }
    };

    return (
        <div className="produit-card">
            <div className="produit-image-wrapper">
                <Image
                    src={product.imageURL}
                    alt={product.produit || "Image du produit"} // Fournit une valeur par défaut si product.produit est vide
                    width={200}
                    height={200}
                    className="produit-image"
                />
            </div>
            <div className="produit-details">
                <h3 className="produit-title">{product.produit}</h3>
                <p className="produit-category">
                    Catégorie : <span>{product.categorie}</span>
                </p>
                <p className="produit-price">
                    Prix : <strong>{product.prix.toFixed(2)} €</strong>
                </p>
                <p className="produit-status">
                    Statut : <span>{product.status}</span>
                </p>
                <div className="produit-actions">
                    <button onClick={() => onDetailsClick?.(product)}>ℹ️ Détails</button>

                    {/* Affiche le bouton cœur uniquement si showRemoveButton est false */}
                    {!showRemoveButton && (
                        <button
                            className="btn-favoris"
                            onClick={toggleFavorite}
                        >
                            {isFavorite(product.id) ? "❤️" : "🤍"}
                        </button>
                    )}

                    <button
                        className={`btn-panier ${isCartLoading ? "rotating" : ""}`}
                        onClick={handleAddToCart}
                        disabled={isCartLoading} // Désactive le bouton pendant le chargement
                    >
                        {isCartLoading ? "⏳" : "🛒"}
                    </button>

                    {/* Affiche le bouton croix uniquement si showRemoveButton est true */}
                    {showRemoveButton && onRemoveFavorite && (
                        <button className="btn-supprimer" onClick={onRemoveFavorite}>
                            ❌
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

// Sert pour React.memo pour lui donner un nom explicite pour le débogage
ProduitCard.displayName = "ProduitCard";

export default ProduitCard;
