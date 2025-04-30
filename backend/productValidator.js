const { body, validationResult } = require("express-validator");

const validationProduit = [
    body("nom").trim().escape().notEmpty().withMessage('Le nom est requis'),
    body("quantite").notEmpty().isInt({ min: 0 }).withMessage('La quantité doit être un entier positif'),
    body("unite").trim().escape().notEmpty().withMessage('L\'unité est requise'),
    body("prix").notEmpty().isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
    body("categorie").trim().escape().notEmpty().withMessage('La catégorie est requise'),
    body("dateLivraison").optional({ checkFalsy: true }).isISO8601().withMessage('La date de livraison est invalide'),
    body("dateDebutVente").notEmpty().isISO8601().withMessage('La date de début de vente est invalide'),
    body("dateFinVente").optional({ checkFalsy: true }).isISO8601().withMessage('La date de fin de vente est invalide'),
    body("taxe").notEmpty().isInt({ min: 0 }).withMessage('La taxe doit être un entier positif')
];

module.exports = validationProduit;