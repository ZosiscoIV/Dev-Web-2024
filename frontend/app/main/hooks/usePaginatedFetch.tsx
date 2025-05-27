import { useState, useEffect, useCallback } from "react";

export interface Produit {
    id: number;
    produit: string;
    categorie: string;
    prix: number;
    imageURL: string;
    status?: string;
    dispo?: boolean;
}

export const usePaginatedFetch = (limit: number = 5) => {
    const [products, setProducts] = useState<Produit[]>([]);
    const [page, setPage] = useState(0); // offset = page * limit
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);


    const fetchNext = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        //snapshot local car ça skippais certain articles
        const currentPage = page; // snapshot local
        const offset = currentPage * limit;

        try {
            const response = await fetch(`http://localhost:6942/api/products?offset=${offset}&limit=${limit}`);

            if (!response.ok) {
                // Si 404 ou autre, on stoppe la pagination
                setHasMore(false);
                setLoading(false);
                return;
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const produitsDisponibles = data.filter((p) => p.dispo === true);
                setProducts((prev) => {

                    // évite doublons quand on quitte et reviens sur la page
                    const ids = new Set(prev.map(p => p.id));
                    const newProds = produitsDisponibles.filter(p => !ids.has(p.id));
                    return [...prev, ...newProds];
                });

                setPage(currentPage + 1);

                if (produitsDisponibles.length < limit) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Erreur fetch :", err);
            setError("Erreur inconnue");
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [page, limit, loading, hasMore]);

    useEffect(() => {
        fetchNext();
    }, []); // appel initial au montage

    // Fonction pour réinitialiser la pagination si nécessaire
    const resetPagination = () => {
        setProducts([]);
        setPage(0);
        setHasMore(true);
        setError(null);
    };

    return { products, loading, error, hasMore, fetchNext, resetPagination };
};