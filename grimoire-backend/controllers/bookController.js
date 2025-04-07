const Book = require('../models/Book'); // Importe le models book
const fs = require('fs'); // Importe le module fs pour la gestion des fichiers 

// Récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find() // Recherche de tous les livres dans la base de données
    .then((books) => res.status(200).json(books)) // En cas de succès, envoie les livres au client
    .catch((error) => res.status(400).json({ error })); // En cas d'erreur, envoie un message d'erreur
};

// Récupérer un livre par ID
exports.getOneBook = (req, res) => {
  Book.findById(req.params.id) // Recherche du livre par son ID
    .then((book) => {
      if (!book) { // Si le livre n'est pas trouvé
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      res.status(200).json(book); // Envoie le livre trouvé au client
    })
    .catch((error) => res.status(400).json({ error })); // En cas d'erreur, envoie un message d'erreur
};

// Récupérer les 3 livres avec la meilleure note moyenne
exports.getBestRatedBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
    .limit(3) // Limite la réponse aux 3 meilleurs livres
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Créer un nouveau livre
exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book); // Récupération des données du livre depuis le corps de la requête

  // Vérifie que la note initiale est valide
  const initialRating = bookObject.ratings && bookObject.ratings[0] ? bookObject.ratings[0].grade : 0;

  // Nettoyage des champs potentiellement dangereux ou inutiles
  delete bookObject._id;
  delete bookObject._userId;

  // Création de l'URL de l'image
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

  // Création d'un nouvel objet livre
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Associe l'utilisateur authentifié au livre
    imageUrl: imageUrl, // Associe l'image téléchargée
    ratings: [{ userId: req.auth.userId, grade: initialRating }], // Note initiale
    averageRating: initialRating, // Note moyenne initiale
  });

  // Sauvegarde du livre dans la base de données
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré avec succès !' })) // Succès
    .catch((error) => res.status(400).json({ error })); // Erreur
};

// Mettre à jour un livre existant
exports.updateBook = (req, res) => {
  const bookId = req.params.id;

  // Vérifie s'il y a un fichier (image) et met à jour les données en conséquence
  const updateData = req.file
    ? { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
    : { ...req.body };

  // Suppression de l'ID utilisateur pour éviter une modification malveillante
  delete updateData._userId;

  // Recherche du livre par ID
  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' }); // Livre non trouvé
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée' }); // Vérification de l'utilisateur
      }

      // Si une nouvelle image est fournie, suppression de l'ancienne image
      if (req.file) {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.updateOne({ _id: bookId }, { ...updateData, _id: bookId })
            .then(() => res.status(200).json({ message: 'Livre modifié avec image !' }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        // Mise à jour sans changement d'image
        Book.updateOne({ _id: bookId }, { ...updateData, _id: bookId })
          .then(() => res.status(200).json({ message: 'Livre modifié !' }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur
};

// Supprimer un livre
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

      // Suppression de l'image associée
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression de l’image :', err);
        }

        // Suppression du livre de la base de données
        Book.deleteOne({ _id: bookId })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Noter un livre
exports.rateBook = (req, res) => {
  const bookId = req.params.id;
  const { userId, rating } = req.body;

  // Vérifie si la note est valide (entre 0 et 5)
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
  }

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Vérifie si l'utilisateur a déjà noté ce livre
      const alreadyRated = book.ratings.some((r) => r.userId === userId);
      if (alreadyRated) {
        return res.status(403).json({ message: 'Vous avez déjà noté ce livre.' });
      }

      // Ajoute la nouvelle note
      book.ratings.push({ userId, grade: rating });

      // Calcule la nouvelle note moyenne
      const sum = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
      book.averageRating = Math.round((sum / book.ratings.length) * 10) / 10;

      book.save()
        .then((updatedBook) => res.status(200).json(updatedBook)) // Renvoie le livre mis à jour
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur
};

