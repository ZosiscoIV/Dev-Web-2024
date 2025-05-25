const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();
const { authenticateToken } = require('./middleware/auth');

const upload = require('./middleware/multerConfig');

const { validationResult } = require('express-validator');
const validateProduct = require('./productValidator');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
});

const db2 = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
  });
  
  // Crée une version Promise du pool
const promisePool = db2.promise();
  
console.log(process.env.DB_CHARSET);

// Vérification de la connexion
db.connect(err => {
    if (err) {
        console.error("❌ Erreur de connexion à la base de données :", err);
        process.exit(1); // Arrête l'application si la connexion échoue
    }
    console.log("✅ Connexion réussie à la base de données !");
});


// route pour la liste de produits

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtenir la liste des produits dans le stock.
 *     description: Retourne tous les produits disponibles avec leur nom, prix et quantité.
 *     responses:
 *       200:
 *         description: Liste des produits.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nom:
 *                     type: string
 *                     example: "Banane"
 *                   prix:
 *                     type: number
 *                     example: 3.00
 *                   quantite:
 *                     type: integer
 *                     example: 10
 *                   status:
 *                     type: string
 *                     example: "En stock"
 *                   categorie:
 *                     type: string
 *                     example: "Fruit"
 *                   dateLivraison:
 *                     type: date
 *                     example: "2025-03-24T23:00:00.000Z"
 *       404:
 *         description: Aucun produit trouvé. 
 *       500:
 *         description: Erreur avec la base de données.
 */

