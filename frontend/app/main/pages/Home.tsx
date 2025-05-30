"use client"

import Produit from "../components/Produits";
import "../css/Home.css"

function Home() {
    return (
        <main className="home-container">
            <header>
                <h1>Bienvenue sur Épicerie Didier 🏪</h1>
                <p>Recherchez et achetez vos produits préférés !</p>
            </header>

            <Produit />
        </main>
    )
}
export default Home;
