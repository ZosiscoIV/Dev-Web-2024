'use client';

import React, { useState } from 'react';
import { useProducts } from '../inventaire/hooks/useProducts';
import { useCategorie } from '../inventaire/hooks/useCategorie';

import Filtre from '../inventaire/components/Filters';
import ProductTable from '../inventaire/components/ProductTable';
import Button from '../inventaire/components/BoutonAdd';
import AlertModal from '../inventaire/components/AlerteStock';
import Header from '../inventaire/components/header';

import "../inventaire/css/inventaire.css";

const Page = () => {
  const [reloadAllProducts, setReloadAllProducts] = useState(0);

  const [categorie, setCateg] = useState<string>('tout');
  const [stock, setStock] = useState<'tout'| 'enStock' | 'faibleStock' | 'horsStock'>('tout');

  const {products, errorMessage, setProducts} = useProducts(categorie, stock);
  const { products: allProducts } = useProducts('tout', 'tout', reloadAllProducts);
  const {categories, setCategories} = useCategorie()

  const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCateg(e.target.value);
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value as 'tout'| 'enStock' | 'faibleStock' | 'horsStock');
  };

  // Alerte si stock faible
  const [showModal, setShowModal] = useState(true);
    
  const handleConfirm = () => {
      setShowModal(false);
  };  
     
  const handleStockFaible = () => {
      setCateg('tout')
      setStock('faibleStock'); 
  };
  const refreshAllProducts = () => {
    setReloadAllProducts(prev => prev + 1);
  };
  const stockFaible = allProducts.filter(p => p.quantite < 5);
  const msgListe = stockFaible.map(p => 
     ` ${p.produit} - ${p.quantite} ${p.unite} ${p.dateLivraison ? `- livraison le : ${p.getFormatDate(p.dateLivraison)}` : "- livraison le : /"}`);


  return (
      <div>
        <Header alertStock={msgListe.length > 0} stockFaibleClick={handleStockFaible}/>
        <AlertModal open={showModal} message={msgListe} onConfirm={handleConfirm}/>
        <Button setProducts={setProducts} setCategories={setCategories}/>
        <Filtre categorie={categorie} stock={stock} categories={categories} onCategorieChange={handleCategorieChange} onStockChange={handleStockChange}/>
        <div id="corps">
          {errorMessage ?(<p style={{fontSize:"25px", textAlign:"center", fontWeight:"bold", padding:"20px"}}>{errorMessage}</p>): <ProductTable products={products} setProducts={setProducts} setCategories={setCategories} />}
        </div>
      </div>
  );
};

export default Page;