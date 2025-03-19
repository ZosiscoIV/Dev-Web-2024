import { useNavigate } from "react-router-dom";
import '../../../dev3/src/styles/Header.css'
import logo from '../assets/logo.png'

function Header() {
    const navigate = useNavigate();
    return (
        <header className="Header">
            <div className="BannerImg">
                <img src={logo} alt="logo" />
            </div>
            <div className="search">
                <select className="dropdown">
                    <option value="">Toutes catégories</option>
                    <option value="fruits">Fruits</option>
                    <option value="legumes">Légumes</option>
                    <option value="viande">Viande</option>
                    <option value="boissons">Boissons</option>
                </select>
                <input type="text" placeholder="Rechercher..." className="recherche"/>
            </div>
            <div className="bouton">
                <button className="boutonAide">Aide</button>
                <button className="boutonLogin">Login</button>
                <button className="boutonPanier"
                        onClick={() => navigate("/panier")}>🛒</button>
            </div>
        </header>
    );
}

export default Header;
