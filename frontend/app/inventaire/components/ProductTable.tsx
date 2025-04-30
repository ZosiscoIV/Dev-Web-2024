import React, { useState } from 'react';
import { Product } from "../models/Product";
import { Categorie} from "../models/Categorie";
import { useProductForm } from '../hooks/useProductForm';
import Formulaire from './AddProduct';
type ProductTableProps = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Categorie[]>>;
};
    
const ProductTable: React.FC<ProductTableProps> = ({ products, setProducts, setCategories }) => {
  const [affiForm, setAffiForm] = useState(false)
  const [selectProduct, setSelectProduct] = useState<Product | undefined>(undefined)

  const handleModif = (product: Product) => {
    setSelectProduct(product);
    setAffiForm(true);
  };
  return (
    <>
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
          <tr key={prod.id} className={(prod.getStatus())}>
            <td>{prod.produit}</td>
            <td>{prod.quantite}</td>
            <td>{prod.prix.toFixed(2)}</td>
            <td>{prod.getStatus()}</td>
            <td>{prod.getFormatDate()}</td>
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
  </>
  );
};
export default ProductTable;