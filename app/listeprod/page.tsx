'use client';

import React, { useState } from 'react';
import { useProducts } from '../inventaire/hooks/useProducts';
import { useCategorie } from '../inventaire/hooks/useCategorie';

import Header from "../main/components/Header";
import Filtre from '../inventaire/components/Filters';
import ProductTable from '../inventaire/components/ProductTable';
import Button from '../inventaire/components/bouton';

import "../inventaire/css/inventaire.css";

const Page = () => {
  const [categorie, setCateg] = useState<string>('tout');
  const [stock, setStock] = useState<'tout'| 'enStock' | 'horsStock'>('tout');

  const {products, errorMessage, setProducts} = useProducts(categorie, stock);
  const {categories, setCategories} = useCategorie()

  const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCateg(e.target.value);
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value as 'tout'| 'enStock' | 'horsStock');
  };

  return (
      <div>
          <Header />
      <div>
        <h1>Inventaire</h1>
        <Button setProducts={setProducts} setCategories={setCategories}/>
        <Filtre categorie={categorie} stock={stock} categories={categories} onCategorieChange={handleCategorieChange} onStockChange={handleStockChange}/>
        <div id="corps">
          {errorMessage ?(<p className="error-message">{errorMessage}</p>): <ProductTable products={products} />}
        </div>
      </div>
      </div>
  );
};

export default Page;