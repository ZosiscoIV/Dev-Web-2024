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
        <div>
            <a className="produits" href="#">
                <h3>{produit}</h3>
                <p>Catégorie : {categorie}</p>
                <p>Prix : {prix} €</p>
                <p>Quantité : {quantite} €</p>
                <p>Status : {status}</p> {/* Affichage du statut */}
                <Image src={image} alt={produit} onError={onImageError} />
            </a>
        </div>
    );
};

export default ProduitsSearch;
