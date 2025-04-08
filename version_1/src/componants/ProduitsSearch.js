import "../styles/ProduitsSearch.css"

const ProduitsSearch = ({produit, categorie, prix, image}) => {
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


export default ProduitsSearch;
