import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const products = [
    { id: 1, name: "Pomme", category: "fruits" },
    { id: 2, name: "Banane", category: "fruits" },
    { id: 3, name: "Carotte", category: "legumes" },
    { id: 4, name: "Tomate", category: "legumes" },
    { id: 5, name: "Boeuf", category: "viande" },
    { id: 6, name: "Jus d'orange", category: "boissons" },
];

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
    const query = useQuery().get("q") || "";
    const category = useQuery().get("category") || "";
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        let filtered = products.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase())
        );

        if (category !== "") {
            filtered = filtered.filter((p) => p.category === category);
        }

        setFilteredProducts(filtered);
    }, [query, category]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Résultats pour "{query}"</h1>
            <ul className="mt-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                        <li key={p.id} className="border p-2 rounded-md my-2">
                            {p.name} ({p.category})
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
