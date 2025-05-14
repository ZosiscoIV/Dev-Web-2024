import { Suspense } from 'react';
import SearchResults from '../main/components/SearchResults';
import Header from "@/app/main/components/Header";


export default function SearchPage() {
    return (
        <div>
            <Header />
            <Suspense fallback={<div>Chargement des résultats...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    );
}