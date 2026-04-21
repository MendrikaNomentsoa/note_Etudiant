require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const studentRoutes = require('./src/routes/studentRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

// ─── Connexion à MongoDB ──────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Middlewares globaux ──────────────────────────────────────────────────────
app.use(cors());                        // Autoriser les requêtes cross-origin
app.use(express.json());                // Parser le corps JSON
app.use(express.urlencoded({ extended: false })); // Parser les données de formulaire

// ─── Route de santé ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎓 API Gestion des Étudiants — Opérationnelle',
    version: '1.0.0',
    endpoints: {
      students : '/api/students',
      bilan    : '/api/students/bilan',
    },
  });
});

// ─── Routes API ──────────────────────────────────────────────────────────────
app.use('/api/students', studentRoutes);

// ─── Route 404 ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  });
});

// ─── Middleware de gestion des erreurs (DOIT être le dernier) ────────────────
app.use(errorHandler);

// ─── Démarrage du serveur ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;
