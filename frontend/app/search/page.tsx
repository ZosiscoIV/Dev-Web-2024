import { Suspense } from 'react';
import ProduitSearch from "@/app/main/components/ProduitSearch";
import Header from "@/app/main/components/Header";


export default function SearchPage() {
    return (
        <div>
            <Header />
            <Suspense fallback={<div>Chargement des résultats...</div>}>
                <ProduitSearch />
            </Suspense>
        </div>
    );
}