const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const bulletinRoutes = require('./routes/bulletin.routes');
const userRoutes = require('./routes/user.routes');
const contactRoutes = require('./routes/contact.routes');

// App-Initialisierung
const app = express();

// Erweiterte CORS-Konfiguration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'https://arztvermittlung.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// API-Routen
app.use('/api/auth', authRoutes);
app.use('/api/bulletin', bulletinRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);

// Generische Fehlerbehandlung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ein Fehler ist aufgetreten',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// MongoDB-Verbindung mit SSL-Konfiguration für Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false // Disable SSL validation for Atlas connection
})
.then(() => {
  console.log('Mit MongoDB verbunden');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB-Verbindungsfehler:', err);
  console.error(err);
  process.exit(1);
});

// Unbehandelte Promise-Rejections
process.on('unhandledRejection', (err) => {
  console.error('Unbehandelte Promise-Rejection:', err);
  process.exit(1);
}); 