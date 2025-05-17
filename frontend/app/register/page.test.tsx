import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegisterForm from './page';
import { passwordCheck, emailCheck, phoneCheck, submitRegistration } from './page';
import { useRouter } from 'next/navigation';
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
const { expect, describe, test } = require('@jest/globals');

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

    describe('emailCheck', () => {
        test('returns error on invalid email', () => {
            expect(emailCheck('invalid-email')).toBe('L’adresse email est invalide');
        });
        test('returns null on valid email', () => {
            expect(emailCheck('test@example.com')).toBeNull();
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
