import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm, { passwordCheck, phoneCheck, submitRegistration } from './page';
import '@testing-library/jest-dom';
const { expect, describe, test } = require('@jest/globals');
import { useRouter } from 'next/navigation';

describe('Utility function tests', () => {
    describe('passwordCheck', () => {
        test('returns error when passwords do not match', () => {
            expect(passwordCheck('Password1', 'Password2')).toBe('Les mots de passe ne correspondent pas');
        });
        test('returns error when password is too short', () => {
            expect(passwordCheck('Pass1', 'Pass1')).toBe('Le mot de passe doit contenir au moins 8 caractères');
        });
        test('returns error when missing uppercase', () => {
            expect(passwordCheck('password1', 'password1')).toBe('Le mot de passe doit contenir au moins une majuscule');
        });
        test('returns error when missing number', () => {
            expect(passwordCheck('Password', 'Password')).toBe('Le mot de passe doit contenir au moins un chiffre');
        });
        test('returns null when valid password', () => {
            expect(passwordCheck('Password1', 'Password1')).toBeNull();
        });
    });

    describe('phoneCheck', () => {
        test('returns error when not 10 digits', () => {
            expect(phoneCheck('01234')).toBe('Le numéro de téléphone doit contenir exactement 10 chiffres');
        });
        test('returns null when valid digits with spaces', () => {
            expect(phoneCheck('012 345 6789')).toBeNull();
        });
        test('returns null when valid digits with dashes', () => {
            expect(phoneCheck('012-345-6789')).toBeNull();
        });
    });
});
describe('submitRegistration', () => {
    const mockFormData = {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john@example.com',
        password: 'Password1',
        phone: '0123456789',
    };

    beforeEach(() => {
        // @ts-ignore
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should succeed when API responds with 200', async () => {
        // @ts-ignore
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        const response = await submitRegistration(mockFormData);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(response.ok).toBe(true);
    });

    test('should throw error when API responds with error', async () => {
        // @ts-ignore
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Email déjà utilisé' }),
        });
        await expect(submitRegistration(mockFormData)).rejects.toThrow('Email déjà utilisé');
    });

    test('throws the generic error message if response.json() has no .error field', async () => {
        // @ts-ignore
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });

        await expect(submitRegistration(mockFormData)).rejects.toThrow(
            "Erreur lors de l'inscription"
        );
    });
    test('throws when fetch itself rejects (network error)', async () => {
        // @ts-ignore
        fetch.mockRejectedValueOnce(new Error('Network down'));

        await expect(submitRegistration(mockFormData)).rejects.toThrow('Network down');
    });
});

//test render
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('RegisterForm Integration Tests', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
        jest.clearAllMocks();
    });

    it('shows error if passwords do not match', async () => {
        render(<RegisterForm />);

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByLabelText(/^mot de passe/i), { target: { value: 'Password1' } });
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'Password2' } }); // Mismatch here

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        expect(await screen.findByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it('successful registration calls router.push', async () => {
        render(<RegisterForm />);

        // Mock fetch success for submitRegistration
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        } as Response);

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: 'Password1' } });
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'Password1' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/');
        });
    });

    it('shows error if fetch fails', async () => {
        render(<RegisterForm />);

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Email déjà utilisé' }),
        } as Response);

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByLabelText(/^mot de passe/i), { target: { value: 'Password1' } });
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'Password1' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        expect(await screen.findByText(/Email déjà utilisé/i)).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it('shows error for invalid password (missing uppercase)', async () => {
        render(<RegisterForm />);

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByLabelText(/^mot de passe/i), { target: { value: 'password1' } }); // no uppercase
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'password1' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        expect(await screen.findByText(/Le mot de passe doit contenir au moins une majuscule/i)).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it('shows error for invalid password (too short)', async () => {
        render(<RegisterForm />);

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByLabelText(/^mot de passe/i), { target: { value: 'Pass1' } }); // too short
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'Pass1' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        expect(await screen.findByText(/Le mot de passe doit contenir au moins 8 caractères/i)).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it('shows error for invalid password (missing number)', async () => {
        render(<RegisterForm />);

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByLabelText(/^mot de passe/i), { target: { value: 'Password' } }); // no number
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'Password' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        expect(await screen.findByText(/Le mot de passe doit contenir au moins un chiffre/i)).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });
    it('shows error when phone number is too short', async () => {
        render(<RegisterForm />);

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '01234' } }); // too short phone
        fireEvent.change(screen.getByLabelText(/^mot de passe/i), { target: { value: 'Password1' } });
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'Password1' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        expect(await screen.findByText(/Le numéro de téléphone doit contenir exactement 10 chiffres/i)).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it('accepts phone numbers with spaces and passes validation', async () => {
        render(<RegisterForm />);

        // Mock fetch success
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        } as Response);

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '012 345 6789' } }); // valid phone with spaces
        fireEvent.change(screen.getByLabelText(/^mot de passe/i), { target: { value: 'Password1' } });
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'Password1' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/');
        });
    });
    it('shows generic error message when caught error has no message', async () => {
        render(<RegisterForm />);

        // Mock submitRegistration to throw an error without message
        global.fetch = jest.fn().mockRejectedValueOnce({}); // empty object, no message property

        fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByLabelText(/^mot de passe/i), { target: { value: 'Password1' } });
        fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), { target: { value: 'Password1' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        expect(await screen.findByText(/Une erreur est survenue/i)).toBeInTheDocument();
    });
});
