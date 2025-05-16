const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../frontend/public/assets')); 
  },
  filename: (req, file, cb) => {
    // Récupère le nom du produit depuis req.body
    const nomProduit = req.body.nom || 'produit';
    // Nettoie le nom pour éviter les caractères interdits
    const cleanNom = nomProduit.replace(/\s+/g, '_').toLowerCase();
    cb(null, `${cleanNom}.jpg`);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
