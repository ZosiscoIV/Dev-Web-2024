/// <reference types="cypress" />

describe('template spec', () => {

  it('Ajout d\'un produit avec succès', () => {
    cy.visit('http://localhost:3000/listeprod')
    cy.contains('Ajouter un nouveau produit').click()
    cy.get('[name="nom"]').type('Choux')
    cy.get('[name="quantite"]').type('10')
    cy.get('[name="categorie"]').type('Légumes')
    cy.get('[name="unite"]').type('pc')
    cy.get('[name="prix"]').type('2.02')
    cy.get('[name="dateDebutVente"]').type('2025-02-25')
    cy.get('[name="taxe"]').type('21')
    cy.get('input[type="submit"]').click()
    cy.get('button.btn.confirm').click()
    
    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Produit créé avec succès !')
    })
  })
})