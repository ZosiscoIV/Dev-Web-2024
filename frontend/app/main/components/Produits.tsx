"use client";
import "../css/Produits.css"
import Image from 'next/image';

interface ProduitsSearchProps {
    produit: string;
    categorie: string;
    prix: number;
    image: string;
}

const ProduitsSearch = ({ produit, categorie, prix, image }: ProduitsSearchProps) => {
    return (
        <div>
            <a className="produits" href="#">
                <h3>{produit}</h3>
                <p>Catégorie : {categorie}</p>
                <p>Prix : {prix} €</p>
                <Image src={image} alt={produit} />
            </a>
        </div>
    );
};

export default ProduitsSearch;
