"use client"; // Ce code est spécifiquement destiné à s'exécuter côté client

import React from 'react';
import App from './main/components/App'; // Assure-toi d'importer ton composant principal

// Ce code sera exécuté sur le client, alors Next.js gère le rendu
export default function Page() {
    return (
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
