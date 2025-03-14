const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware für geschützte Routen
exports.protect = async (req, res, next) => {
  let token;

  // Token aus dem Authorization-Header extrahieren
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Sie sind nicht angemeldet. Bitte melden Sie sich an, um Zugriff zu erhalten.' });
  }

  try {
    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Benutzer aus der Datenbank abrufen
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Der Benutzer, zu dem dieses Token gehört, existiert nicht mehr.' });
    }

    // Benutzer zum Request-Objekt hinzufügen
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ungültiges Token. Bitte melden Sie sich erneut an.' });
  }
};

// Middleware für Admin-Routen
exports.restrictToAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Sie haben keine Berechtigung für diese Aktion' });
  }
  
  next();
}; 