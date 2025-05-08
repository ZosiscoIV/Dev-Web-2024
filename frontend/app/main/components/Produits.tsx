"use client";
import "../css/Produits.css";
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Définir d'abord le type InfosNutritionnelles
interface InfosNutritionnelles {
    calories?: number;
    proteines?: number;
    glucides?: number;
    lipides?: number;
    fibres?: number;
    sel?: number;
    composition?: string;
}

interface Ingredient {
    nom: string;
    ordre: number;
}


interface ProduitsSearchProps {
    produit: string;
    categorie: string[];
    description: string;
    prix: number;
    image: string;
    status: string;
    id: string;
    onImageError: () => void;
}

const ProduitsSearch = ({
                            produit,
                            categorie,
                            prix,
                            image,
                            onImageError,
                            status,
                            id,
                        }: ProduitsSearchProps) => {
    const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);
    const [infosNutritionnelles, setInfosNutritionnelles] = useState<InfosNutritionnelles | null>(null);
    const [allergenes, setAllergenes] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour récupérer les données nutritionnelles, allergènes et ingrédients
    const fetchProductDetails = async () => {
        try {
            setIsLoading(true); // Indicateur de chargement

            // Récupérer les informations nutritionnelles et composition
            const res = await fetch(`http://localhost:6942/api/produit/${id}/composition`);
            if (!res.ok) {
                throw new Error(`Erreur HTTP : ${res.status}`);
            }

            const data = await res.json();

            // Infos nutritionnelles
            setInfosNutritionnelles(data.nutrition || null);

            // Allergènes
            if (Array.isArray(data.allergenes)) {
                setAllergenes(data.allergenes.map((a: { nom: string }) => a.nom));
            } else {
                setAllergenes([]);
            }

            // Ingrédients (ordonnés)
            if (Array.isArray(data.ingredients)) {
                const sorted = data.ingredients.sort((a: Ingredient, b: Ingredient) => a.ordre - b.ordre);
                setIngredients(sorted.map((i: Ingredient) => i.nom));
            } else {
                setIngredients([]);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la composition :", error);
        } finally {
            setIsLoading(false); // Masquer le loader après la fin du chargement
        }
    };

    const handleProductClick = (e: React.MouseEvent) => {
        e.preventDefault();
        fetchProductDetails();  // Charger les données au clic
        setShowNutritionalInfo(true);
    };

    const closePopup = () => {
        setShowNutritionalInfo(false);
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
                            />
                        </div>
                    </div>
                </a>
            </div>

            {showNutritionalInfo && (
                <div className="nutritional-popup-overlay">
                    <div className="nutritional-popup">
                        <button className="close-popup" onClick={closePopup}>×</button>
                        <h2>Informations Nutritionnelles - {produit}</h2>

                        {isLoading ? (
                            <div className="loader">
                                <p>Chargement...</p>
                            </div>
                        ) : (
                            <>
                                {infosNutritionnelles ? (
                                    <div className="nutritional-content">
                                        <div className="nutritional-item"><span>Calories:</span><strong>{infosNutritionnelles.calories} kcal</strong></div>
                                        <div className="nutritional-item"><span>Protéines:</span><strong>{infosNutritionnelles.proteines} g</strong></div>
                                        <div className="nutritional-item"><span>Glucides:</span><strong>{infosNutritionnelles.glucides} g</strong></div>
                                        <div className="nutritional-item"><span>Lipides:</span><strong>{infosNutritionnelles.lipides} g</strong></div>
                                        {infosNutritionnelles.fibres !== undefined && (
                                            <div className="nutritional-item"><span>Fibres:</span><strong>{infosNutritionnelles.fibres} g</strong></div>
                                        )}
                                        {infosNutritionnelles.sel !== undefined && (
                                            <div className="nutritional-item"><span>Sel:</span><strong>{infosNutritionnelles.sel} g</strong></div>
                                        )}
                                    </div>
                                ) : (
                                    <p>Informations nutritionnelles non disponibles pour ce produit.</p>
                                )}

                                <h3>Allergènes</h3>
                                {allergenes.length > 0 ? (
                                    <ul>
                                        {allergenes.map((allergene, index) => (
                                            <li key={index}>{allergene}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Aucun allergène trouvé pour ce produit.</p>
                                )}

                                <h3>Ingrédients</h3>
                                {ingredients.length > 0 ? (
                                    <ul>
                                        {ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Aucun ingrédient trouvé pour ce produit.</p>
                                )}

                                <div className="popup-buttons">
                                    <button className="btn-favoris" >❤️</button>
                                    <button className="btn-panier" >🛒</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProduitsSearch;