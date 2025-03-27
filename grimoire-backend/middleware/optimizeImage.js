const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
  if (!req.file) return next(); // Pas de fichier, on continue

  const inputPath = req.file.path;
  const outputFilename = `optimized_${req.file.filename}.webp`;
  const outputPath = path.join('images', outputFilename);

  try {
    await sharp(inputPath)
      .resize({ width: 800 }) // largeur max (à ajuster selon besoin)
      .webp({ quality: 80 }) // format WebP avec qualité réduite
      .toFile(outputPath);

    // Supprimer l'original
    fs.unlinkSync(inputPath);

    // Réassigner le chemin du fichier optimisé
    req.file.filename = outputFilename;

    next();
  } catch (err) {
    console.error('Erreur lors de l’optimisation d’image :', err);
    res.status(500).json({ message: 'Erreur lors de l’optimisation d’image.' });
  }
};
