import axios from 'axios';

const API_URL = 'http://localhost:6942/api/products';
const API_URL_CAT = 'http://localhost:6942/api/categorie';

export const getProducts = async (query = '') => {
  try {
    const response = await axios.get(API_URL + query);
    console.log('Réponse de l\'API des produits:', response.data);  // Ajoute cette ligne
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};

export const getCategorie = async () => {
  try {
    const response = await axios.get(API_URL_CAT);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};