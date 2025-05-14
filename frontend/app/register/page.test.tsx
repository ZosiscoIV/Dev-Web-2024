import { updateFormData, submitRegistration, FormData } from "./authFormHandlers";
const { expect, describe, it } = require('@jest/globals');
import "@testing-library/jest-dom";

describe("updateFormData", () => {
    const base: FormData = {
        firstName: "",
        lastName:  "",
        email:     "",
        phone:     "",
        password:  "",
        confirmPassword: "",
    };

    test("should update a single field and preserve others", () => {
        const next = updateFormData(base, "email", "foo@bar.com");
        expect(next).toEqual({
            ...base,
            email: "foo@bar.com",
        });
        const next1 = updateFormData(base, "password", "foo@bar.com");
        expect(next1).toEqual({
            ...base,
            password: "foo@bar.com",
        });
    const next2 = updateFormData(base, "confirmPassword", "foo@bar.com");
        expect(next2).toEqual({
            ...base,
            confirmPassword: "foo@bar.com",
        });
    });
});

describe("submitRegistration", () => {
    const goodData: FormData = {
        firstName: "Alice",
        lastName:  "Dupont",
        email:     "alice@example.com",
        phone:     "0123456789",
        password:  "Secret123",
        confirmPassword: "Secret123",
    };

    test("rejects when passwords don’t match", async () => {
        const bad = { ...goodData, confirmPassword: "NoMatch" };
        const result = await submitRegistration(bad, async () => {
            throw new Error("should not call fetch");
        });
        expect(result).toEqual({ errorMsg: "Les mots de passe ne correspondent pas" });
    });

    test("returns errorMsg on 400 response with JSON error", async () => {
        const fakeFetch = async () =>
            Promise.resolve({
                ok: false,
                json: async () => ({ error: "Email déjà utilisé" }),
            } as Response);

        const result = await submitRegistration(goodData, fakeFetch);
        expect(result).toEqual({ errorMsg: "Email déjà utilisé" });
    });

    test("returns generic errorMsg on non-JSON or missing error field", async () => {
        const fakeFetch = async () =>
            Promise.resolve({ ok: false, json: async () => ({}) } as Response);

        const result = await submitRegistration(goodData, fakeFetch);
        expect(result).toEqual({ errorMsg: "Erreur lors de l'inscription" });
    });

    test("returns redirectTo on 200 OK", async () => {
        const fakeFetch = async () =>
            Promise.resolve({ ok: true } as Response);

        const result = await submitRegistration(goodData, fakeFetch);
        expect(result).toEqual({ redirectTo: "/login" });
    });
});

// 1) Mock the Next.js App Router hook so useRouter().push exists:
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));
import React from "react";
import { render, screen, fireEvent, waitFor  } from "@testing-library/react";


// 2) Now import your page (which calls useRouter under the hood)
import Page from "./page";

describe("Register Page (client-side validation only)", () => {
    beforeEach(() => {
        render(<Page />);
    });

    test("renders the registration form with all fields", () => {
        expect(screen.getByTestId("register-form")).toBeInTheDocument();
        expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
        expect(screen.getByLabelText("Nom")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Téléphone")).toBeInTheDocument();
        expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirmer le mot de passe")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /s'inscrire/i })).toBeInTheDocument();
    });

    test("updates input values when the user types", () => {
        const first = screen.getByLabelText("Prénom") as HTMLInputElement;
        const last = screen.getByLabelText("Nom") as HTMLInputElement;

        fireEvent.change(first, { target: { value: "Jean" } });
        fireEvent.change(last, { target: { value: "Dupont" } });

        expect(first.value).toBe("Jean");
        expect(last.value).toBe("Dupont");
    });

    test("shows an error when passwords do not match", async () => {
        fireEvent.change(screen.getByLabelText("Prénom"), {
            target: { value: "Prenom" },
        });
        fireEvent.change(screen.getByLabelText("Nom"), {
            target: { value: "Nom" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "j.noel@ephec.com" },
        });
        fireEvent.change(screen.getByLabelText("Téléphone"), {
            target: { value: "0123456789" },
        });
        fireEvent.change(screen.getByLabelText("Mot de passe"), {
            target: { value: "Password1" },
        });
        fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), {
            target: { value: "Password2" },
        });
        fireEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));

        const errorMessage = await screen.findByText('Les mots de passe ne correspondent pas');
        expect(errorMessage).toBeInTheDocument();
    });

    test('enforces password complexity rules', () => {
        const passwordInput = screen.getByLabelText('Mot de passe');

        expect(passwordInput).toHaveAttribute(
            'pattern',
            '(?=.*\\d)(?=.*[A-Z]).{8,}'
        );
        expect(passwordInput).toHaveAttribute(
            'title',
            '8 caractères minimum avec au moins 1 majuscule et 1 chiffre'
        );
    });

    test("enforces the phone pattern attribute", () => {
        const phone = screen.getByLabelText("Téléphone") as HTMLInputElement;
        expect(phone.getAttribute("pattern")).toBe("[0-9]{10}");
    });
    test("displays server JSON error message on 400 response", async () => {
        // Mock fetch to return 400 with JSON error
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: "Email déjà pris" }),
        });

        // Fill valid matching passwords and other required fields
        fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Alice" } });
        fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@example.com" } });
        fireEvent.change(screen.getByLabelText("Téléphone"), { target: { value: "0123456789" } });
        fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "Secret123" } });
        fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), { target: { value: "Secret123" } });
        fireEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));

        const serverError = await screen.findByText("Email déjà pris");
        expect(serverError).toBeInTheDocument();
    });

    test("displays generic error message on 400 without error field", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        // Fill form
        fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Bob" } });
        fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Martin" } });
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bob@example.com" } });
        fireEvent.change(screen.getByLabelText("Téléphone"), { target: { value: "0123456789" } });
        fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "Secret123" } });
        fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), { target: { value: "Secret123" } });
        fireEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));

        const genericError = await screen.findByText("Erreur lors de l'inscription");
        expect(genericError).toBeInTheDocument();
    });

});
