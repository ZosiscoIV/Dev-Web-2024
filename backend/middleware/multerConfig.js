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

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Seules les images JPEG sont autorisées.'));
  }
};

const upload = multer({ storage: storage, fileFilter });

module.exports = upload;
