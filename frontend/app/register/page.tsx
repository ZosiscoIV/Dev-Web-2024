'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

//Util Functions for handleSubmit
export function passwordCheck(password: string, confirmPassword: string): string | null {
    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
        return 'Les mots de passe ne correspondent pas';
    }
    // Vérification des critères de sécurité
    if (password.length < 8) {
        return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Le mot de passe doit contenir au moins une majuscule';
    }
    if (!/[0-9]/.test(password)) {
        return 'Le mot de passe doit contenir au moins un chiffre';
    }
    return null;
}
export function phoneCheck(phone: string): string | null {
    // On retire les espaces et les tirets éventuels
    const digits = phone.replace(/[\s-]/g, '');
    if (!/^\d{10}$/.test(digits)) {
        return 'Le numéro de téléphone doit contenir exactement 10 chiffres';
    }
    return null;
}
export async function submitRegistration(formData: {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    phone: string;
    }) {
    const response = await fetch('http://localhost:6942/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            nom: formData.lastName,
            prenom: formData.firstName,
            email: formData.email,
            password: formData.password,
            tel: formData.phone
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'inscription');
    }
    return response;
}
const RegisterForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errorPassword = passwordCheck(formData.password, formData.confirmPassword);
        if (errorPassword) {
            setErrorMessage(errorPassword);
            return;
        }

        const errorPhone = phoneCheck(formData.phone);
        if (errorPhone) {
            setErrorMessage(errorPhone);
            return;
        }

        try {
            await submitRegistration(formData);
            router.push('/');

        } catch (error: any) {
            setErrorMessage(error.message || 'Une erreur est survenue');
        }
    };

    return(
        <div className="auth-container">
            <h1 className= "Header" >Créer un compte</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="firstName">Prénom</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Nom</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Téléphone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        title="8 caractères minimum avec au moins 1 majuscule et 1 chiffre"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                <button type="submit" className="auth-button">
                    S'inscrire
                </button>
            </form>
        </div>
    );
};
export default RegisterForm;
