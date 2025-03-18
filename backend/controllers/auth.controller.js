const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Hilfsfunktion zum Erzeugen eines JWT-Tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Registrierung für neue Benutzer
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, username, userType } = req.body;

    // Prüfen, ob Pflichtfelder vorhanden sind
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Bitte geben Sie Benutzername, E-Mail und Passwort an' });
    }

    // Prüfen, ob ein Benutzer mit dieser E-Mail oder Benutzernamen bereits existiert
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Ein Benutzer mit dieser E-Mail oder diesem Benutzernamen existiert bereits' });
    }

    // Neuen Benutzer erstellen
    const newUser = await User.create({
      username,
      name,
      email,
      password,
      role: role || 'user', // Standardmäßig 'user', wenn keine Rolle angegeben
      userType: userType || 'Arzt' // Verwende den übergebenen userType oder 'Arzt' als Standard
    });

    // Passwort aus der Antwort entfernen
    newUser.password = undefined;

    // Token generieren
    const token = generateToken(newUser._id);

    // Antwort senden
    res.status(201).json({
      status: 'success',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Ein Fehler ist bei der Registrierung aufgetreten', error: error.message });
  }
};

// Login-Funktion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    // Prüfen, ob E-Mail und Passwort angegeben wurden
    if (!email || !password) {
      console.log('Login rejected: Missing email or password');
      return res.status(400).json({ message: 'Bitte geben Sie E-Mail und Passwort an' });
    }

    // Benutzer in der Datenbank finden
    console.log(`Looking up user with email: ${email}`);
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`Login failed: No user found with email ${email}`);
      return res.status(401).json({ message: 'Falsche E-Mail oder falsches Passwort' });
    }

    // Prüfen, ob das Passwort korrekt ist
    const passwordCorrect = await user.checkPassword(password);
    if (!passwordCorrect) {
      console.log(`Login failed: Incorrect password for user ${email}`);
      return res.status(401).json({ message: 'Falsche E-Mail oder falsches Passwort' });
    }

    console.log(`Login successful for user: ${user.email} (${user._id})`);

    // Letzten Login aktualisieren
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Token generieren und zurückgeben
    const token = generateToken(user._id);
    console.log(`Generated token for user ${user._id}`);
    
    const userObject = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType
    };
    
    console.log(`Returning user object:`, userObject);
    
    res.status(200).json({
      status: 'success',
      token,
      user: userObject
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check if this is a MongoDB connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      console.error('MongoDB connection error detected during login');
    }
    
    res.status(500).json({ 
      message: 'Ein Fehler ist beim Login aufgetreten', 
      error: error.message 
    });
  }
};

// Aktuelle Benutzerinformationen abrufen
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Passwort-Reset-Anfrage
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Bitte geben Sie eine E-Mail-Adresse an' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Kein Benutzer mit dieser E-Mail-Adresse gefunden' });
    }
    
    // Hier würde normalerweise ein Token generiert und per E-Mail versendet werden
    // Für die Einfachheit simulieren wir dies nur
    
    res.status(200).json({
      status: 'success',
      message: 'Passwort-Reset-Anweisungen wurden an die angegebene E-Mail-Adresse gesendet'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Passwort zurücksetzen
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, passwordConfirm } = req.body;
    
    if (!token || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'Bitte geben Sie alle erforderlichen Felder an' });
    }
    
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwörter stimmen nicht überein' });
    }
    
    // Hier würde normalerweise der Token verifiziert und das Passwort geändert werden
    // Für die Einfachheit simulieren wir dies nur
    
    res.status(200).json({
      status: 'success',
      message: 'Passwort wurde erfolgreich zurückgesetzt'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
}; 