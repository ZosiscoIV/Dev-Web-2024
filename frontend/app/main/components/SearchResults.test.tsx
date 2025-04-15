import { render, screen } from "@testing-library/react";
import SearchResults from "./SearchResults";
import { useSearchParams } from "next/navigation";

// Mock de useSearchParams, remplace une vraie fonction par une fausse (jest.fn())
jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(),
}));

// Mock global de fetch (remplace par une fausse fct)
global.fetch = jest.fn();

// Fonction utilitaire pour mocker useSearchParams
const mockSearchParams = (params: Record<string, string>) => {
    (useSearchParams as jest.Mock).mockReturnValue({
        get: (key: string) => params[key] ?? null,
    });
};

describe("SearchResults Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("affiche un message pendant qu'aucun produit n'est trouvé", async () => {
        mockSearchParams({ q: "" });
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(<SearchResults />);

        const message = await screen.findByText("Aucun produit trouvé.");
        expect(message).toBeInTheDocument();
    });

    test("affiche un produit simple qui correspond à la recherche", async () => {
        mockSearchParams({ q: "pomme" });
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, produit: "pomme", categorie: "fruits", prix: 1.99, image: "" },
                { id: 2, produit: "banane", categorie: "fruits", prix: 2.5, image: "" },
            ],
        });

        render(<SearchResults />);

        // Attendre que "pomme" soit trouvé
        const produitAffiché = await screen.findByText(/pomme/i);
        expect(produitAffiché).toBeInTheDocument();

        // Vérifier que "banane" n'est pas affichée
        const produitNonAffiché = screen.queryByText(/banane/i);
        expect(produitNonAffiché).toBeNull();
    });

    test("filtre aussi par catégorie si elle est définie", async () => {
        mockSearchParams({ q: "", category: "legume" });
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, produit: "brocoli", categorie: "legume", prix: 50, image: "" },
                { id: 2, produit: "banane", categorie: "fruits", prix: 15, image: "" },
            ],
        });

        render(<SearchResults />);

        // Attendre que le produit "brocoli" soit trouvé
        const brocoli = await screen.findByText(/brocoli/i);
        expect(brocoli).toBeInTheDocument();

        // Vérifier que "banane" n'est pas affichée, car la catégorie est "legume"
        const banane = screen.queryByText(/banane/i);
        expect(banane).toBeNull();
    });
});