router.get('/products', (req, res) => {
    const { categorie, enStock} = req.query
    let query = `
    SELECT
        p.id AS id,
        p.nom AS produit,
        p.prix AS prix,
        s.quantite AS quantite,
        IF(s.quantite > 0, 'En stock', 'Hors stock') AS status,
        c.categorie AS categorie,
        s.dateLivraison AS dateLivraison,
        p.dateDebutVente AS dateDebutVente,
        p.dateFinVente as dateFinVente,
        u.unite,
        t.taxe,
        s.disponibilite,
        p.imageURL
    FROM
        magasin.tbProduits p
    JOIN
        magasin.tbStock s ON p.id = s.idProduit
    JOIN
        magasin.tbCategorie c ON p.idCategorie = c.id
    JOIN
        magasin.tbUnite u on p.idUnite = u.id
    JOIN
        magasin.tbTaxe t on p.idTaxe = t.id
    `;
    let conditions = []; // On stocke ici les filtres dynamiquement

    if (categorie) {
        conditions.push(`c.categorie = '${categorie}'`);
    }
    if (enStock === "1") { // Vérifie que enStock est bien une string "true"
        conditions.push(`s.quantite > 0`);
    }
    if (enStock === "2") {
        conditions.push(`s.quantite < 5`)
    }
    if (enStock === "3") {
        conditions.push(`s.quantite = 0`)
    }

    // Ajout des conditions dynamiquement
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    query += ` ORDER BY disponibilite DESC, produit ASC
`;

    db.query(query, (err, results) => {
        if (err) {
            // Si erreur dans la requête SQL
            return res.status(500).send('Erreur de base de données');
        }
        if (results.length === 0) {
            // Si aucune ressource trouvée, on renvoie un 404
            return res.status(404).send('Aucun produit trouvé');
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const produits = results.map(prod => ({
            ...prod,
            dispo: prod.disponibilite === 1
        }));
        // On renvoie les résultats si tout va bien
        res.json(produits);
    });
});

// route pour Categorie

/**
 * @swagger
 * /api/categorie:
 *   get:
 *     summary: Obtenir la liste de toutes les catégories
 *     description: Retourne l'identifiant et le nom de chaque catégorie.
 *     responses:
 *       200:
 *         description: Liste des catégories récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   categorie:
 *                     type: string
 *                     example: "Fruits"
 *       404:
 *         description: Aucune catégorie trouvée.
 *       500:
 *         description: Erreur serveur.
 */

router.get('/categorie', (req, res) => {
    const query = `SELECT id, categorie FROM magasin.tbCategorie`;
    db.query(query, (err, results) => {
        if (err) {
            // Si erreur dans la requête SQL
            console.error('Erreur lors de la récupération des catégories:', err);

            return res.status(500).send('Erreur de base de données');
        }
        if (results.length === 0) {
            // Si aucune ressource trouvée, on renvoie un 404
            return res.status(404).send('Aucune catégorie trouvée');
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        // On renvoie les résultats si tout va bien
        res.json(results);
    });
});

// Route pour ajouter un nouveau produit

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Ajouter un nouveau produit
 *     description: Ajoute un produit à la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Pomme"
 *               quantite:
 *                 type: integer
 *                 example: 50
 *               unité:
 *                 type: string
 *                 example: "pc"
 *               prix:
 *                 type: number
 *                 example: 2.50
 *               categorie:
 *                 type: string
 *                 example: "Fruit"
 *               dateLivraison:
 *                  type: date
 *                  example: "2025-03-24T23:00:00.000Z"
 *               taxe:
 *                  type: integer
 *                  example: 21
 *     responses:
 *       201:
 *         description: Produit créé avec succès.
 *       400:
 *         description: Données invalides.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/products',upload.single('image'), validateProduct, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        console.log("Requête reçue pour créer un produit...",req.body);
        console.log('Fichier reçu :', req.file);


        const {nom, quantite,unite, prix, categorie,dateLivraison, dateDebutVente, dateFinVente, taxe} = req.body
        
        const image = req.file ? `/assets/${req.file.filename}`: null;

        const [verifProd] = await promisePool.query("SELECT id FROM magasin.tbProduits WHERE  nom = ?", [nom]);
        if(verifProd.length > 0) {
            return res.status(400).send('Le produit existe déjà');
        }
        const dateLivraisonFinal = (dateLivraison === "" ? null : dateLivraison)
        const dateFinVenteFinal = (dateFinVente === "" ? null : dateFinVente)
        await promisePool.query(`
            INSERT INTO magasin.tbUnite (unite)
            SELECT * FROM (SELECT ?) AS tmp(unite)
            WHERE NOT EXISTS (
                SELECT id FROM magasin.tbUnite WHERE unite = ?
            ) LIMIT 1;`, [unite,unite]);
        const [verifUnite] = await promisePool.query("SELECT id FROM magasin.tbUnite WHERE  unite = ?", [unite]);
        const idUnite = verifUnite[0].id;

        await promisePool.query(`
            INSERT INTO magasin.tbCategorie (categorie)
            SELECT * FROM (SELECT ?) AS tmp(categorie)
            WHERE NOT EXISTS (
                SELECT id FROM magasin.tbCategorie WHERE categorie = ?
            ) LIMIT 1;
        `, [categorie, categorie]);
        const [verifCategorie] = await promisePool.query("SELECT id FROM magasin.tbCategorie WHERE categorie = ?", [categorie]);
        const idCategorie = verifCategorie[0].id;
        
        await promisePool.query(`
            INSERT INTO magasin.tbTaxe (taxe)
            SELECT * FROM (SELECT ?) AS tmp(taxe)
            WHERE NOT EXISTS (
                SELECT id FROM magasin.tbTaxe WHERE taxe = ?
            ) LIMIT 1;
        `, [taxe, taxe]);
        const [verifTaxe] = await promisePool.query("SELECT id FROM magasin.tbTaxe WHERE taxe = ?", [taxe]);
        const idTaxe = verifTaxe[0].id;
        
        await promisePool.query(`
            INSERT INTO magasin.tbProduits (nom, prix, dateDebutVente, dateFinVente, idUnite, idTaxe, idCategorie, imageURL)
            SELECT nom, prix, dateDebutVente, ?, idUnite, idTaxe, idCategorie, imageURL
            FROM (SELECT ?, ?, ?, ?, ?, ?, ?, ?) AS tmp(nom, prix, dateDebutVente, dateFinVente, idUnite, idTaxe, idCategorie, imageURL)
            WHERE NOT EXISTS (
                SELECT id FROM magasin.tbProduits WHERE nom = ?
            ) LIMIT 1;
        `, [dateFinVenteFinal, nom, prix, dateDebutVente, dateFinVente, idUnite, idTaxe, idCategorie,image, nom]);
        const [verifProduit] = await promisePool.query("SELECT id FROM magasin.tbProduits WHERE nom = ?", [nom]);
        const idProduit = verifProduit[0].id;

        await promisePool.query(`
            INSERT INTO magasin.tbStock (idProduit, quantite, dateLivraison,disponibilite)
            SELECT idProduit, quantite, ?, 1 FROM (SELECT ?, ?, ?,1) AS tmp(idProduit, quantite, dateLivraison, disponibilite)
            WHERE NOT EXISTS (
                SELECT idProduit FROM magasin.tbStock WHERE idProduit = ?
            );
        `, [dateLivraisonFinal, idProduit, quantite, dateLivraison, idProduit]);
        
        res.status(201).send('Produit créé avec succès')
        
    } catch (error) {
        // Si erreur dans la requête SQL
        console.error('Erreur lors de la récupération des catégories:', error);
        console.error('Erreur lors de l\'insertion du produit:', error); // Affiche l'erreur exacte

        return res.status(500).send('Erreur de base de données');
    }
});

