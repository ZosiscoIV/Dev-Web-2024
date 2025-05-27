import { InfosNutritionnelles, Produit } from "../hooks/useProductSearch";

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
                            {/* <button className="btn-panier" onClick={onAddToCart}>🛒</button> */}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsPopup;