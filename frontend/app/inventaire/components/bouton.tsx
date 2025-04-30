import React, { useState } from 'react';
import { useProductForm } from '../hooks/useProductForm';
import Formulaire from './AddProduct';
import { Product } from '../models/Product';
import { Categorie } from '../models/Categorie';


type ButtonProps = {
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>; 
    setCategories: React.Dispatch<React.SetStateAction<Categorie[]>>;
    };
const Button: React.FC<ButtonProps> = ({setProducts, setCategories }) => {
    //const {formVisible,afficherForm} = useProductForm(setProducts, setCategories);
    const [affiForm, setAffiForm] = useState(false)
    
    return (
        <div>
            <button onClick={() => setAffiForm(true)}>Ajouter un nouveau produit</button>
            {affiForm && <Formulaire setProducts={setProducts} setCategories={setCategories} onClose={() => setAffiForm(false)}/>}
        </div>
    )
}
export default Button