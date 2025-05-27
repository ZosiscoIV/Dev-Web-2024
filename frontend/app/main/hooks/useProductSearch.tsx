import { useState, useEffect, useCallback  } from "react";
import { Produit } from "./usePaginatedFetch";

// Ajoute un paramètre category à handleSearch
export const useProductSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = useCallback(async (category?: string) => {
        if (!query.trim() && !category?.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let url = `http://localhost:6942/api/search?`;
            const params = new URLSearchParams();

            //ajoute les param à l'url que si ils sont remplis
            if (query.trim()) params.append("query", query.trim());
            if (category?.trim()) params.append("category", category.trim());

            const response = await fetch(`${url}${params.toString()}`);
            if (!response.ok) throw new Error("Erreur serveur");

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError((err as Error).message);
            console.error("Erreur fetch search", err);
        } finally {
            setLoading(false);
        }
    }, [query]);


    return { query, setQuery, results, loading, error, handleSearch };
};
