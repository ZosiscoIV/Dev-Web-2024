'use client';

import React, { useState } from 'react';
import { useProducts } from '../inventaire/hooks/useProducts';
import { useCategorie } from '../inventaire/hooks/useCategorie';

import Filtre from '../inventaire/components/Filters';
import ProductTable from '../inventaire/components/ProductTable';
import Button from '../inventaire/components/bouton';
import AlertModal from '../inventaire/components/AlerteStock';

import "../inventaire/css/inventaire.css";

const Page = () => {
  const [categorie, setCateg] = useState<string>('tout');
  const [stock, setStock] = useState<'tout'| 'enStock' | 'faibleStock' | 'horsStock'>('tout');

  const {products, errorMessage, setProducts} = useProducts(categorie, stock);
  const {categories, setCategories} = useCategorie()

  const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCateg(e.target.value);
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value as 'tout'| 'enStock' | 'faibleStock' | 'horsStock');
  };

  const [showModal, setShowModal] = useState(true);
  
  const stockFaible = products.filter(p => p.quantite < 5);
  const handleConfirm = () => {
      setShowModal(false);
      console.log(msgListe);
  };
  const msgListe = stockFaible.map(p => 
     ` ${p.produit} - ${p.quantite} ${p.unite} ${p.dateLivraison ? `- livraison le : ${p.getFormatDate()}` : "- livraison le : /"}`);
  
  return (
      <div>
        <h1>Inventaire</h1>
        <AlertModal open={showModal} message={msgListe} onConfirm={handleConfirm}/>
        <Button setProducts={setProducts} setCategories={setCategories}/>
        <Filtre categorie={categorie} stock={stock} categories={categories} onCategorieChange={handleCategorieChange} onStockChange={handleStockChange}/>
        <div id="corps">
          {errorMessage ?(<p style={{fontSize:"25px", textAlign:"center", fontWeight:"bold", padding:"20px"}}>{errorMessage}</p>): <ProductTable products={products} setProducts={setProducts} setCategories={setCategories}/>}
        </div>
      </div>
  );
};

export default Page;