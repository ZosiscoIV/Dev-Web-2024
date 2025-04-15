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
                <Image src={`/assets/${image}`} className="produitImg" alt={produit} width={200} height={200}/>
                <h2>{produit}</h2>
                <p>{categorie}</p>
                <p><strong>Prix : {prix}€</strong></p>
            </a>
        </div>
    );
}


export default ProduitsSearch;
