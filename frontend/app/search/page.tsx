// app/main/pages/SearchPage.tsx
"use client";

import Header from "@/app/main/components/Header";
import SearchResults from "@/app/main/components/SearchResults";  // Importation du composant SearchResults

const SearchPage = () => {
    return (
        <div>
            <Header />
            <SearchResults /> {/* Simplement ajouter SearchResults ici */}
        </div>
    );
};

export default SearchPage;
