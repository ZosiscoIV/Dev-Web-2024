import { Product } from "./Product";

describe("getStatus", () => {
    it("verifie si quantité vaut 0, cela retourne la bonne chose", () => {
        const prod = new Product (
            1,
            "Banane",
            0,
            3,
            '',
            '2025-03-24T23:00:00.000Z'
        );

        expect(prod.getStatus()).toBe("❌ Hors Stock");
    });
    it("verifie si quantité est supérieure à 5, cela retourne la bonne chose", () => {
        const prod = new Product (
            1,
            "Banane",
            10,
            3,
            '',
            '2025-03-24T23:00:00.000Z'
        );

        expect(prod.getStatus()).toBe("✅ En Stock");
    });
    it("verifie si quantité vaut 5, cela retourne la bonne chose", () => {
        const prod = new Product (
            1,
            "Banane",
            5,
            3,
            '',
            '2025-03-24T23:00:00.000Z'
        );

        expect(prod.getStatus()).toBe("✅ En Stock");
    });
    it("verifie si quantité est inférieure à 5, cela retourne la bonne chose", () => {
        const prod = new Product (
            1,
            "Banane",
            4,
            3,
            '',
            '2025-03-24T23:00:00.000Z'
        );

        expect(prod.getStatus()).toBe("⚠️ Faible Stock");
    });
    it("verifie si quantité est Infini, cela retourne la bonne chose", () => {
        const prod = new Product (
            1,
            "Banane",
            Infinity,
            3,
            '',
            '2025-03-24T23:00:00.000Z'
        );

        expect(prod.getStatus()).toBe("La quantité doit être un entier");
    });
    it("verifie si quantité est Infini, cela retourne la bonne chose", () => {
        const prod = new Product (
            1,
            "Banane",
            -Infinity,
            3,
            '',
            '2025-03-24T23:00:00.000Z'
        );

        expect(prod.getStatus()).toBe("La quantité doit être un entier");
    });
    it("verifie si quantité est Infini, cela retourne la bonne chose", () => {
        const prod = new Product (
            1,
            "Banane",
            -Infinity,
            -1,
            '',
            '2025-03-24T23:00:00.000Z'
        );

        expect(prod.getStatus()).toBe("La quantité doit être un entier");
    });
});

describe("getFormatDate", () => {
    it("transforme un string en format date dd/mm/yyyy", () =>{
        const prod = new Product (
            1,
            "Banane",
            10,
            3,
            '',
            '2025-03-24T23:00:00.000Z'
        );
        expect(prod.getFormatDate()).toBe("25/03/2025")
    });
    it("transforme un string en format date dd/mm/yyyy", () =>{
        const prod = new Product (
            1,
            "Banane",
            10,
            3,
            '',
            null
        );
        expect(prod.getFormatDate()).toBe("")
    });
    it("transforme un string en format date dd/mm/yyyy", () =>{
        const prod = new Product (
            1,
            "Banane",
            10,
            3,
            '',
            '2'
        );
        expect(prod.getFormatDate()).toBe("La date de livraison doit être une date")
    })
    it("transforme un string en format date dd/mm/yyyy", () =>{
        const prod = new Product (
            1,
            "Banane",
            10,
            3,
            '',
            'aaa'
        );
        expect(prod.getFormatDate()).toBe("La date de livraison doit être une date")
    })
    it("transforme un string en format date dd/mm/yyyy", () =>{
        const prod = new Product (
            1,
            "Banane",
            10,
            3,
            '',
            'undefined'
        );
        expect(prod.getFormatDate()).toBe("La date de livraison doit être une date")
    })
});