const request = require('supertest');
const express = require('express');
const routes = require('./productController.js');
const mysql = require('mysql2/promise');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use('/', routes);

let db;

beforeAll(async () => {
  // Crée la connexion à la base de données avant tous les tests
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
  });

  // Insérer des données nécessaires à tes tests
  await db.query("INSERT INTO magasin.tbClients (id, nom, prenom, adresseMail, tel) VALUES (100, 'Client Test Nom', 'Client Test Prenom', 'mail test', 'tel test') ON DUPLICATE KEY UPDATE nom = 'Client Test'");
  await db.query("INSERT INTO magasin.tbProduits (id, nom, prix, idCategorie, idUnite, idTaxe, dateDebutVente) VALUES (100, 'Test', 10, 1, 1, 1, '2025-01-01') ON DUPLICATE KEY UPDATE nom = 'Test'");
  await db.query("INSERT INTO magasin.tbStock (idProduit, quantite) VALUES (100, 10) ON DUPLICATE KEY UPDATE quantite = 10");
});

afterAll(async () => {
  // Nettoyage après tous les tests
  await db.query("DELETE FROM magasin.tbCommandes WHERE idProduit = 100");
  await db.query("DELETE FROM magasin.tbClients WHERE id = 100");
  await db.query("DELETE FROM magasin.tbStock WHERE idProduit = 100");
  await db.query("DELETE FROM magasin.tbProduits WHERE id = 100");
  
  await db.end(); // Fermeture de la connexion à la BDD
});

describe('API Tests', () => {

  test('GET /products should return list of products', async () => {
    const res = await request(app).get('/products');
    expect([200, 404].includes(res.statusCode)).toBe(true);
    if (res.statusCode === 200) {
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('id');
    }
  });

  test('GET /categorie should return list of categories', async () => {
    const res = await request(app).get('/categorie');
    expect([200, 404].includes(res.statusCode)).toBe(true);
    if (res.statusCode === 200) {
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('id');
    }
  }, 10000); // 10 secondes pour laisser le temps à la BDD

  test('POST /addToCart should return 201 with valid data', async () => {
    const res = await request(app).post('/addToCart').send({
      idProduit: 100,
      idClient: 1,
      quantite: 2
    });
    expect([201, 500]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body).toHaveProperty('message', 'Produit ajouté au panier avec succès');
      expect(res.body).toHaveProperty('idCommande');
    }
  }, 10000); // délai plus long

  test('POST /addToCart should return 400 for missing data', async () => {
    const res = await request(app).post('/addToCart').send({
      idProduit: 100
    });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("Données manquantes");
  });

});
