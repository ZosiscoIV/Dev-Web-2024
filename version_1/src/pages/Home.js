import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Produits from "../componants/produits"; // Importation du composant Produits
import "../styles/Home.css";

function Home() {
    const [products, setProducts] = useState([]);
    const carouselRef = useRef(null);
    const API_URL = "http://54.36.181.253:6942";

    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des produits :", error);
            });
    }, []);


    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -250, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 250, behavior: "smooth" });
        }
    };

    return (
        <div className="home-container">
            <h1>Bienvenue sur Épicerie Didier 🏪</h1>
            <p>Recherchez et achetez vos produits préférés !</p>

            <div className="carousel-wrapper">
                <button className="scroll-button left" onClick={scrollLeft}>{"<"}</button>
                <div className="products-carousel" ref={carouselRef}>
                    {products.map((product) => (
                        <Produits
                            key={product.id}
                            title={product.produit}  // Utilisation des données du produit
                            description={`Quantité: ${product.quantite} | Status: ${product.status}`}
                            price={product.prix}
                            image={`../assets/${product.produit.toLowerCase()}.jpg`} // Si tu as des images dynamiques
                        />
                    ))}
                </div>
                <button className="scroll-button right" onClick={scrollRight}>{">"}</button>
            </div>
        </div>
    );
}

export default Home;
