
import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { Product } from '../models/Product';

export const useProducts = (categorie: string, stock: "tout" | "enStock" | "horsStock") => {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = '';
        if (categorie || stock !== 'tout') {
          query = '?';
          if (categorie && categorie !== 'tout') { query += `categorie=${encodeURIComponent(categorie)}&`;}
          if (stock === 'enStock') {query += `enStock=true&`;}
          else if (stock === 'horsStock') {query += `enStock=false&`;}
        }
        if (query.endsWith('&')) {
          query = query.slice(0, -1);
        }
        const listeProduit = await getProducts(query); 
        if (listeProduit.length === 0){
          setProducts([]);
          setErrorMessage('Aucun produit trouvé')
        }
        else{
          setProducts(listeProduit);
          setErrorMessage('')
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        setErrorMessage('Erreur lors de la récupération des produits');
      }
    };

    fetchProducts();
  }, [categorie, stock]);
  return {products, errorMessage, setProducts};
};
