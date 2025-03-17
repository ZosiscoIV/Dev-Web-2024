'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, getCategorie } from '../services/productService';
import "../../css/inventaire.css";

import { format } from 'date-fns';

type Product = {
  id: number;
  produit: string;
  quantite: number;
  prix: number;
  status: string;
  dateLivraison: string | null;  
};
type Categorie = {
  id: number;
  categorie: string;
}

const ListeProd = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [categorie, setCateg] = useState<string>('');
  const [stock, setStock] = useState<'tout'| 'enStock' | 'horsStock'>('tout');
  const [categories, setCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const listecat = await getCategorie();  
        setCategories(listecat);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégorie:', error);
        setErrorMessage('Erreur lors de la récuperation des catégories');
      }
    };

    fetchCategorie();
  }, []);

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

  const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCateg(e.target.value);
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value as 'tout'| 'enStock' | 'horsStock');
  };

  return (
    <div>
      <h1>Inventaire</h1>
      <div id="filtre">
        <label htmlFor="categorie">Catégorie  </label>
        <select id="categorie" value={categorie} onChange={handleCategorieChange}>
          <option value="tout">Toutes les catégories</option>
          {categories.map((categ) => (
            <option key={categ.id} value={categ.categorie}>{categ.categorie}</option>
          ))}
        </select>
      
        <input id="tout" type="radio" value="tout"checked={stock === 'tout'} onChange={handleStockChange}/>
        <label htmlFor="tout">Tout le stock  </label>
       
        <input id="stock" type="radio" value="enStock" checked={stock === 'enStock'} onChange={handleStockChange}/>
        <label htmlFor="stock">En stock  </label>
 
        <input id="horsStock" type="radio" value="horsStock" checked={stock === 'horsStock'} onChange={handleStockChange}/>
        <label htmlFor="horsStock">Hors stock</label>
      </div>
      <div id="corps">
        {errorMessage ?(<p>{errorMessage}</p>): (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Quantié</th>
              <th>Prix (€)</th>
              <th>Stock</th>
              <th>Date livraison</th>
              <th>Modification</th>
              <th>Suppression</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className={(prod.quantite === 0 ? "horsStock": prod.quantite < 5 ? "faibleStock" : "enStock")}>
                <td>{prod.produit}</td>
                <td>{prod.quantite}</td>
                <td>{prod.prix.toFixed(2)}</td>
                <td>{prod.quantite === 0 ? "❌ Hors Stock" : prod.quantite < 5 ? "⚠️ Faible Stock" : "✅ En Stock"}</td>
                <td>{(prod.dateLivraison == null ? "": format(new Date(prod.dateLivraison), 'dd/MM/yyyy'))}</td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>)}
      </div>
    </div>
  );
};

export default ListeProd;