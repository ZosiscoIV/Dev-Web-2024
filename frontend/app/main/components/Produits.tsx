"use client";
import "../css/Produits.css";
import Image from 'next/image';
import { useProductDetails, ProductDetailsProps } from "../hooks/useProductDetails";
import ProductDetailsPopup from "./ProductDetailsPopup";

const ProduitsSearch = (props: ProductDetailsProps) => {
    const {
        showNutritionalInfo,
        infosNutritionnelles,
        allergenes,
        ingredients,
        isLoading,
        handleProductClick,
        closePopup,
        addToFavorites,
        addToCart
    } = useProductDetails(props);

    const { produit, categorie, prix, image, status } = props;

    return (
        <div className="produits-scroll">
            <div className="produit-container">
                <a className="produit-card" href="#" onClick={handleProductClick}>
                    <div className="produit-header">
                        <h3>{produit}</h3>
                    </div>
                    <div className="produit-body">
                        <p className="produit-category">Catégorie : <span>{categorie}</span></p>
                        <p className="produit-price">Prix : <strong>{prix.toFixed(2)} €</strong></p>
                        <p className="produit-status">Status : <span>{status}</span></p>
                    </div>
                    <div className="produit-img">
                        <div className="image-wrapper">
                            <Image
                                src={`/assets/${image}`}
                                alt={produit}
                                width={200}
                                height={200}
                                style={{ objectFit: "cover" }}
                                className="produitImage"
                                onError={props.onImageError}
                            />
                        </div>
                        <div className="produit-actions">
                            <button
                                className="btn-favoris"
                                onClick={(e) => addToFavorites(e)}
                            >
                                ❤️
                            </button>
                            <button
                                className="btn-panier"
                                onClick={(e) => addToCart(e)}
                            >
                                🛒
                            </button>
                        </div>
                    </div>
                </a>
            </div>

            {showNutritionalInfo && (
                <ProductDetailsPopup
                    product={{
                        id: parseInt(props.id),
                        produit: produit,
                        categorie: Array.isArray(categorie) ? categorie[0] : categorie.toString(),
                        prix: prix,
                        image: image
                    }}
                    nutrition={infosNutritionnelles}
                    allergenes={allergenes}
                    ingredients={ingredients}
                    isLoading={isLoading}
                    onClose={closePopup}
                    onAddToFavorites={addToFavorites}
                    onAddToCart={addToCart}
                />
            )}
        </div>
    );
};

export default ProduitsSearch;