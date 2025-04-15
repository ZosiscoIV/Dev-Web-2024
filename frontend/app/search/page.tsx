import { Suspense } from 'react';
import SearchPageContent from '../main/components/SearchResults';

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Chargement des résultats...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}
