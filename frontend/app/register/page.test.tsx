import { updateFormData, submitRegistration, FormData } from "./authFormHandlers";
const { expect, describe, test } = require('@jest/globals');
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

describe("updateFormData (unit)", () => {
    const base: FormData = {
        firstName: "",
        lastName:  "",
        email:     "",
        phone:     "",
        password:  "",
        confirmPassword: "",
    };

    test("should update a single field and preserve all others", () => {
        // define some sample updates
        const updates: Array<{ key: keyof FormData; value: string }> = [
            { key: "firstName",       value: "Alice"   },
            { key: "lastName",        value: "Doe"     },
            { key: "email",           value: "a@b.com" },
            { key: "phone",           value: "012345"  },
            { key: "password",        value: "P@ssw0rd"},
            { key: "confirmPassword", value: "P@ssw0rd"},
        ];

        updates.forEach(({ key, value }) => {
            const next = updateFormData(base, key, value);

            // only the updated key changed
            expect(next[key]).toBe(value);

            // every other key should still be exactly as in `base` (the empty string)
            (Object.keys(base) as (keyof FormData)[])
                .filter(k => k !== key)
                .forEach(otherKey => {
                    expect(next[otherKey]).toBe(base[otherKey]);
                });
        });
    });

    test("does not mutate the original object", () => {
        const original = { ...base };

        // 1) Updating different fields leaves `base` intact:
        const updatedFirstName = updateFormData(base, "firstName", "Alice");
        const updatedEmail     = updateFormData(base, "email",     "a@b.com");
        expect(base).toEqual(original);
        expect(updatedFirstName).not.toBe(base);
        expect(updatedEmail).not.toBe(base);

        // 2) Even updating with the *same* value returns a new object and doesn't touch `base`:
        const prepopulated = { ...base, phone: "0123456789" };
        const samePhone     = updateFormData(prepopulated, "phone", "0123456789");
        expect(samePhone).not.toBe(prepopulated);
        expect(prepopulated).toEqual({ ...base, phone: "0123456789" });

        // 3) Loop through every key to double‑check:
        (Object.keys(base) as (keyof FormData)[]).forEach(key => {
            const result = updateFormData(base, key, "xyz");
            expect(result).not.toBe(base);             // new reference
            expect(base).toEqual(original);            // base still pristine
            expect(result[key]).toBe("xyz");           // key changed
            // all other fields should remain exactly as in `base` (empty string)
            Object.keys(base)
                .filter(k => k !== key)
                .forEach(other => {
                    expect(result[other as keyof FormData]).toBe(base[other as keyof FormData]);
                });
        });

        // 4) Chaining updates—make sure intermediate objects aren’t clobbered:
        const step1 = updateFormData(base, "firstName", "Bob");
        const step2 = updateFormData(step1, "lastName", "Smith");
        expect(step1).toEqual({ ...base, firstName: "Bob" });
        expect(step2).toEqual({ ...base, firstName: "Bob", lastName: "Smith" });
        // ensure neither of those mutated their predecessor
        expect(base).toEqual(original);
        expect(step1).not.toBe(base);
        expect(step2).not.toBe(step1);
    });


    test("handles updating all keys consistently", () => {
        (Object.keys(base) as (keyof FormData)[]).forEach(key => {
            // 1) Basic behavior: updated[key] === "value"
            const updated = updateFormData(base, key, "value");
            expect(updated[key]).toBe("value");

            // 2) Everything else stays as in base
            Object.keys(base)
                .filter(k => k !== key)
                .forEach(other => {
                    expect(updated[other as keyof FormData]).toBe(base[other as keyof FormData]);
                });

            // 3) Should not mutate original
            expect(base).toEqual({
                firstName:       "",
                lastName:        "",
                email:           "",
                phone:           "",
                password:        "",
                confirmPassword: ""
            });

            // 4) Always return a new object
            expect(updated).not.toBe(base);

            // 5) Idempotency: updating the same field again to the same value still works
            const updatedAgain = updateFormData(updated, key, "value");
            expect(updatedAgain).not.toBe(updated);
            expect(updatedAgain[key]).toBe("value");
            // other fields still untouched
            (Object.keys(base) as (keyof FormData)[])
                .filter(k => k !== key)
                .forEach(other => {
                    expect(updatedAgain[other]).toBe(updated[other]);
                });

            // 6) Edge‑case: updating to an empty string
            const emptied = updateFormData({ ...base, [key]: "something" }, key, "");
            expect(emptied[key]).toBe("");
            Object.keys(base)
                .filter(k => k !== key)
                .forEach(other => {
                    expect(emptied[other as keyof FormData]).toBe(base[other as keyof FormData]);
                });
        });

        // 7) Chaining multiple different keys
        const chainStep1 = updateFormData(base, "firstName", "A");
        const chainStep2 = updateFormData(chainStep1, "lastName",  "B");
        const chainStep3 = updateFormData(chainStep2, "email",     "C@D");
        expect(chainStep1).toEqual({ ...base, firstName: "A" });
        expect(chainStep2).toEqual({ ...base, firstName: "A", lastName: "B" });
        expect(chainStep3).toEqual({ ...base, firstName: "A", lastName: "B", email: "C@D" });
        // verify no step mutated its predecessor
        expect(chainStep1).not.toBe(base);
        expect(chainStep2).not.toBe(chainStep1);
        expect(chainStep3).not.toBe(chainStep2);
    });


    test("handles updating with empty string values", () => {
        // 1) Starting from non‑empty, clear each key
        (Object.keys(base) as (keyof FormData)[]).forEach(key => {
            const initial  = { ...base, [key]: "SOMETHING" };
            const updated  = updateFormData(initial, key, "");
            // the target field is now empty
            expect(updated[key]).toBe("");
            // every other field remains as in base (i.e. still empty string)
            (Object.keys(base) as (keyof FormData)[])
                .filter(k => k !== key)
                .forEach(other => {
                    expect(updated[other]).toBe(base[other]);
                });
            // original object untouched
            expect(initial).toEqual({ ...base, [key]: "SOMETHING" });
            // returned a new reference
            expect(updated).not.toBe(initial);
        });

        // 2) Idempotent—clearing a key that’s already empty still works
        const alreadyEmpty = { ...base, email: "" };
        const againCleared = updateFormData(alreadyEmpty, "email", "");
        expect(againCleared.email).toBe("");
        expect(againCleared).not.toBe(alreadyEmpty);
        expect(alreadyEmpty).toEqual({ ...base, email: "" });

        // 3) Chaining: clear two fields one after another
        const step1 = updateFormData({ ...base, phone: "12345", lastName: "X" }, "phone", "");
        const step2 = updateFormData(step1, "lastName", "");
        expect(step1).toEqual({ ...base, lastName: "X", phone: "" });
        expect(step2).toEqual({ ...base, lastName: "", phone: "" });
        // ensure no mutation of predecessors
        expect(step1).not.toBe(step2);
    });

});

