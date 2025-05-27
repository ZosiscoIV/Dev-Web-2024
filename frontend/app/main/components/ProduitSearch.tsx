"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProduitCard from "./ProduitCard";
import { useProductSearch } from "@/app/main/hooks/useProductSearch";
import "../css/Produits.css";
import ProductDetailsPopup from "@/app/main/components/ProductDetailsPopup";
import {useInfoComp} from "@/app/main/hooks/useInfoComp";

const ProduitSearch = () => {
    const { results, loading, query, setQuery, handleSearch } = useProductSearch();
    const searchParams = useSearchParams();


    // Utilisation du hook useInfoComp avec les résultats de la recherche
    const {
        selectedProduct,
        composition,
        isLoading,
        openProductDetails,
        closeProductDetails
    } = useInfoComp(results);


    // Récupère une fois les strings
    const q = searchParams.get("q") ?? "";
    const cat = searchParams.get("category") ?? "";


    useEffect(() => {
        if (query !== q) {
            setQuery(q);
        }
    }, [q, query, setQuery]);

    useEffect(() => {
        handleSearch(cat);
    }, [cat, handleSearch]);


    return (
        <div className="produit-container">
            <div className="produit-grid">
                {results.map((product) => (
                    <ProduitCard
                        key={product.id}
                        product={product}
                        onDetailsClick={openProductDetails}
                    />
                ))}
            </div>

            {loading && <p>Recherche en cours…</p>}
            {!loading && results.length === 0 && query && (
                <p>Aucun produit trouvé pour « {query} ».</p>
            )}

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
};

export default ProduitSearch;
