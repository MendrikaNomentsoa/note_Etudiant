const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const studentRoutes = require('./src/routes/studentRoutes');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎓 API Gestion des Étudiants — Opérationnelle',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      bilan: '/api/students/bilan',
      users: '/api/users'
    },
  });
});

app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;