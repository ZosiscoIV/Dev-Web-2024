import React, { useState } from 'react';
import { Product } from "../models/Product";
import { Categorie} from "../models/Categorie";
import { useProductForm } from '../hooks/useProductForm';
import Formulaire from './AddProduct';
import FormulaireDate from './AddLivraison';

type ProductTableProps = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Categorie[]>>;
};
    
const ProductTable: React.FC<ProductTableProps> = ({ products, setProducts, setCategories }) => {
  const [affiForm, setAffiForm] = useState(false)
  const [selectProduct, setSelectProduct] = useState<Product | undefined>(undefined)
  const [affiFormDate, setAffiFormDate] = useState(false)
  const [typeDate, setTypeDate] = useState<'livraison' | 'finVente' | null>(null);

  const handleModif = (product: Product) => {
    setSelectProduct(product);
    setAffiForm(true);
  };
  const handleAjoutDateLivraison = (product:Product) => {
    setSelectProduct(product);
    setTypeDate('livraison');
    setAffiFormDate(true);
  }
  const handleAjoutDateFinVente = (product:Product) => {
    setSelectProduct(product);
    setTypeDate('finVente');
    setAffiFormDate(true);
  }
  return (
    <>
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Quantié</th>
          <th>Prix (€)</th>
          <th>Taxe (%)</th>
          <th>Stock</th>
          <th>Date mise en vente</th>
          <th>Date livraison</th>
          <th>Date fin de vente</th>
          <th>Modification</th>
          <th>Suppression</th>
        </tr>
      </thead>
      <tbody>
        {products.map((prod) => (
          <tr key={prod.id} className={(prod.getStatus())}>
            <td>{prod.produit}</td>
            <td>{prod.quantite} {prod.unite}</td>
            <td>{prod.prix.toFixed(2)}</td>
            <td>{prod.taxe}</td>
            <td>{prod.getStatus()}</td>
            <td>{prod.getFormatDate(prod.dateDebutVente)}</td>
            <td>
              {prod.dateLivraison !== null? prod.getFormatDate(prod.dateLivraison): (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <button onClick={() => handleAjoutDateLivraison(prod)}>Ajouter une date de livraison</button>
                </div>)}
            </td>
            <td>
              {prod.dateFinVente !== null? prod.getFormatDate(prod.dateFinVente): (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <button onClick={() => handleAjoutDateFinVente(prod)}>Ajouter une date de fin de vente</button>
                </div>)}
            </td>
            <td>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>

              <button onClick={() => handleModif(prod)}>Modifier un produit</button>
              </div>
            </td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>

    {affiForm && (<Formulaire setProducts={setProducts} setCategories={setCategories} produitExistant={selectProduct} onClose={() => setAffiForm(false)}/>)}
    {affiFormDate && typeDate && (<FormulaireDate setProducts={setProducts} setCategories={setCategories} produitExistant={selectProduct} onClose={() => {setAffiFormDate(false); setTypeDate(null)}} typeDate={typeDate}/>)}
    {affiFormDate && typeDate && (<FormulaireDate setProducts={setProducts} setCategories={setCategories} produitExistant={selectProduct} onClose={() => { setAffiFormDate(false); setTypeDate(null)}} typeDate={typeDate}/>)}

  </>
  );
};
export default ProductTable;