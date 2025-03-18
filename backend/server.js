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
  console.error('Global error handler caught:', err.stack);
  res.status(500).json({
    message: 'Ein Fehler ist aufgetreten',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// MongoDB-Verbindung mit verbesserter Fehlerbehandlung
console.log('Attempting to connect to MongoDB...');
console.log(`Using MongoDB URI starting with: ${process.env.MONGODB_URI?.substring(0, 20)}...`);

// MongoDB connection options
const mongoOptions = {
  // Only use these options in production if you're having SSL issues
  ...(isProduction ? {
    ssl: true,
    sslValidate: false,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    maxPoolSize: 10
  } : {})
};

console.log('Using MongoDB options:', mongoOptions);

mongoose.connect(process.env.MONGODB_URI, mongoOptions)
.then(() => {
  console.log('Successfully connected to MongoDB Atlas');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error details:', err);
  // Additional diagnostic information
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  if (err.code) console.error('Error code:', err.code);
  if (err.codeName) console.error('Error codeName:', err.codeName);
  process.exit(1);
});

// Unbehandelte Promise-Rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  if (err.code) console.error('Error code:', err.code);
  if (err.codeName) console.error('Error codeName:', err.codeName);
  // Keep the server running in production but log the error
  if (process.env.NODE_ENV === 'production') {
    console.error('In production mode, continuing despite error');
  } else {
    process.exit(1);
  }
}); 