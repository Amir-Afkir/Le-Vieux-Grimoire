// server.js

const http = require('http'); // On importe le module 'http' de Node.js pour créer le serveur
const app = require('./app'); // On importe notre application Express définie dans 'app.js'
require('dotenv').config(); // On charge les variables d’environnement depuis le fichier .env

// Fonction pour normaliser le port (permet d'utiliser un numéro ou une chaîne nommée)
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;        // Si ce n’est pas un nombre, on renvoie tel quel (ex: 'salut')
  if (port >= 0) return port;         // Si c’est un port valide, on le renvoie
  return false;                       // Sinon, on retourne false (port invalide)
};

// On récupère le port depuis les variables d’environnement, ou 3000 par défaut
const port = normalizePort(process.env.PORT || 3000);

// On demande à Express d’utiliser ce port
app.set('port', port);

// Fonction de gestion des erreurs du serveur
const errorHandler = (error) => {
  if (error.syscall !== 'listen') throw error;  // Si l’erreur ne vient pas de 'listen', on relance l’erreur

  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;

  switch (error.code) {
    case 'EACCES':      // Privilèges insuffisants pour utiliser le port
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);  // On arrête le processus avec un code d’erreur
      break;
    case 'EADDRINUSE':  // Le port est déjà utilisé
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// On crée le serveur HTTP en lui passant notre app Express
const server = http.createServer(app);

// On attache la gestion des erreurs au serveur
server.on('error', errorHandler);

// Une fois le serveur prêt, on affiche un message dans la console
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Server running on ' + bind);
});

// On lance le serveur sur le port défini
server.listen(port);
