// SearchResults.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchResults from './SearchResults';
import { act } from 'react-dom/test-utils';

// Créer un mock configurable pour useSearchParams
const mockSearchParams = {
    q: 'test',
    category: ''
};

// Mock des fonctions et modules que nous utilisons
jest.mock('next/navigation', () => ({
    useSearchParams: () => ({
        get: (param: string) => {
            if (param === 'q') return mockSearchParams.q;
            if (param === 'category') return mockSearchParams.category;
            return null;
        }
    })
}));

// Mock de fetch pour simuler l'API
global.fetch = jest.fn();

describe('SearchResults Component', () => {
    // Réinitialiser les mocks avant chaque test
    beforeEach(() => {
        jest.clearAllMocks();
        mockSearchParams.q = 'test';
        mockSearchParams.category = '';
    });

    // Test de base pour vérifier que le composant s'affiche correctement
    test('affiche le titre avec la requête de recherche', async () => {
        // Configuration du mock pour fetch
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        await act(async () => {
            render(<SearchResults />);
        });

        // Vérifie que le titre avec la requête est affiché
        expect(screen.getByText('Résultats pour "test"')).toBeInTheDocument();
    });

    // Test pour vérifier le cas où aucun produit n'est trouvé
    test('affiche "Aucun produit trouvé" quand il n\'y a pas de résultats', async () => {
        // Configuration du mock pour fetch
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        await act(async () => {
            render(<SearchResults />);
            // Attendre que la promesse soit résolue
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Vérifie que le message est affiché
        expect(screen.getByText('Aucun produit trouvé.')).toBeInTheDocument();
    });

    // Test pour vérifier l'affichage des produits
    test('affiche la liste des produits récupérés', async () => {
        // Produits de test
        const mockProducts = [
            { id: 1, produit: 'test produit', categorie: 'test catégorie', prix: 10, image: 'test.jpg' }
        ];

        // Configuration du mock pour fetch
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts
        });

        await act(async () => {
            render(<SearchResults />);
            // Attendre que toutes les promesses soient résolues
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Vérifie que le produit est affiché
        expect(screen.getByText(/test produit/)).toBeInTheDocument();
        expect(screen.getByText(/test catégorie/)).toBeInTheDocument();
    });

    // Test pour vérifier que le filtrage fonctionne correctement
    test('filtre correctement les produits selon la recherche', async () => {
        // Produits de test
        const mockProducts = [
            { id: 1, produit: 'test produit', categorie: 'fruits', prix: 10, image: 'test.jpg' },
            { id: 2, produit: 'autre article', categorie: 'légumes', prix: 5, image: 'autre.jpg' },
            { id: 3, produit: 'dernier test', categorie: 'viandes', prix: 4, image: 'dernier.jpg' }
        ];

        // Configuration du mock pour fetch
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts
        });

        await act(async () => {
            render(<SearchResults />);
            // Attendre que toutes les promesses soient résolues
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Vérifier que seuls les produits contenant "test" apparaissent
        expect(screen.getByText(/test produit/)).toBeInTheDocument();
        expect(screen.getByText(/dernier test/)).toBeInTheDocument();
        expect(screen.queryByText(/autre article/)).not.toBeInTheDocument();
    });

    // Test pour vérifier le filtrage par catégorie
    test('filtre correctement les produits par catégorie', async () => {
        // Configurer la recherche avec une catégorie
        mockSearchParams.q = '';
        mockSearchParams.category = 'fruits';

        const mockProducts = [
            { id: 1, produit: 'test produit', categorie: 'fruits', prix: 10, image: 'test.jpg' },
            { id: 2, produit: 'autre article', categorie: 'légumes', prix: 5, image: 'autre.jpg' },
            { id: 3, produit: 'dernier test', categorie: 'fruits', prix: 4, image: 'dernier.jpg' }
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts
        });

        await act(async () => {
            render(<SearchResults />);
            // Attendre que toutes les promesses soient résolues
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Vérifier le filtrage par catégorie
        expect(screen.getByText(/test produit/)).toBeInTheDocument();
        expect(screen.getByText(/dernier test/)).toBeInTheDocument();
        expect(screen.queryByText(/autre article/)).not.toBeInTheDocument();
    });

    // Test pour vérifier que l'erreur est gérée correctement
    test('gère les erreurs de fetch', async () => {
        // Configuration du mock pour simuler une erreur
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Erreur de fetch'));

        // Espionner console.error pour vérifier qu'il est appelé
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        await act(async () => {
            render(<SearchResults />);
            // Attendre que toutes les promesses soient résolues (même les rejets)
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Vérifie que le message d'erreur est affiché
        expect(consoleSpy).toHaveBeenCalled();
        expect(screen.getByText('Aucun produit trouvé.')).toBeInTheDocument();

        // Nettoyage
        consoleSpy.mockRestore();
    });
});