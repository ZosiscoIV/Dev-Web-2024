// app/main/components/Header.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct hook import from next/navigation
import Image from "next/image";
import "../css/Header.css";

function Header() {
    const router = useRouter(); // Now using the correct useRouter from next/navigation
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");

    const handleSearch = () => {
        router.push(`/search?q=${query}&category=${category}`); // Use router.push() to navigate
    };

    return (
        <header className="Header">
            <div className="BannerImg" onClick={() => router.push("/")}>
                <Image
                    src={`/assets/logo.png`}
                    alt="logo"
                    className="cursor-pointer"
                    width={200}
                    height={100}
                />
            </div>

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

                <button className="boutonRecherche" onClick={handleSearch}>
                    🔍
                </button>
            </div>

            <div className="bouton">
                <button className="boutonFavoris" onClick={() => router.push("/favoris")}>
                    ❤️
                </button>
                <button className="boutonLogin" onClick={() => router.push("/login")}>
                    Login
                </button>
                <button className="boutonLogin" onClick={() => router.push("/register")}>
                    Register
                </button>
                <button className="boutonPanier" onClick={() => router.push("/panier")}>
                    🛒
                </button>
            </div>
        </header>
    );
}

export default Header;