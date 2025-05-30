"use client";
import { useState, useEffect } from "react";
import React from "react";
import Header from "../main/components/Header"; // Import du composant Header

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:6942/api/cart");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        const result = await response.json();
        console.log("Données reçues de l'API:", result);

        if (Array.isArray(result.data)) {
          const formattedData = result.data.map((item) => ({
            ...item,
            name: item.nom,
            price: item.prix,
            quantity: item.quantite,
            stock: item.stock,
          }));
          setCart(formattedData);
        } else {
          console.error("La réponse de l'API n'est pas un tableau :", result);
          setCart([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (idCommande, value) => {
    if (value < 0) return;

    try {
      const response = await fetch(`http://localhost:6942/api/cart/${idCommande}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantite: value }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la quantité.");
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.idCommande === idCommande ? { ...item, quantity: value } : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité :", error);
    }
  };

  const handleAdjust = async (idCommande, delta) => {
    const item = cart.find((item) => item.idCommande === idCommande);

    if (!item) {
      console.error(`Aucun article trouvé avec idCommande=${idCommande}`);
      return;
    }

    const newQuantity = item.quantity + delta;

    if (newQuantity > item.stock) {
      alert(`La quantité demandée dépasse le stock disponible (${item.stock}).`);
      return;
    }

    if (newQuantity < 0) return;

    if (newQuantity === 0) {
      if (confirm("Souhaitez-vous retirer ce produit du panier ?")) {
        try {
          const response = await fetch(`http://localhost:6942/api/cart/${idCommande}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la suppression du produit.");
          }

          setCart((prevCart) => prevCart.filter((item) => item.idCommande !== idCommande));
        } catch (error) {
          console.error("Erreur lors de la suppression du produit :", error);
        }
      }
      return;
    }

    handleQuantityChange(idCommande, newQuantity);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      {/* Barre de navigation */}
      <Header />

      <main className="cart-container">
        <h1 className="text-2xl font-bold mb-6">Mon Panier</h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Votre panier est vide.</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.idCommande}
              className="cart-item flex justify-between items-center border-b py-4"
            >
              <div className="cart-item-details flex-1">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.stock} en stock – {item.price}€ l'unité
                </p>
              </div>

              <div className="cart-item-actions flex items-center gap-2">
                <button
                  onClick={() => handleAdjust(item.idCommande, -1)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-16 text-center border rounded text-black no-arrows"
                  value={item.quantity}
                  min="0"
                  max={item.stock}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setCart((prevCart) =>
                        prevCart.map((cartItem) =>
                          cartItem.idCommande === item.idCommande
                            ? { ...cartItem, quantity: "" }
                            : cartItem
                        )
                      );
                      return;
                    }

                    const parsedValue = parseInt(value, 10);

                    if (parsedValue > item.stock) {
                      handleQuantityChange(item.idCommande, item.stock);
                      return;
                    }

                    if (parsedValue === 0) {
                      if (confirm("Souhaitez-vous retirer ce produit du panier ?")) {
                        handleAdjust(item.idCommande, -item.quantity);
                      }
                      return;
                    }

                    if (parsedValue >= 0) {
                      handleQuantityChange(item.idCommande, parsedValue);
                    }
                  }}
                />
                <button
                  onClick={() => handleAdjust(item.idCommande, 1)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
              </div>

              <div className="cart-item-total w-24 text-right text-gray-800">
                {(item.price * item.quantity).toFixed(2)}€
              </div>
            </div>
          ))
        )}

        <div className="text-right mt-6 text-xl font-semibold">
          Total : {total.toFixed(2)}€
        </div>
      </main>

      <style jsx>{`
        .cart-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .cart-container {
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 120px; /* Ajoute de l'espace entre les colonnes */
        }

        .cart-item-details {
          flex: 2; /* Étend la section des détails */
        }

        .cart-item-actions {
          flex: 1; /* Étend la section des actions */
          display: flex;
          justify-content: center;
        }

        .cart-item-total {
          flex: 1; /* Étend la section du total */
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}