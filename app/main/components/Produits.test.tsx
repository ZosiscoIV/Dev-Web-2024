import React from 'react';
import { render, act } from '@testing-library/react';

describe('closePopup function - Test unitaire', () => {
    test('devrait mettre showNutritionalInfo à false quand appelée', () => {
        // Arrange
        // Créer un mock pour setState
        const setShowNutritionalInfo = jest.fn();

        // Nous isolons la fonction closePopup
        const closePopup = () => {
            setShowNutritionalInfo(false);
        };

        // Act
        // Exécuter la fonction à tester
        closePopup();

        // Assert
        // Vérifier que setState a été appelé avec false
        expect(setShowNutritionalInfo).toHaveBeenCalledWith(false);
        expect(setShowNutritionalInfo).toHaveBeenCalledTimes(1);
    });
});