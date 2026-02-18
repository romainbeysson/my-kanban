/**
 * Gestionnaire d'erreurs global
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Erreurs Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Cette ressource existe déjà',
      field: err.meta?.target?.[0],
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Ressource non trouvée',
    });
  }

  // Erreur de validation JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON invalide',
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
