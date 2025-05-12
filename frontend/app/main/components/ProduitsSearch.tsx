"use client";

import "@/app/main/css/ProduitsSearch.css"
import Image from 'next/image';

interface ProduitsSearchProps {
    produit: string;
    categorie: string;
    prix: number;
    image: string;
}

const ProduitsSearch = ({produit, categorie, prix, image} : ProduitsSearchProps) => {
    return (
        <div>
            <a className="produits" href="#">
                <Image src={image} className="produitImg" alt={produit}/>
                <h2>{produit}</h2>
                <p>{categorie}</p>
                <p><strong>Prix : {prix}€</strong></p>
            </a>
        </div>
    );
}


export default ProduitsSearch;
