import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Produits from "../components/Produits"; // Importation du composant Produits
import "../css/Home.css";

// Interface Product mise à jour
interface Product {
    id: string; // Ajouter l'idProduit
    produit: string;
    categorie: string[];
    description: string;
    prix: number;
    image: string;
    quantite: number;
    status: string;
    onImageError: () => void;
}

function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [imageError, setImageError] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const API_URL = "http://localhost:6942";

    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then(response => {
                const result = response.data
                const repFiltre = result.filter((p: { dispo: boolean }) => p.dispo === true);
                setProducts(repFiltre);
                console.log("Données brutes reçues:", response.data)
                console.log("Données filtrée dispo", repFiltre);

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

    // Gestion de l'image par défaut en cas d'erreur
    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="home-container">
            <h1>Bienvenue sur Épicerie Didier 🏪</h1>
            <p>Recherchez et achetez vos produits préférés !</p>

            <div className="carousel-wrapper">
                <button className="scroll-button left" onClick={scrollLeft}>{"<"}</button>
                <div className="products-carousel" ref={carouselRef}>
                    {products.map((product, index) => {
                        // Utiliser un fallback pour la clé si idProduit est undefined ou null
                        const idKey = product.id|| `product-${index}`;

                        // Gérer les erreurs d'image individuellement au lieu d'utiliser un état global
                        const imageSrc = `../assets/${product.produit.toLowerCase()}.jpg`;

                        return (
                            <Produits
                                key={idKey}
                                id={product.id}
                                categorie={product.categorie}
                                produit={product.produit}
                                description={`Quantité: ${product.quantite} | Status: ${product.status}`}
                                prix={product.prix}
                                image={imageSrc}
                                onImageError={handleImageError}
                                status={product.status}
                            />
                        );
                    })}


                </div>
                <button className="scroll-button right" onClick={scrollRight}>{">"}</button>
            </div>
        </div>
    );
}

export default Home;