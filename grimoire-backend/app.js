// app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion à MongoDB réussie !'))
.catch((err) => console.error('❌ Connexion à MongoDB échouée :', err));

// Middleware CORS pour autoriser les requêtes du front (évite les erreurs cross-origin)
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour servir les fichiers statiques du dossier /images (accès aux images uploadées)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Import des routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes'); // ← n’oublie pas de créer ce fichier aussi si nécessaire

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Export de l’app Express pour l’utiliser dans server.js
module.exports = app;
