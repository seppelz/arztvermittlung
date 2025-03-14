const User = require('../models/user.model');

// Alle Benutzer abrufen
exports.getAllUsers = async (req, res) => {
  try {
    // Filterobjekt erstellen
    const filter = {};
    
    // Nach Rolle filtern, falls angegeben
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Nach Benutzertyp filtern, falls angegeben
    if (req.query.userType) {
      filter.userType = req.query.userType;
    }

    // Nach Status filtern, falls angegeben
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Sortierung
    const sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sort[field.substr(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      // Standardsortierung nach Registrierungsdatum (neueste zuerst)
      sort.registrationDate = -1;
    }

    // Paginierung
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Abfrage ausführen
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Gesamtanzahl für Paginierung
    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: users.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Einzelnen Benutzer abrufen
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Neuen Benutzer erstellen
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    
    // Passwort aus der Antwort entfernen
    newUser.password = undefined;
    
    res.status(201).json({
      status: 'success',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Diese E-Mail oder Benutzername wird bereits verwendet' });
    }
    
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Benutzer aktualisieren
exports.updateUser = async (req, res) => {
  try {
    // Passwort darf nicht über diese Route aktualisiert werden
    if (req.body.password) {
      delete req.body.password;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Diese E-Mail oder Benutzername wird bereits verwendet' });
    }
    
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Benutzer löschen
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Status eines Benutzers ändern
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Ungültiger Status' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
}; 