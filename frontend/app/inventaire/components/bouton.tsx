import React from 'react';
import { useProductForm } from '../hooks/useProductForm';
import Formulaire from './AddProduct';
import { Product } from '../models/Product';
import { Categorie } from '../models/Categorie';


type ButtonProps = {
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>; 
    setCategories: React.Dispatch<React.SetStateAction<Categorie[]>>;
  };
const Button: React.FC<ButtonProps> = ({setProducts, setCategories}) => {
    const {formVisible, afficherForm} = useProductForm(setProducts, setCategories);
    
    return (
        <div>
            <button onClick={afficherForm}>Ajouter un nouveau produit</button>
            {formVisible && <Formulaire setProducts={setProducts} setCategories={setCategories}/>}
        </div>
    )
}
export default Button