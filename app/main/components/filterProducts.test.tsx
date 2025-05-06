import { Produit, filterProducts } from './FilterProducts';

describe('filterProducts', () => {
    // Tests pour filtrage
    describe('Filtrage par query', () => {
        test('Renvoie les produits correspondant à la requête alors que la requête est toute en minuscule)', () => {
            // Arrange
            const products: Produit[] = [
                { id: 1, produit: 'Pomme', categorie: 'Fruits', prix: 1.99, image: 'pomme.jpg' }
            ];
            const query = 'pomme';
            const category = '';
            // Act
            const result = filterProducts(products, query, category);
            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });
        test('Renvoie le produits correspondant à la requête alors quelle est tout en majuscule', () => {
            //Arrange
            const products: Produit[] = [
                { id: 1, produit: 'Pomme', categorie: 'Fruits', prix: 1.99, image: 'pomme.jpg' }
            ];
            const query = 'POMME';
            const category = '';
            //Act
            const result = filterProducts(products, query, category);
            //Assert
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        })
        test('Retourne le produits avec une query incomplète', () => {
            // Arrange
            const products: Produit[] = [
                { id: 1, produit: 'Pomme', categorie: 'Fruits', prix: 1.99, image: 'pomme.jpg' }
            ];
            const query = 'omm';
            const category = '';

            // Act
            const result = filterProducts(products, query, category);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });

        test('Renvoie une réponse vide car la query ne correspond a aucun produit', () => {
            // Arrange
            const products: Produit[] = [
                { id: 1, produit: 'Pomme', categorie: 'Fruits', prix: 1.99, image: 'pomme.jpg' }
            ];
            const query = 'xyz';
            const category = '';

            // Act
            const result = filterProducts(products, query, category);

            // Assert
            expect(result).toHaveLength(0);
        });


        test('Renvoie la catégorie correspondante', () => {

            //Arange
            const products: Produit[] = [
                { id: 1, produit: 'Pomme', categorie: 'Fruits', prix: 1.99, image: 'pomme.jpg' }
            ];
            const query = '';
            const category = 'Fruits';

            //Act
            const result = filterProducts(products, query, category);

            //Assert
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        })

        test('Retourne rien car aucune catégorie correspondante', () => {
            // Arrange
            const products: Produit[] = [
                { id: 1, produit: 'Pomme', categorie: 'Fruits', prix: 1.99, image: 'pomme.jpg' }
            ];
            const query = '';
            const category = 'Légumes';

            // Act
            const result = filterProducts(products, query, category);

            // Assert
            expect(result).toHaveLength(0);
        });

        test('Renvoie rien quand la catégorie correspond mais pas le produit', () => {
            // Arrange
            const products: Produit[] = [
                { id: 1, produit: 'Pomme', categorie: 'Fruits', prix: 1.99, image: 'pomme.jpg' }
            ];
            const query = 'banane';
            const category = 'Fruits';

            // Act
            const result = filterProducts(products, query, category);

            // Assert
            expect(result).toHaveLength(0);
        });

        test('pareil qu\' au dessus mais l\'inverse', () => {
            // Arrange
            const products: Produit[] = [
                { id: 1, produit: 'Pomme', categorie: 'Fruits', prix: 1.99, image: 'pomme.jpg' }
            ];
            const query = 'pomme';
            const category = 'Légumes';

            // Act
            const result = filterProducts(products, query, category);

            // Assert
            expect(result).toHaveLength(0);
        });


    });
});