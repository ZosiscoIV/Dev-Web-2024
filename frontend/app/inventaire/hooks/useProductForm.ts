import { useEffect, useState } from 'react';
import { getProducts, getCategorie} from '../services/productService'
import { Product } from '../models/Product';
import { Categorie } from '../models/Categorie';

import { format } from 'date-fns';
function formatDateForInput(date: string | null): string {
    if (!date) return '';
    try {
        return format(new Date(date), 'yyyy-MM-dd');
    } catch (e) {
        return '';
    }
}
export const useProductForm = (setProducts: React.Dispatch<React.SetStateAction<Product[]>>, setCategories:React.Dispatch<React.SetStateAction<Categorie[]>>, produitExistant?: Product) => {
    const [nom, setNom] = useState<string>('');
    const [quantite, setQuantite] = useState<number>(0);
    const [categorie, setCategorie] = useState<string>('');
    const [unite, setUnite] = useState<string>('');
    const [prix, setPrix] = useState<number>(0);
    const [dateDebutVente, setDateDebutVente] = useState<string>('');
    const [dateFinVente, setDateFinVente] = useState<string>('');
    const [dateLivraison, setDateLivraison] = useState<string>('');
    const [taxe, setTaxe] = useState<number>(0);
    

    useEffect( () => {
        if (produitExistant){
            console.log("produitExistant dans useEffect:", produitExistant);
            console.log('Détails du produitExistant :', JSON.stringify(produitExistant, null, 2));


            setNom(produitExistant.produit);
            setQuantite(produitExistant.quantite);
            setCategorie(produitExistant.categorie);
            setUnite(produitExistant.unite);
            setPrix(produitExistant.prix);
            setDateDebutVente(formatDateForInput(produitExistant.dateDebutVente));
            setDateFinVente(formatDateForInput(produitExistant.dateFinVente || ''));
            setDateLivraison(formatDateForInput(produitExistant.dateLivraison || ''));
            setTaxe(produitExistant.taxe);
        }
        else {
            setNom('');
            setQuantite(0);
            setCategorie('');
            setUnite('');
            setPrix(0);
            setDateDebutVente('');
            setDateFinVente('');
            setDateLivraison('');
            setTaxe(0);
        }
    },[produitExistant?.id])

    const resetForm = () => {
        setNom('');
        setQuantite(0);
        setCategorie('');
        setUnite('');
        setPrix(0);
        setDateDebutVente('');
        setDateFinVente('');
        setDateLivraison('');
        setTaxe(0);
    };
    const handleResponse = async (response: Response, msgReussi : string, msgErreur: string) =>{
        if (response.ok) {
            resetForm()
            try {
                const prod = await getProducts();
                const cat = await getCategorie();
                setProducts(prod);
                setCategories(cat);

            } 
            catch (error){
                alert('Erreur lors de la mise à jour')
            }

            alert(msgReussi);
        } 
        else {
            alert(msgErreur);
        }
    } 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prépare les données à envoyer au backend
        const data = {
            nom,
            quantite,
            categorie,
            unite,
            prix,
            dateDebutVente,
            dateFinVente,
            dateLivraison,
            taxe,
            ...(produitExistant?.id && { id: produitExistant.id })

        };

        if (produitExistant){
            try {
                const response = await fetch(`http://localhost:6942/api/products/${produitExistant.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                console.log('Statut de la réponse:', response.status);  // Statut HTTP (200, 400, etc.)
                console.log(response);
                await handleResponse(response, 'Produit modifié avec succès !', 'Erreur lors de la modification du produit')
            } 
            catch (error) {
                console.error('Erreur de réseau:', error);
                alert('Une erreur est survenue lors de l\'envoi des données');
            }
        }

        else {
            // Envoie la requête POST au backend
            try {
                const response = await fetch('http://localhost:6942/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                console.log('Statut de la réponse:', response.status);  
                console.log(response);
                await handleResponse(response, 'Produit créé avec succès !', 'Erreur lors de la création du produit');
            } catch (error) {
                console.error('Erreur de réseau:', error);
                alert('Une erreur est survenue lors de l\'envoi des données');
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name
        const val = event.target.value
        if (name === "nom") setNom(val);
        if (name === "quantite") {
            if (val === "") {
                setQuantite(0);
            } else {
                let valeur = val.replace(/^0+(?=\d)/, ""); // Supprime le 0 devant un chiffre
                setQuantite(parseInt(valeur, 10));
            }
        };
        if (name === "categorie") setCategorie(val);
        if (name === "unite") setUnite(val);
        if (name === "prix") {
            if (val === "") {
                setPrix(0);
            } else {
                let valeur = val.replace(/^0+(?=\d)/, ""); // Supprime le 0 devant un chiffre
                setPrix(parseFloat(valeur));
            }
        }
        if (name === "dateDebutVente") setDateDebutVente(val);
        if (name === "dateFinVente") setDateFinVente(val);
        if (name === "dateLivraison") setDateLivraison(val);
        if (name === "taxe") {
            if (val === "") {
                setTaxe(0);
            } else {
                let valeur = val.replace(/^0+(?=\d)/, ""); // Supprime le 0 devant un chiffre
                setTaxe(parseInt(valeur, 10));
            }
        };
    };
    return {nom, quantite,categorie, unite, prix,dateDebutVente,dateFinVente, dateLivraison, taxe, handleChange,handleSubmit};
};