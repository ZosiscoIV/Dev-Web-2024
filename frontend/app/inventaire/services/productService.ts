import axios from 'axios';
import { Product } from '../models/Product'
import {Categorie } from '../models/Categorie'


const API_URL = 'https://54.36.181.253:6942/api/products';
const API_URL_CAT = 'https://54.36.181.253:6942/api/categorie';


export const getProducts = async (query: string = ''):Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(API_URL + query);
    console.log('Réponse de l\'API des produits:', response.data);  // Ajoute cette ligne
    return response.data.map(prod => 
      new Product(prod.id, prod.produit, prod.quantite, prod.prix, prod.status, prod.dateLivraison)
    );
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn('Aucun produit trouvé.');
      return [];
    }
    console.error('Erreur lors de la récupération des produits:', error);
    throw error
  }
}

export const getCategorie = async (): Promise<Categorie[]> => {
  try {
    const response = await axios.get<Categorie[]>(API_URL_CAT);
    return response.data.map(cat => 
      new Categorie(cat.id, cat.categorie)
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
}