describe("submitRegistration (unit)", () => {
    const goodData: FormData = {
        firstName: "Alice",
        lastName:  "Dupont",
        email:     "alice@example.com",
        phone:     "0123456789",
        password:  "Secret123",
        confirmPassword: "Secret123",
    };

    test("passes correct fetch parameters including credentials", async () => {
        let capturedInit: any;
        const fakeFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = async (input, init) => {
            capturedInit = init;
            return { ok: true } as Response;
        };
        await submitRegistration(goodData, fakeFetch);
        expect(capturedInit).toMatchObject({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        });
    });

    test("rejects when passwords don’t match", async () => {
        const bad = { ...goodData, confirmPassword: "NoMatch" };
        const result = await submitRegistration(bad, async () => { throw new Error("should not call fetch"); });
        expect(result.errorMsg).toMatch(/mots de passe ne correspondent pas/i);
    });

    test("returns errorMsg on 400 with JSON error", async () => {
        const fakeFetch = async (): Promise<Response> =>
            Promise.resolve({ ok: false, json: async () => ({ error: "E déjà utilisé" }) } as Response);
        const res = await submitRegistration(goodData, fakeFetch);
        expect(res.errorMsg).toBe("E déjà utilisé");
    });

    test("returns generic error for missing error field", async () => {
        const fakeFetch = async (): Promise<Response> =>
            Promise.resolve({ ok: false, json: async () => ({}) } as Response);
        const res = await submitRegistration(goodData, fakeFetch);
        expect(res.errorMsg).toBe("Erreur lors de l'inscription");
    });

    test("handles JSON parse failure gracefully", async () => {
        const fakeFetch = async (): Promise<Response> =>
            Promise.resolve({ ok: false, json: async () => { throw new Error('Bad JSON'); } } as unknown as Response);
        const res = await submitRegistration(goodData, fakeFetch);
        expect(res.errorMsg).toBe("Erreur lors de l'inscription");
    });

    test("returns redirectTo on success", async () => {
        const fakeFetch = async (): Promise<Response> => Promise.resolve({ ok: true } as Response);
        const res = await submitRegistration(goodData, fakeFetch);
        expect(res.redirectTo).toBe("/");
    });

    test("throws if fetchFn throws network error", async () => {
        const fakeFetch = async (): Promise<Response> => { throw new Error('Network failure'); };
        await expect(submitRegistration(goodData, fakeFetch)).rejects.toThrow('Network failure');
    });

    test("handles non-JSON non-ok response without json method", async () => {
        const fakeFetch = async (): Promise<Response> => Promise.resolve({ ok: false } as Response);
        const res = await submitRegistration(goodData, fakeFetch);
        expect(res.errorMsg).toBe("Erreur lors de l'inscription");
    });
});

