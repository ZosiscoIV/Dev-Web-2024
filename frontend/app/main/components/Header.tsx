'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axiosClient from '../../fetchWithToken'
import '../css/Header.css'

interface Profile {
    nom: string;
    prenom: string;
}

export default function Header() {
    const router = useRouter()
    const [user, setUser] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

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

    return (
        <header className="Header">
            <div className="BannerImg" onClick={() => router.push('/')}>
                <Image
                    src={`/assets/logo.png`}
                    alt="logo"
                    className="cursor-pointer"
                    width={200}
                    height={100}
                />
            </div>

            <div className="search">
                {/* ... your existing search UI ... */}
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
