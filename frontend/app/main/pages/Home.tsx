"use client"

import Produit from "../components/Produits";

function Home() {
    return (
        <div>
            <span>
                <h1>Bienvenue sur Épicerie Didier 🏪</h1>
                <p>Recherchez et achetez vos produits préférés !</p>
            </span>

            <Produit />
        </div>
    )
}
export default Home;