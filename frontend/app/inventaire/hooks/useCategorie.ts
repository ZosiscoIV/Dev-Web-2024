import { useState, useEffect } from 'react';
import { getCategorie } from '../services/productService';
import { Categorie } from '../models/Categorie';
  
export const useCategorie = () => {
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchCategorie = async () => {
            try {
            const listecat = await getCategorie(); 
            console.log("cat recup: ", listecat) 
            setCategories(listecat);
            } catch (error) {
            console.error('Erreur lors de la récupération des catégorie:', error);
            setErrorMessage('Erreur lors de la récuperation des catégories');
            }
        };

        fetchCategorie();
    }, []);
    return {categories, errorMessage, setCategories};
}