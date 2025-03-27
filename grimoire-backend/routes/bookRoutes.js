const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const optimizeImage = require('../middleware/optimizeImage');
const bookCtrl = require('../controllers/bookController');

// Routes publiques
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/:id', bookCtrl.getOneBook);

// Routes protégées avec image upload et compression
router.post('/', auth, multer, optimizeImage, bookCtrl.createBook); 
router.put('/:id', auth, multer, optimizeImage, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;
