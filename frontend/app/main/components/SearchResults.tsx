"use client";

import Image from "next/image";
import { useProductSearch } from "../hooks/useProductSearch";
import ProductDetailsPopup from "./ProductDetailsPopup";
import "../css/ProduitsSearch.css"

const SearchResults = () => {
    const {
        query,
        filteredProducts,
        selectedProduct,
        composition,
        isLoading,
        openProductDetails,
        closeProductDetails,
        addToFavorites,
        addToCart
    } = useProductSearch();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Résultats pour &quot;{query}&quot;</h1>

            {filteredProducts.length === 0 ? (
                <p className="text-gray-500">Aucun produit correspondant trouvé.</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="produits p-4 border rounded shadow hover:shadow-lg transition cursor-pointer"
                            onClick={() => openProductDetails(product)}
                        >
                            <Imagegit
                                src={`/assets/${product.produit}.jpg`}
                                className="produitImg"
                                alt={product.produit}
                                width={200}
                                height={200}
                            />
                            <h2 className="text-lg font-semibold">{product.produit}</h2>
                            <p className="text-gray-600">{product.categorie}</p>
                            <p className="font-bold">Prix : {product.prix}€</p>
                            <div className="produit-actions">
                                <button
                                    className="btn-favoris"
                                    onClick={(e) => addToFavorites(product.id, e)}
                                >
                                    ❤️
                                </button>
                                <button
                                    className="btn-panier"
                                    onClick={(e) => addToCart(product.id, e)}
                                >
                                    🛒
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductDetailsPopup
                    product={selectedProduct}
                    nutrition={composition.nutrition}
                    allergenes={composition.allergenes}
                    ingredients={composition.ingredients}
                    isLoading={isLoading}
                    onClose={closeProductDetails}
                    onAddToFavorites={() => addToFavorites(selectedProduct.id)}
                    onAddToCart={() => addToCart(selectedProduct.id)}
                />
            )}
        </div>
    );
};

export default SearchResults;