import React, { useState } from 'react';
import { useProductForm } from '../hooks/useProductForm';
import { Categorie } from '../models/Categorie';
import { Product } from '../models/Product';
import ConfirmModal from './PopUp'; 
import FormulaireBase from './FormBase';

type FormProps = {
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>; // Déclare la prop setProducts
    setCategories: React.Dispatch<React.SetStateAction<Categorie[]>>;
    produitExistant?: Product;
    onClose: () => void;
    typeDate: string;
};


const FormulaireDate: React.FC<FormProps> = ({setProducts, setCategories, produitExistant, onClose, typeDate}) => {
    const {nom, dateFinVente, dateLivraison, handleChange,handleSubmit} = useProductForm(setProducts, setCategories, produitExistant);
    
    const message =  typeDate === 'livraison' ? (
        `Êtes-vous sûr de vouloir rentrer cette date de livraison pour le produit : ${nom} - date de livraison : ${dateLivraison}`
    ): (
        `Êtes-vous sûr de vouloir rentrer cette date de fin de vente pour le produit : ${nom} - date fin de vente : ${dateFinVente}`
    )

    const formField = typeDate === 'livraison' ? (
        <label>Date de livraison :
            <input type="date" name="dateLivraison" value={dateLivraison} onChange={handleChange} required/>
        </label>
        ):(
            <label>Date de fin de vente :
            <input type="date" name="dateFinVente" value={dateFinVente} onChange={handleChange} required/>
        </label>  
        )


    return (
        <FormulaireBase
            title={produitExistant? "Confirmer la modification": "Confirmer la création"}
            message={message}
            handleSubmit={handleSubmit}
            onClose={onClose}
            formField={formField}
        />
    );
};
export default FormulaireDate;