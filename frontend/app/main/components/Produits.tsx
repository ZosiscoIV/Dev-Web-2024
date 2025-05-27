"use client";
import "../css/Produits.css"; // Assurez-vous que ce fichier contient les styles nécessaires
import Image from "next/image";
import { useProductDetails, ProductDetailsProps } from "../hooks/useProductDetails";
import ProductDetailsPopup from "./ProductDetailsPopup";
import useAddProductToCart from "../hooks/useAddProductToCart"; // Import the custom hook

const ProduitsSearch = (props: ProductDetailsProps) => {
    const {
        showNutritionalInfo,
        infosNutritionnelles,
        allergenes,
        ingredients,
        isLoading: isDetailsLoading,
        handleProductClick,
        closePopup,
        addToFavorites,
    } = useProductDetails(props);

    const { produit, categorie, prix, image, status } = props;

    // Use the custom hook for adding products to the cart
    const { addToCart, isLoading: isCartLoading, error } = useAddProductToCart();

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Empêche la propagation de l'événement pour éviter d'ouvrir la popup
        await addToCart(parseInt(props.id), 1); // Add 1 unit of the product to the cart
    };

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
                                onClick={(e) => {
                                    e.stopPropagation(); // Empêche l'ouverture de la popup
                                    addToFavorites(e);
                                }}
                            >
                                ❤️
                            </button>
                            <button
                                className={`btn-panier ${isCartLoading ? "rotating" : ""}`}
                                onClick={handleAddToCart}
                                disabled={isCartLoading} // Disable the button while adding to cart
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
                        image: image,
                    }}
                    nutrition={infosNutritionnelles}
                    allergenes={allergenes}
                    ingredients={ingredients}
                    isLoading={isDetailsLoading}
                    onClose={closePopup}
                    onAddToFavorites={addToFavorites}
                    onAddToCart={() => void 0} // No need to add to cart here, handled in the main component
                />
            )}

            {/* {error && <p className="error-message">Erreur : {error}</p>} */}
        </div>
    );
};

export default ProduitsSearch;