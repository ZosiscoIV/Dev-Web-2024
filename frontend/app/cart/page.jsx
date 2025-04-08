'use client';
import { useState } from 'react';

const initialCart = [
  { id: 1, name: 'Pomme', price: 2.5, quantity: 1, stock: 10 },
  { id: 2, name: 'Poire', price: 3, quantity: 2, stock: 5 },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);

  const handleQuantityChange = (id, newQty) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (newQty < 0) return item;
          if (newQty > item.stock) {
            alert(`Stock insuffisant (max: ${item.stock})`);
            return item;
          }
          if (newQty === 0) {
            const confirmRemove = confirm("Souhaitez-vous retirer ce produit du panier ?");
            return confirmRemove ? null : { ...item, quantity: 1 };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Votre panier</h1>
      {cart.map(item => (
        <div key={item.id} className="flex items-center justify-between border-b py-2">
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">Prix unitaire : {item.price.toFixed(2)}€</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 bg-gray-200 rounded"
              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            >−</button>
            <input
              type="number"
              min="0"
              max={item.stock}
              className="w-14 text-center border rounded"
              value={item.quantity}
              onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
            />
            <button
              className="px-2 py-1 bg-gray-200 rounded"
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            >+</button>
          </div>
          <div>{(item.quantity * item.price).toFixed(2)}€</div>
        </div>
      ))}
      <div className="text-right font-bold text-lg mt-4">Total : {total.toFixed(2)}€</div>
    </div>
  );
}
