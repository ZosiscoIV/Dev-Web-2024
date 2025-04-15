// app/main/components/Header.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useRouter } from 'next/navigation';
import React from 'react';

// Mock de useRouter pour simuler la navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock des images pour que ça fonctionne
jest.mock('next/image', () => {
    return ({ src, alt, width, height } : {src: string; alt: string; width: number; height: number}) =>
        <img src={src} alt={alt} width={width} height={height} />;
});

describe('Header', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('devrait rendre le composant Header correctement', () => {
        render(<Header />);
        expect(screen.getByAltText('logo')).toBeInTheDocument();
        expect(screen.getByText('🔍')).toBeInTheDocument();
        expect(screen.getByText('Aide')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('🛒')).toBeInTheDocument();
    });

    it('devrait permettre de naviguer vers la page d\'accueil en cliquant sur le logo', () => {
        render(<Header />);
        const logo = screen.getByAltText('logo'); // ✅ corrigé ici (alt = 'logo')
        fireEvent.click(logo);
        expect(pushMock).toHaveBeenCalledWith('/');
    });

    it('devrait permettre de naviguer vers la page d\'aide en cliquant sur le bouton "Aide"', () => {
        render(<Header />);
        const boutonAide = screen.getByText('Aide');
        fireEvent.click(boutonAide);
        expect(pushMock).toHaveBeenCalledWith('/aide');
    });

    it('devrait appeler la fonction handleSearch avec la bonne query et catégorie lors d\'un clic sur le bouton de recherche', () => {
        render(<Header />);
        const inputSearch = screen.getByPlaceholderText('Rechercher...');
        const selectCategory = screen.getByRole('combobox');
        const buttonSearch = screen.getByText('🔍');

        fireEvent.change(inputSearch, { target: { value: 'bananes' } });
        fireEvent.change(selectCategory, { target: { value: 'fruits' } });
        fireEvent.click(buttonSearch);

        expect(pushMock).toHaveBeenCalledWith('/search?q=bananes&category=fruits');
    });

    it('devrait appeler handleSearch lorsque la touche "Enter" est pressée dans le champ de recherche', () => {
        render(<Header />);
        const inputSearch = screen.getByPlaceholderText('Rechercher...');
        fireEvent.change(inputSearch, { target: { value: 'bananes' } });
        fireEvent.keyDown(inputSearch, { key: 'Enter', code: 'Enter', charCode: 13 });

        expect(pushMock).toHaveBeenCalledWith('/search?q=bananes&category=');
    });

    it('devrait permettre de naviguer vers la page de login en cliquant sur le bouton "Login"', () => {
        render(<Header />);
        const boutonLogin = screen.getByText('Login');
        fireEvent.click(boutonLogin);
        expect(pushMock).toHaveBeenCalledWith('/listeprod');
    });

    it('devrait permettre de naviguer vers la page du panier en cliquant sur le bouton "🛒"', () => {
        render(<Header />);
        const boutonPanier = screen.getByText('🛒');
        fireEvent.click(boutonPanier);
        expect(pushMock).toHaveBeenCalledWith('/panier');
    });
});
