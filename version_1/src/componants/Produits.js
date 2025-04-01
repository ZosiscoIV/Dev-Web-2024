import pate from "../assets/pâte.jpg";
import "../styles/Produits.css"

    const Produits = ({produit, categorie, prix, image}) => {
        return (
            <div>
                <a className="produits" href="#">
                    <img src={image} className="produitImg" alt={produit}/>
                    <h2>{produit}</h2>
                    <p>{categorie}</p>
                    <p><strong>Prix : {prix}€</strong></p>
                </a>
            </div>
        );
    }


export default Produits;
