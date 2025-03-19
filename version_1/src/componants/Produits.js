import pate from "../assets/pâte.jpg";
import "../styles/Produits.css"

    const Produits = ({title, description, price, image}) => {
        return (
            <div>
                <a className="produits" href="#">
                    <img src={image} className="produitImg" alt={title}/>
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <p><strong>Prix : {price}€</strong></p>
                </a>
            </div>
        );
    }


export default Produits;
