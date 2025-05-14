/// <reference types="cypress" />

describe('cart changes', () => {

    it('Ajout d\'un produit avec succès', () => {
      cy.visit('http://localhost:3000/panier')
  
      // Click the first "+" button
      cy.contains('+').first().click()
  
      // Assert that the first input value is now 2
      cy.get('input[type="number"]').first().should('have.value', '2')
  
      // Type 71 into the same input to trigger the alert
      cy.get('input[type="number"]').first().clear().type('71')
  
      cy.on('window:alert', (msg) => {
        expect(msg).to.equal('Pas assez de stock.')
      })
  
      // Assert that the input has been capped at 10 (stock)
      cy.get('input[type="number"]').first().should('have.value', '10')
    })
  
    it('Réduit le premier article à 0 avec "-"', () => {
      cy.visit('http://localhost:3000/panier')
  
      // Tape "-" pour réduire la quantité du premier article (Pomme) et vérifier que l'alerte apparait
      cy.contains('-').first().click()
      cy.on('window:alert', (msg) => {
        expect(msg).to.equal('Souhaitez-vous retirer ce produit du panier ? (OK = oui, Annuler = non)')
      })
      cy.contains('Pomme').should('not.exist') // Vérifier que "Pomme" est supprimé
    })
  
    it('Tape 0 dans le champ du 2e item', () => {
      cy.visit('http://localhost:3000/panier')
  
      // Tape 0 et vérifie que l'alerte apparait
      cy.get('input[type="number"]').eq(1).clear().type('0').blur()
      cy.on('window:alert', (msg) => {
        expect(msg).to.equal('Souhaitez-vous retirer ce produit du panier ? (OK = oui, Annuler = non)')
      })
      cy.contains('Poire').should('not.exist') // Vérifier que "Poire" est supprimé
    })
  
  })
  