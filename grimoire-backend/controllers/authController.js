const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Expression régulière pour valider l'email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Expression régulière pour valider le mot de passe (min 8 caractères, 1 majuscule, 1 chiffre)
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

exports.signup = (req, res) => {
  const { email, password } = req.body;

  // Vérification de l'email
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Adresse e-mail invalide.' });
  }

  // Vérification du mot de passe
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.' 
    });
  }

  bcrypt.hash(password, 10)
    .then((hash) => {
      const user = new User({
        email: email,
        password: hash,
      });

      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès !' }))
        .catch((error) => {
          if (error?.errors?.email?.kind === 'unique') {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
          }
          console.error(error);
          return res.status(400).json({ message: "Erreur lors de l'inscription." });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log('Tentative de connexion avec :', email);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      bcrypt.compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: 'Identifiants invalides' });
          }

          const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
          );

          res.status(200).json({
            userId: user._id,
            token,
          });
        })
        .catch((error) => {
          console.error('Erreur bcrypt :', error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.error('Erreur findOne :', error);
      res.status(500).json({ error });
    });
};
