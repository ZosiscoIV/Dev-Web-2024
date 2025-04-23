'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch('http://localhost:6942/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: formData.lastName,
                    prenom: formData.firstName,
                    email: formData.email,
                    password: formData.password,
                    tel: String(formData.phone)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'inscription');
            }

            router.push('/login');
        } catch (error: any) {
            setErrorMessage(error.message || 'Une erreur est survenue');
        }
    };

    return (
        <div className="auth-container">
            <h1 className= "Header" >Créer un compte</h1>
            <form onSubmit={handleSubmit} className="auth-form" data-testid="register-form" >
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
                        pattern="[0-9]{10}"
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
                        pattern="(?=.*\d)(?=.*[A-Z]).{8,}"
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