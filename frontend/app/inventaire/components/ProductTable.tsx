import React from "react";
import { Product } from "../models/Product";

type ProductTableProps = {
  products: Product[];
};

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  return (
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
            <td></td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ProductTable;