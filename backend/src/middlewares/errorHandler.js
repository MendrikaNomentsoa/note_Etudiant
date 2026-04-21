/**
 * Middleware de gestion globale des erreurs Express
 * Doit être enregistré EN DERNIER dans app.js / server.js
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  // ─── Erreur de duplication MongoDB (code 11000) ──────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `La valeur du champ "${field}" existe déjà.`;
  }

  // ─── Erreur de validation Mongoose ───────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 422;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(' | ');
  }

  // ─── CastError (ID MongoDB invalide) ─────────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Identifiant invalide : ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
