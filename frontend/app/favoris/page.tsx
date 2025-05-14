import { Suspense } from 'react';
import FavoritesPage from "@/app/main/components/favoris";
import Header from "@/app/main/components/Header";


export default function SearchPage() {
    return (
        <div>
            <Header />
            <Suspense fallback={<div>Chargement des résultats...</div>}>
                <FavoritesPage />
            </Suspense>
        </div>
    );
}