// Route pour modifier un produit

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mettre à jour un produit existant
 *     description: Modifie les informations d'un produit en fonction de son id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Pomme"
 *               quantite:
 *                 type: integer
 *                 example: 50
 *               unité:
 *                 type: string
 *                 example: "pc"
 *               prix:
 *                 type: number
 *                 example: 2.50
 *               categorie:
 *                 type: string
 *                 example: "Fruit"
 *               status:
 *                 type: string
 *                 example: "En stock"
 *               dateLivraison:
 *                  type: date
 *                  example: "2025-03-24T23:00:00.000Z"
 *               taxe:
 *                  type: integer
 *                  example: 21
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *       400:
 *         description: Données invalides.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/products/:id',upload.single('image'), validateProduct, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        console.log("Requête reçue pour mettre à jour un produit...",req.body);

        const {nom, quantite,unite, prix, categorie,dateLivraison, dateDebutVente, dateFinVente, taxe} = req.body
        const id = req.params.id;

        const image = req.file ? `/assets/${req.file.filename}` : null;

        const [row] = await promisePool.query( `
            SELECT
                p.id AS id,
                p.nom AS produit,
                p.prix AS prix,
                s.quantite AS quantite,
                IF(s.quantite > 0, 'En stock', 'Hors stock') AS status,
                c.categorie AS categorie,
                s.dateLivraison AS dateLivraison,
                p.dateDebutVente AS dateDebutVente,
                p.dateFinVente as dateFinVente,
                u.unite,
                t.taxe,
                p.imageURL
            FROM
                magasin.tbProduits p
            JOIN
                magasin.tbStock s ON p.id = s.idProduit
            JOIN
                magasin.tbCategorie c ON p.idCategorie = c.id
            JOIN
                magasin.tbUnite u on p.idUnite = u.id
            JOIN
                magasin.tbTaxe t on p.idTaxe = t.id
            WHERE p.id = ?
        `, [id]);
        
        if (row.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        const produit = row[0];
        const newImageURL = image || produit.imageURL;

        async function findOrInsert(table, column, value) {
            const [row] = await promisePool.query(`SELECT id FROM magasin.${table} WHERE ${column} = ?`, [value]);
            
            if (row.length > 0) return row[0].id;

            const [insert] = await promisePool.query(`INSERT INTO magasin.${table} (${column}) VALUES (?)`, [value]);
                
            return insert.insertId;
        }

        const dateLivraisonSQL = dateLivraison === '' ? null : dateLivraison;

        if (produit.quantite !== quantite || produit.dateLivraison !== dateLivraison){
            await promisePool.query(`
                UPDATE magasin.tbStock
                SET quantite = ?, dateLivraison = ?
                WHERE idProduit = ?`,
            [quantite,dateLivraisonSQL,id]);
        }
        const idUnite = await findOrInsert('tbUnite','unite', unite );
        const idTaxe = await findOrInsert('tbTaxe', 'taxe', taxe);
        const idCategorie = await findOrInsert('tbCategorie', 'categorie', categorie);

        const dateDebutSQL = dateDebutVente === '' ? null : dateDebutVente;
        const dateFinSQL = dateFinVente === '' ? null : dateFinVente;
        await promisePool.query(`
            UPDATE magasin.tbProduits 
            SET prix = ?, dateDebutVente = ?, dateFinVente = ?, idUnite = ?, idTaxe = ?, idCategorie = ?, imageURL = ?
            WHERE id = ?
        `, [prix, dateDebutSQL, dateFinSQL, idUnite, idTaxe, idCategorie, newImageURL, id]);

        res.status(200).json({ message: 'Produit mis à jour avec succès' });

    } catch (error) {
        // Si erreur dans la requête SQL
        console.error('Erreur lors de la récupération des catégories:', error);
        console.error('Erreur lors de l\'insertion du produit:', error); // Affiche l'erreur exacte

        return res.status(500).send('Erreur de base de données');
    }  
});

