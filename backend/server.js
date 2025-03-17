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

// Determine CORS configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
console.log('------------------------------------------------------------');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Production mode: ${isProduction}`);
console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set (first few chars: ' + process.env.MONGODB_URI.substring(0, 20) + '...)' : 'Not set'}`);
console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Set (length: ' + process.env.JWT_SECRET.length + ')' : 'Not set'}`);
console.log(`Port: ${process.env.PORT || 5000}`);
console.log('------------------------------------------------------------');

// Enhanced CORS configuration
if (isProduction) {
  // In production, use a more permissive configuration
  app.use(cors({
    origin: '*', // Allow all origins in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));
  console.log('CORS configured for production environment - allowing all origins');
} else {
  // In development, use a more restricted configuration
  app.use(cors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:5175', 
      'http://localhost:5176', 
      'http://localhost:5177', 
      'https://arztvermittlung.vercel.app',
      'https://arztvermittlung-3mbr6kqcq-seppelzs-projects.vercel.app',
      'https://arztvermittlung-drxxb6oih-seppelzs-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));
  console.log('CORS configured for development environment - using restricted origin list');
}

app.use(express.json());
app.use(morgan('dev'));

// API-Routen
app.use('/api/auth', authRoutes);
app.use('/api/bulletin', bulletinRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);

// Add a test route to verify the server is running correctly
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    time: new Date().toISOString(),
    cors: isProduction ? 'all-origins' : 'restricted-list'
  });
});

// Generische Fehlerbehandlung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ein Fehler ist aufgetreten',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// MongoDB-Verbindung mit aktualisierter SSL/TLS-Konfiguration für Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsAllowInvalidCertificates: true  // Moderner Ersatz für sslValidate: false
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