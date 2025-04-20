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
}

interface Produit {
    id: string;
    produit: string;
    categorie: string | string[];
    description: string;
    prix: number;
    image: string;
    quantite: number;
    status: string;
    infoNutritionnelles?: InfosNutritionnelles;
    allergenes?: string[];
    composition?: string;
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

    // Fonction pour récupérer les données nutritionnelles et allergènes
    const fetchProductDetails = async () => {
        try {
            console.log("idProduit: ", id);
            const nutritionRes = await fetch(`http://localhost:6942/api/produit/${id}/nutrition`);
            const nutritionData = await nutritionRes.json();
            setInfosNutritionnelles(nutritionData);

            const allergenesRes = await fetch(`http://localhost:6942/api/produit/${id}/allergenes`);
            const allergenesData = await allergenesRes.json();
            setAllergenes(allergenesData.map((a: { nom: string }) => a.nom));
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du produit :", error);
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

                        {infosNutritionnelles ? (
                            <div className="nutritional-content">
                                <div className="nutritional-item">
                                    <span>Calories:</span>
                                    <strong>{infosNutritionnelles.calories} kcal</strong>
                                </div>
                                <div className="nutritional-item">
                                    <span>Protéines:</span>
                                    <strong>{infosNutritionnelles.proteines} g</strong>
                                </div>
                                <div className="nutritional-item">
                                    <span>Glucides:</span>
                                    <strong>{infosNutritionnelles.glucides} g</strong>
                                </div>
                                <div className="nutritional-item">
                                    <span>Lipides:</span>
                                    <strong>{infosNutritionnelles.lipides} g</strong>
                                </div>
                                {infosNutritionnelles.fibres !== undefined && (
                                    <div className="nutritional-item">
                                        <span>Fibres:</span>
                                        <strong>{infosNutritionnelles.fibres} g</strong>
                                    </div>
                                )}
                                {infosNutritionnelles.sel !== undefined && (
                                    <div className="nutritional-item">
                                        <span>Sel:</span>
                                        <strong>{infosNutritionnelles.sel} g</strong>
                                    </div>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProduitsSearch;
