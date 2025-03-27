// models/User.js
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schéma de l'utilisateur
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // garantie d’unicité
  },
  password: {
    type: String,
    required: true,
  },
});

// Plugin pour afficher une erreur claire si l'email est déjà utilisé
userSchema.plugin(uniqueValidator);

// On exporte le modèle
module.exports = mongoose.model('User', userSchema);
