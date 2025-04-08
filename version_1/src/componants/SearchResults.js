import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
    const query = useQuery().get("q") || "";
    const category = useQuery().get("category") || ""; // Récupère la catégorie depuis l'URL
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:6942/api/products");
                if (!response.ok) throw new Error("Erreur lors de la récupération des produits");
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products.filter((p) =>
            p.produit && p.produit.toLowerCase().includes(query.toLowerCase()) // Vérifie la recherche
        );

        if (category !== "") {
            filtered = filtered.filter((p) => p.categorie === category); // Vérifie la catégorie
        }

        setFilteredProducts(filtered);
    }, [query, category, products]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Résultats pour "{query}"</h1>

            <ul className="mt-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                        <li key={p.id} className="border p-2 rounded-md my-2">
                            {p.produit} ({p.categorie}) - {p.prix}€
                        </li>
                    ))
                ) : (
                    <p>Aucun produit trouvé.</p>
                )}
            </ul>
        </div>
    );
};

export default SearchResults;
