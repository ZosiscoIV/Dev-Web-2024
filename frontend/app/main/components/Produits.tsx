"use client";
import "../css/Produits.css"
import Image from 'next/image';

interface ProduitsSearchProps {
    produit: string;
    categorie: string[];
    description: string;
    prix: number;
    image: string;
    quantite: number;
    status: string;
    onImageError: () => void;
}


const ProduitsSearch = ({ produit, categorie, prix, image, quantite, onImageError, status}: ProduitsSearchProps) => {
    return (
        <div className="produits-scroll">
        <div className="produit-container">
            <a className="produit-card" href="#">
                <div className="produit-header">
                    <h3>{produit}</h3>
                </div>
                <div className="produit-body">
                    <p className="produit-category">Catégorie : <span>{categorie}</span></p>
                    <p className="produit-price">Prix : <strong>{prix.toFixed(2)} €</strong></p>
                    <p className="produit-quantity">Quantité : <span>{quantite}</span></p>
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
        </div>
    );
};

export default ProduitsSearch;
