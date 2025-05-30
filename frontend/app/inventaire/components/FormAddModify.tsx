import React from 'react';
import { useProductForm } from '../hooks/useProductForm';
import { Categorie } from '../models/Categorie';
import { Product } from '../models/Product';
import FormulaireBase from './FormBase';

type FormProps = {
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>; // Déclare la prop setProducts
    setCategories: React.Dispatch<React.SetStateAction<Categorie[]>>;
    produitExistant?: Product;
    onClose: () => void;
};

const Formulaire: React.FC<FormProps> = ({setProducts, setCategories, produitExistant, onClose}) => {
    const {nom, quantite,categorie, unite, prix,dateDebutVente,dateFinVente, dateLivraison, taxe,image, setImage, handleChange,handleSubmit} = useProductForm(setProducts, setCategories, produitExistant);
    
    const message = `Êtes-vous sûr de vouloir ${produitExistant ? "modifier" : "créer"} ce produit : ${nom} - quantite: ${quantite} - categorie : ${categorie} - unite : ${unite} - prix : ${prix} - mise en vente : ${dateDebutVente} ${dateFinVente ? `- fin de vente :${dateFinVente}` : ""} ${dateLivraison ? `- date de livraison :${dateLivraison}` : ""} - taxe: ${taxe}`

    const formField = (
        <>
            <label>Nom :
                <input type="text" name="nom" value={nom} onChange={handleChange} required disabled={produitExistant?true:false}/>
            </label>
            <label>Quantité :
                <input type="number" name="quantite" value={quantite === 0 ? "" : quantite} onChange={handleChange} placeholder='0' min="0"/>
            </label>
            <label>Categorie :
                <input type="text" name="categorie" value={categorie} onChange={handleChange} required />
            </label>
            <label>Unité :
                <input type="text" name="unite" value={unite} onChange={handleChange} required/>
            </label>
            <label>Prix (€) :
                <input type="number" name="prix" value={prix === 0 ? "" : prix} onChange={handleChange} placeholder='0' min="0" step="0.01"/>
            </label>
            <label>Date de mise en vente:
                <input type="date" name="dateDebutVente" value={dateDebutVente} onChange={handleChange} required/>
            </label>
            <label>Date de fin de mise en vente :
                <input type="date" name="dateFinVente" value={dateFinVente} onChange={handleChange}/>
            </label>
            <label>Date de livraison :
                <input type="date" name="dateLivraison" value={dateLivraison} onChange={handleChange}/>
            </label>
            <label>Taxe (%) :
                <input type="number" name="taxe" value={taxe === 0 ? "" : taxe} onChange={handleChange} placeholder='0' min="0" step="0.01"/>
            </label>
            <label>Image du produit :
                {produitExistant?.imageURL &&(
                      <img src={`http://localhost:3000${produitExistant.imageURL}?t=${Date.now()}`} alt="Image actuelle" style={{width:'150px'}}/>
                )}
                <input type="file" id="fileInput" name="image" accept="image/jpeg, image/jpg" 
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.type !== 'image/jpeg') {
                            alert("Seuls les fichiers JPEG (.jpg) sont autorisés.");
                            e.target.value = ""; 
                            return;
                        }
                        setImage(file || null);}}  required={!produitExistant} />
            </label>

        </>
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
export default Formulaire;