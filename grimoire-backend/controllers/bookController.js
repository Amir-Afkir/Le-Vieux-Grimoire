const Book = require('../models/Book');
const fs = require('fs'); // pour supprimer l’image si besoin

// Récupérer tous les livres
    exports.getAllBooks = (req, res) => {
      Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
    };
  
// Récupérer un livre par ID
    exports.getOneBook = (req, res) => {
      Book.findById(req.params.id)
        .then((book) => {
          if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
          }
          res.status(200).json(book);
        })
        .catch((error) => res.status(400).json({ error }));
    };
  
// Récupérer les 3 livres avec la meilleure note moyenne
    exports.getBestRatedBooks = (req, res) => {
      Book.find()
        .sort({ averageRating: -1 }) // tri décroissant
        .limit(3) // on garde les 3 premiers
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
    };

    exports.createBook = (req, res) => {
      const bookObject = JSON.parse(req.body.book);
    
      // Nettoyage éventuel des champs inutiles
      delete bookObject._id;
      delete bookObject._userId;
    
      const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: imageUrl,
        ratings: [], // initialement vide
        averageRating: 0
      });
    
      book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch((error) => res.status(400).json({ error }));
    };
  
    exports.updateBook = (req, res) => {
      const bookId = req.params.id;
    
      const updateData = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          }
        : { ...req.body };
    
      delete updateData._userId;
    
      Book.findOne({ _id: bookId })
        .then((book) => {
          if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
          }
    
          if (book.userId !== req.auth.userId) {
            return res.status(403).json({ message: 'Requête non autorisée' });
          }
    
          // S’il y a une nouvelle image, supprimer l’ancienne
          if (req.file) {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              Book.updateOne({ _id: bookId }, { ...updateData, _id: bookId })
                .then(() => res.status(200).json({ message: 'Livre modifié avec image !' }))
                .catch((error) => res.status(400).json({ error }));
            });
          } else {
            Book.updateOne({ _id: bookId }, { ...updateData, _id: bookId })
              .then(() => res.status(200).json({ message: 'Livre modifié !' }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(500).json({ error }));
    };
    
    exports.deleteBook = (req, res) => {
      const bookId = req.params.id;
    
      Book.findOne({ _id: bookId })
        .then((book) => {
          if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
          }
    
          if (book.userId !== req.auth.userId) {
            return res.status(403).json({ message: 'Requête non autorisée' });
          }
    
          const filename = book.imageUrl.split('/images/')[1];
    
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.error('Erreur lors de la suppression de l’image :', err);
            }
    
            Book.deleteOne({ _id: bookId })
              .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
              .catch((error) => res.status(400).json({ error }));
          });
        })
        .catch((error) => res.status(500).json({ error }));
    };
  
    exports.rateBook = (req, res) => {
      const bookId = req.params.id;
      const { userId, rating } = req.body;
    
      // Vérifie si la note est entre 0 et 5
      if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
      }
    
      Book.findOne({ _id: bookId })
        .then((book) => {
          if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
          }
    
          // Vérifie que l'utilisateur n’a pas déjà noté
          const alreadyRated = book.ratings.some((r) => r.userId === userId);
          if (alreadyRated) {
            return res.status(403).json({ message: 'Vous avez déjà noté ce livre.' });
          }
    
          // Ajoute la nouvelle note
          book.ratings.push({ userId, grade: rating });
    
          // Recalcule la moyenne
          const sum = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
          book.averageRating = Math.round((sum / book.ratings.length) * 10) / 10;
    
          book.save()
            .then((updatedBook) => res.status(200).json(updatedBook))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    };
    