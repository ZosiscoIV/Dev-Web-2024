import { useEffect, useState } from 'react';
import { getProducts, getCategorie} from '../services/productService'
import { Product } from '../models/Product';
import { Categorie } from '../models/Categorie';
import axiosClient from '../../fetchWithToken'

import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

function formatDateForInput(date: string | null): string {
    if (!date) return '';
    try {
        return format(new Date(date), 'yyyy-MM-dd');
    } 
    catch (e) {
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
    const [image, setImage] = useState<File | null>(null);

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
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('quantite', quantite.toString());
        formData.append('categorie', categorie);
        formData.append('unite', unite);
        formData.append('prix', prix.toString());
        formData.append('dateDebutVente', dateDebutVente);
        formData.append('dateFinVente', dateFinVente);
        formData.append('dateLivraison', dateLivraison);
        formData.append('taxe', taxe.toString());
        if (image) formData.append('image', image);
        if (produitExistant?.id) formData.append('id', produitExistant.id.toString());
        const roleRes = await axiosClient.get<boolean>('/auth/role');
        if (roleRes.data === false){
            alert("Vous n'avez pas les droits pour modifier ce produit.");
            return;
        }
        console.log(roleRes.data)
        if (produitExistant){
            
            try {
                const response = await fetch(`http://localhost:6942/api/products/${produitExistant.id}`, {
                    method: 'PUT',
                    body: formData,
                });
                console.log('Statut de la réponse:', response.status);  // Statut HTTP (200, 400, etc.)
                console.log(response);
                console.log("imageURL:", produitExistant?.imageURL);

                await handleResponse(response, 'Produit modifié avec succès !', 'Erreur lors de la modification du produit')
            } 
            catch (error) {
                console.error('Erreur de réseau:', error);
                alert('Une erreur est survenue lors de l\'envoi des données');
            }
        }

        else {
            try {
                const response = await fetch('http://localhost:6942/api/products', {
                    method: 'POST',
                    body: formData,
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
                let valeur = val.replace(/^0+(?=\d)/, ""); 
                setQuantite(parseInt(valeur, 10));
            }
        };
        if (name === "categorie") setCategorie(val);
        if (name === "unite") setUnite(val);
        if (name === "prix") {
            if (val === "") {
                setPrix(0);
            } else {
                let valeur = val.replace(/^0+(?=\d)/, ""); 
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
                let valeur = val.replace(/^0+(?=\d)/, ""); 
                setTaxe(parseInt(valeur, 10));
            }
        };
    };
    return {nom, quantite,categorie, unite, prix,dateDebutVente,dateFinVente, dateLivraison, taxe,image, setImage, handleChange,handleSubmit};
};