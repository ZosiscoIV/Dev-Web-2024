import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Header.css";
import logo from "../assets/logo.png";

function Header() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");

    const handleSearch = () => {
        navigate(`/search?q=${query}&category=${category}`);
    };

    return (
        <header className="Header">
            {/* Logo */}
            <div className="BannerImg">
                <img src={logo} alt="logo" onClick={() => navigate("/")} className="cursor-pointer"/>
            </div>

            {/* Barre de recherche */}
            <div className="search">
                <select
                    className="dropdown"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Toutes catégories</option>
                    <option value="fruits">Fruits</option>
                    <option value="legumes">Légumes</option>
                    <option value="Cereal">Cereal</option>
                    <option value="Epicerie sucree">Epicerie sucree</option>
                </select>

                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="recherche"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                <button className="boutonRecherche" onClick={handleSearch}>🔍</button>
            </div>

            {/* Boutons de navigation */}
            <div className="bouton">
                <button className="boutonAide" onClick={() => navigate("/aide")}>Aide</button>
                <button className="boutonLogin" onClick={() => navigate("/login")}>Login</button>
                <button className="boutonPanier" onClick={() => navigate("/panier")}>🛒</button>
            </div>
        </header>
    );
}

export default Header;
