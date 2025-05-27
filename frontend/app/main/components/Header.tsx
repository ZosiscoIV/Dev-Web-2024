"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axiosClient from '../../fetchWithToken'
import { useProductSearch } from "../hooks/useProductSearch";
import "../css/Header.css";

interface Profile {
    nom: string;
    prenom: string;
}

export default function Header() {
    const router = useRouter()
    const [user, setUser] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const { query, setQuery, results, error, handleSearch } = useProductSearch();

    const [category, setCategory] = useState("");

    useEffect(() => {
        axiosClient
            .get<Profile>('/auth/profile')
            .then(res => {
                setUser(res.data);     // contains { nom, prenom }
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleLogout = async () => {
        try {
            await axiosClient.post('/auth/logout'); // Utilisez axiosClient au lieu de fetch
            setUser(null);
            router.push('/');
            window.location.reload(); // Forcer le rafraîchissement pour nettoyer l'état
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
        }
    }

    const onSearch = () => {
        handleSearch(category);
        router.push(`/search?q=${query}&category=${category}`);
        console.log("Requête envoyée avec query:", query, "et category:", category);

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
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />

                <button className="boutonRecherche" onClick={onSearch}> 🔍 </button>
            </div>

            <div className="bouton" >
                {loading ? null : user ? (
                    <>
                        <div       style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}>
                            Welcome {user.prenom} {user.nom}
                        </div>
                        <button className="boutonLogout" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="boutonLogin"
                            onClick={() => router.push('/login')}
                        >
                            Login
                        </button>
                        <button
                            className="boutonLogin"
                            onClick={() => router.push('/register')}
                        >
                            Register
                        </button>
                    </>
                )}
                <button
                    className="boutonFavoris"
                    onClick={() => router.push('/favoris')}
                >
                    ❤️
                </button>
                <button
                    className="boutonPanier"
                    onClick={() => router.push('/panier')}
                >
                    🛒
                </button>
            </div>
        </header>
    )
}