// Route pour supprimer un produit

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     description: Supprime un produit de la base de données en fonction de son id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à supprimer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/products/:id/dispo', async (req, res) => {
    try {
        console.log("Requête reçue pour mettre à jour un produit...",req.body);

        const {disponibilite} = req.body
        const id = req.params.id;
        
        if (typeof disponibilite !== 'number' || ![0, 1].includes(disponibilite)) {
            return res.status(400).json({ error: 'Valeur de disponibilité invalide' });
        }

        const [row] = await promisePool.query( `
            SELECT
                disponibilite
            FROM
                magasin.tbStock
            WHERE idProduit = ?
        `, [id]);
        
        if (row.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        await promisePool.query(`
            UPDATE magasin.tbStock
            SET disponibilite = ?
            WHERE idProduit = ?`,
        [disponibilite,id]);
        
        res.status(200).json({ message: 'Disponibilité mise à jour avec succès' });

    } catch (error) {
        // Si erreur dans la requête SQL
        console.error('Erreur lors de la récupération des catégories:', error);
        console.error('Erreur lors de l\'insertion du produit:', error); // Affiche l'erreur exacte

        return res.status(500).send('Erreur de base de données');
    }  
});

// Route pour modifier le statut du produit

/**
 * @swagger
 * /api/products/{id}/status:
 *   put:
 *     summary: Mettre à jour le statut d'un produit existant
 *     description: Modifie le statut d'un produit en fonction de son id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Hors stock"
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/products/:id/status', (req, res) => {
});

// Route pour mettre une date de livraison au produit

/**
 * @swagger
 * /api/products/{id}/dateLivraison:
 *   put:
 *     summary: Mettre une date de livraison pour un produit existant
 *     description: donner une date de livraison à un produit en fonction de son id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateLivraison:
 *                 type: date
 *                 example: "2025-03-24T23:00:00.000Z"
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *       400:
 *         description: Données invalides.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/products/:id/dateLivraison', (req, res) => {
});

// Route pour alerte si le produit est faible en stock

/**
 * @swagger
 * /alerts/stockFaible:
 *   get:
 *     summary: Alerter si le stock est trop faible 
 *     description: Retourne tous les produits qui ont un stock trop faible avec le nom, prix et quantité.
 *     responses:
 *       200:
 *         description: Liste des produits faible.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nom:
 *                     type: string
 *                     example: "Banane"
 *                   prix:
 *                     type: number
 *                     example: 3.00
 *                   quantite:
 *                     type: integer
 *                     example: 4
 *                   status:
 *                     type: string
 *                     example: "En stock"
 *                   categorie:
 *                     type: string
 *                     example: "Fruit"
 *                   dateLivraison:
 *                     type: date
 *                     example: "2025-03-24T23:00:00.000Z"
 *       404:
 *         description: Aucun produit trouvé. 
 *       500:
 *         description: Erreur avec la base de données.

 */
router.get('/alerts/stockFaible', (req, res) => {

});
module.exports = router;



