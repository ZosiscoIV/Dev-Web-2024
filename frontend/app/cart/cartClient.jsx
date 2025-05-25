"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import React from "react";

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

        // Vérifiez si la réponse contient un tableau dans `data`
        if (Array.isArray(result.data)) {
          const formattedData = result.data.map((item) => ({
            ...item,
            quantity: item.quantite, // Utiliser la quantité existante
          }));
          setCart(formattedData);
        } else {
          console.error("La réponse de l'API n'est pas un tableau :", result);
          setCart([]); // Définit un panier vide si la réponse est incorrecte
        }
      } catch (error) {
        console.error(error);
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
      console.error(error);
    }
  };

  const handleAdjust = async (idCommande, delta) => {
    const item = cart.find((item) => item.idCommande === idCommande);
    const newQuantity = item.quantity + delta;

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
          console.error(error);
        }
      }
      return;
    }

    handleQuantityChange(idCommande, newQuantity);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="flex justify-between items-center mb-6 px-4 py-3 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800">Ma Boutique</h2>
        <div className="flex space-x-4">
          <Link href="/" className="text-blue-600 hover:underline">
            Accueil
          </Link>
          <Link href="/listeprod" className="text-blue-600 hover:underline">
            Gestion Stock
          </Link>
          <Link href="/aide" className="text-blue-600 hover:underline">
            Aide
          </Link>
        </div>
      </nav>

      <h1 className="text-2xl font-bold mb-6">Mon Panier</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Votre panier est vide.</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.idCommande}
            className="flex justify-between items-center border-b py-4"
          >
            <div className="flex-1">
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.stock} en stock – {item.price}€ l'unité
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdjust(item.idCommande, -1)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                -
              </button>
              <input
                type="number"
                className="w-16 text-center border rounded text-black"
                value={item.quantity}
                min="0"
                max={item.stock}
                onBlur={(e) => handleAdjust(item.idCommande, 0)}
                onChange={(e) =>
                  handleQuantityChange(item.idCommande, parseInt(e.target.value) || 0)
                }
              />
              <button
                onClick={() => handleAdjust(item.idCommande, 1)}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                +
              </button>
            </div>

            <div className="w-24 text-right text-gray-800">
              {(item.price * item.quantity).toFixed(2)}€
            </div>
          </div>
        ))
      )}

      <div className="text-right mt-6 text-xl font-semibold">
        Total : {total.toFixed(2)}€
      </div>

      <style jsx>{`
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
