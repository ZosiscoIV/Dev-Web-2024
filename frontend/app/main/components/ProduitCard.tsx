"use client";

import React from "react";
import Image from "next/image";
import { Produit } from "../hooks/usePaginatedFetch";
import "../css/ProduitCard.css";

interface ProduitCardProps {
    product: Produit;
    onDetailsClick?: (product: Produit) => void;
}

const ProduitCard: React.FC<ProduitCardProps> = React.memo(({ product, onDetailsClick }) => {
    return (
        <div className="produit-card">
            <div className="produit-image-wrapper">
                <Image
                    src={product.imageURL}
                    alt={product.produit}
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
                    <button className="btn-favoris" onClick={() => {}}>❤️</button>
                    <button className="btn-panier" onClick={() => {}}>🛒</button>
                </div>
            </div>
        </div>
    );
});

//sert pour React.meme pour lui donner un nom explicite pour le debugage
ProduitCard.displayName = "ProduitCard";

export default ProduitCard;