// route pour Cart

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtenir la liste des articles du panier
 *     description: Retourne les informations des produits du panier (idCommande, nom, prix, quantity, stock).
 *     responses:
 *       200:
 *         description: Liste des articles récupérés avec succès ou aucun produit trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produits récupérés avec succès."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idCommande:
 *                         type: integer
 *                         example: 1
 *                       nom:
 *                         type: string
 *                         example: "Pomme"
 *                       prix:
 *                         type: number
 *                         example: 2.5
 *                       quantite:
 *                         type: integer
 *                         example: 3
 *                       stock:
 *                         type: integer
 *                         example: 10
 *       500:
 *         description: Erreur serveur.
 */

router.get('/cart', (req, res) => {
    const query = `
        SELECT C.idCommande, P.nom, P.prix, C.quantite, S.quantite AS stock
        FROM magasin.tbCommandes as C 
        JOIN magasin.tbProduits as P ON P.id = C.idProduit 
        JOIN magasin.tbStock as S ON P.id = S.idProduit 
        WHERE C.estDejaVendu = false 
        ORDER BY C.idCommande DESC`;

    db.query(query, (err, results) => {
        if (err) {
            // Si erreur dans la requête SQL
            console.error('Erreur lors de la récupération des articles:', err);
            return res.status(500).send('Erreur de base de données');
        }

        if (results.length === 0) {
            // Si aucun produit n'est trouvé, retourner un message avec un tableau vide
            return res.status(200).json({
                message: 'Aucun produit trouvé dans le panier.',
                data: []
            });
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        // On renvoie les résultats si tout va bien
        res.json({
            message: 'Produits récupérés avec succès.',
            data: results
        });
    });
});

/**
 * @swagger
 * /api/cart/{idCommande}:
 *   put:
 *     summary: Mettre à jour la quantité d'un produit dans le panier
 *     description: Met à jour la quantité d'un produit dans la table tbCommandes.
 *     parameters:
 *       - in: path
 *         name: idCommande
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantite:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantité mise à jour avec succès.
 *       400:
 *         description: Données invalides.
 *       404:
 *         description: Commande non trouvée.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/cart/:idCommande', async (req, res) => {
    const { idCommande } = req.params;
    const { quantite } = req.body;

    if (!quantite || quantite < 0) {
        return res.status(400).json({ message: 'Quantité invalide.' });
    }

    try {
        const [result] = await promisePool.query(
            'UPDATE magasin.tbCommandes SET quantite = ? WHERE idCommande = ?',
            [quantite, idCommande]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Commande non trouvée.' });
        }

        res.status(200).json({ message: 'Quantité mise à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});


/**
 * @swagger
 * /api/cart/{idCommande}:
 *   delete:
 *     summary: Supprimer un produit du panier
 *     description: Supprime une commande de la table tbCommandes.
 *     parameters:
 *       - in: path
 *         name: idCommande
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande à supprimer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès.
 *       404:
 *         description: Commande non trouvée.
 *       500:
 *         description: Erreur serveur.
 */
router.delete('/cart/:idCommande', async (req, res) => {
    const { idCommande } = req.params;

    try {
        const [result] = await promisePool.query(
            'DELETE FROM magasin.tbCommandes WHERE idCommande = ?',
            [idCommande]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Commande non trouvée.' });
        }

        res.status(200).json({ message: 'Produit supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});


/**
 * @swagger
 * /api/addToCart:
 *   post:
 *     summary: Ajouter un produit au panier
 *     description: Ajoute un produit dans la table tbCommandes pour un client donné.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProduit
 *               - quantite
 *             properties:
 *               idProduit:
 *                 type: integer
 *                 example: 1
 *               quantite:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Produit ajouté au panier avec succès.
 *       400:
 *         description: Données invalides.
 *       401:
 *         description: Non autorisé.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/addToCart', authenticateToken, async (req, res) => {
    const { idProduit, quantite } = req.body;
    const idClient = req.user.id; // Récupérer l'ID du client depuis le token Bearer

    if (!idProduit || !quantite || quantite <= 0) {
        return res.status(400).json({ message: 'Données invalides.' });
    }

    try {
        const dateCommande = new Date();
        const query = `
            INSERT INTO magasin.tbCommandes (idProduit, idClient, quantite, dateCommande, estDejaVendu)
            VALUES (?, ?, ?, ?, false)
        `;
        const [result] = await promisePool.query(query, [idProduit, idClient, quantite, dateCommande]);

        res.status(201).json({ message: 'Produit ajouté au panier avec succès.', idCommande: result.insertId });
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

/**
 * @swagger
 * /api/produit/{idProduit}/composition:
 *   get:
 *     summary: Obtenir la composition complète d’un produit
 *     description: Retourne les allergènes, ingrédients et informations nutritionnelles d’un produit donné.
 *     parameters:
 *       - in: path
 *         name: idProduit
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Composition récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allergenes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nom:
 *                         type: string
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nom:
 *                         type: string
 *                       ordre:
 *                         type: integer
 *                 nutrition:
 *                   type: object
 *                   properties:
 *                     calories:
 *                       type: number
 *                     proteines:
 *                       type: number
 *                     glucides:
 *                       type: number
 *                     lipides:
 *                       type: number
 *                     fibres:
 *                       type: number
 *                     sel:
 *                       type: number
 *       404:
 *         description: Aucune composition trouvée pour ce produit.
 *       500:
 *         description: Erreur serveur.
 */

router.get('/produit/:idProduit/composition', async (req, res) => {
    const { idProduit } = req.params;

    try {
        const allergenesQuery = `
            SELECT a.id, a.nom
            FROM magasin.tbProduitAllergene pa
            JOIN magasin.tbAllergene a ON pa.idAllergene = a.id
            WHERE pa.idProduit = ?
        `;
        const [allergenes] = await db.promise().query(allergenesQuery, [idProduit]);

        const ingredientsQuery = `
            SELECT i.id, i.nom, pi.ordre
            FROM magasin.tbProduitIngredient pi
            JOIN magasin.tbIngredient i ON pi.idIngredient = i.id
            WHERE pi.idProduit = ?
            ORDER BY pi.ordre ASC
        `;
        const [ingredients] = await db.promise().query(ingredientsQuery, [idProduit]);

        const nutritionQuery = `
            SELECT calories, proteines, glucides, lipides, fibres, sel
            FROM magasin.tbNutrition
            WHERE idProduit = ?
        `;
        const [nutritionRows] = await db.promise().query(nutritionQuery, [idProduit]);
        const nutrition = nutritionRows[0] || null;

        if (!allergenes.length && !ingredients.length && !nutrition) {
            return res.status(404).send('Aucune composition trouvée pour ce produit');
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json({ allergenes, ingredients, nutrition });
    } catch (err) {
        console.error('Erreur lors de la récupération de la composition du produit :', err);
        res.status(500).send('Erreur de base de données');
    }
});

/**
 * @swagger
 * /api/favoris/{clientId}:
 *   get:
 *     summary: Récupérer les produits favoris d’un client
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des produits favoris
 */
router.get("/:clientId", async (req, res) => {
    const { clientId } = req.params;
    try {
        const [rows] = await promisePool.query(
            `SELECT tbProduits.* FROM tbFavoris
       JOIN tbProduits ON tbFavoris.idProduit = tbProduits.id
       WHERE idClient = ?`,
            [clientId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/**
 * @swagger
 * /api/favoris:
 *   post:
 *     summary: Ajouter un produit aux favoris
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idClient:
 *                 type: integer
 *               idProduit:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Favori ajouté
 */
router.post("/", async (req, res) => {
    const { idClient, idProduit } = req.body;
    try {
        await promisePool.query(
            "INSERT INTO tbFavoris (idClient, idProduit, dateFavoris) VALUES (?, ?, CURDATE())",
            [idClient, idProduit]
        );
        res.status(201).json({ message: "Favori ajouté" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({ error: "Déjà en favori" });
        } else {
            console.error(err);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
});

/**
 * @swagger
 * /api/favoris/{clientId}/{produitId}:
 *   delete:
 *     summary: Supprimer un favori
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: produitId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favori retiré
 */
router.delete("/:clientId/:produitId", async (req, res) => {
    const { clientId, produitId } = req.params;
    try {
        await promisePool.query(
            "DELETE FROM tbFavoris WHERE idClient = ? AND idProduit = ?",
            [clientId, produitId]
        );
        res.json({ message: "Favori retiré" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;


