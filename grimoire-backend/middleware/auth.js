// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupération du header "Authorization"
    const token = req.headers.authorization.split(' ')[1]; // Format: "Bearer <token>"
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Requête non authentifiée !' });
  }
};
