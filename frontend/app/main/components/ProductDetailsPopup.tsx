import { InfosNutritionnelles, Composition } from "../hooks/useInfoComp";
import { Produit } from "../hooks/useFetch"
import useAddProductToCart from "../hooks/useAddProductToCart";
import "../css/ProductDetailsPopup.css"


interface ProductDetailsPopupProps {
    product: Produit;
    nutrition: InfosNutritionnelles | null;
    allergenes: string[];
    ingredients: string[];
    isLoading: boolean;
    onClose: () => void;
    onAddToFavorites: () => void;
    onAddToCart: () => void;
}

const ProductDetailsPopup = ({
                                 product,
                                 nutrition,
                                 allergenes,
                                 ingredients,
                                 isLoading,
                                 onClose,
                                 onAddToFavorites,
                                 onAddToCart
                             }: ProductDetailsPopupProps) => {

    // Use the custom hook for adding products to the cart
    const { addToCart, isLoading: isCartLoading, error } = useAddProductToCart();

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Empêche la propagation de l'événement pour éviter d'ouvrir la popup
        await addToCart(product.id, 1); // Add 1 unit of the product to the cart
    };


    return (
        <div className="nutritional-popup-overlay">
            <div className="nutritional-popup">
                <button className="close-popup" onClick={onClose}>×</button>
                <h2>Informations Nutritionnelles - {product.produit}</h2>

                {isLoading ? (
                    <p>Chargement...</p>
                ) : (
                    <>
                        {nutrition ? (
                            <div className="nutritional-content">
                                <div className="nutritional-item">
                                    <span>Calories:</span><strong>{nutrition.calories} kcal</strong>
                                </div>
                                <div className="nutritional-item">
                                    <span>Protéines:</span><strong>{nutrition.proteines} g</strong>
                                </div>
                                <div className="nutritional-item">
                                    <span>Glucides:</span><strong>{nutrition.glucides} g</strong>
                                </div>
                                <div className="nutritional-item">
                                    <span>Lipides:</span><strong>{nutrition.lipides} g</strong>
                                </div>
                                {nutrition.fibres !== undefined && (
                                    <div className="nutritional-item">
                                        <span>Fibres:</span><strong>{nutrition.fibres} g</strong>
                                    </div>
                                )}
                                {nutrition.sel !== undefined && (
                                    <div className="nutritional-item">
                                        <span>Sel:</span><strong>{nutrition.sel} g</strong>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Aucune information nutritionnelle.</p>
                        )}

                        <h3>Allergènes</h3>
                        <ul>
                            {allergenes.length > 0
                                ? allergenes.map((a, i) => <li key={i}>{a}</li>)
                                : <li>Aucun</li>
                            }
                        </ul>

                        <h3>Ingrédients</h3>
                        <ul>
                            {ingredients.length > 0
                                ? ingredients.map((i, j) => <li key={j}>{i}</li>)
                                : <li>Aucun</li>
                            }
                        </ul>

                        <div className="popup-buttons">
                            <button className="btn-favoris" onClick={onAddToFavorites}>❤️</button>
                            <button
                                className={`btn-panier ${isCartLoading ? "rotating" : ""}`}
                                onClick={handleAddToCart}
                                disabled={isCartLoading} // Disable the button while adding to cart
                            >
                                🛒
                            </button>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsPopup;