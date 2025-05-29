"use client";

import useFavoris from "@/app/main/hooks/useFavoris";

const FavoritesPage = () => {
    const {
        favorites,
        loading,
        error,
        handleRemoveFavorite,
    } = useFavoris();

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Mes Favoris</h1>
            {favorites.length === 0 ? (
                <div className="text-center text-gray-500">
                    Aucun favori trouvé
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 shadow-md">
                            <p className="text-green-600 font-bold mb-4">{product.prix} €</p>
                            <button
                                onClick={() => handleRemoveFavorite(product.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Supprimer des favoris
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