// Integration tests for Register Page
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "./page";
function mockFetch(responseBody: any, ok = true) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok,
            json: async () => responseBody,
        } as Response)
    );
};
afterEach(() => jest.resetAllMocks());

// 1) Mock the Next.js App Router hook so useRouter().push exists:
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe("Register Page (Integration Tests)", () => {

    it("displays error message when passwords do not match", async () => {
        render(<Page />);

        fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "Password123" } });
        fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), { target: { value: "Password321" } });

        await act(async () => {
            fireEvent.submit(screen.getByRole("button", { name: "S'inscrire" }));
        });

        expect(screen.getByText("Les mots de passe ne correspondent pas")).toBeInTheDocument();
    });

    it("submits form successfully and redirects", async () => {
        mockFetch({}, true);
        render(<Page />);

        fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jean.dupont@example.com" } });
        fireEvent.change(screen.getByLabelText("Téléphone"), { target: { value: "0123456789" } });
        fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "Password123" } });
        fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), { target: { value: "Password123" } });

        await act(async () => {
            fireEvent.submit(screen.getByRole("button", { name: "S'inscrire" }));
        });

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:6942/api/auth/register", expect.any(Object));
    });

    it("fails on incorrect email", async () => {
        render(<Page />);

        fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jean.dupont.com" } });
        fireEvent.change(screen.getByLabelText("Téléphone"), { target: { value: "0123456789" } });
        fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "Password123" } });
        fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), { target: { value: "Password1123" } });

        await act(async () => {
            fireEvent.submit(screen.getByRole("button", { name: "S'inscrire" }));
        });

        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("displays error message from server response", async () => {
        mockFetch({ error: "Email déjà utilisé" }, false);
        render(<Page />);

        await act(async () => {
            fireEvent.submit(screen.getByRole("button", { name: "S'inscrire" }));
        });

        expect(screen.getByText("Email déjà utilisé")).toBeInTheDocument();
    });

});
