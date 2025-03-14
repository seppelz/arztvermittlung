const Bulletin = require('../models/bulletin.model');

// Alle Pinnwand-Einträge abrufen
exports.getAllBulletins = async (req, res) => {
  try {
    // Filterobjekt erstellen
    const filter = {};
    
    // Nach Typ filtern, falls angegeben
    if (req.query.messageType) {
      filter.messageType = req.query.messageType;
    }

    // Nach Status filtern, falls angegeben
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Nach Benutzertyp filtern, falls angegeben
    if (req.query.userType) {
      filter.userType = req.query.userType;
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
      // Standardsortierung nach Zeitstempel (neueste zuerst)
      sort.timestamp = -1;
    }

    // Paginierung
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Abfrage ausführen
    const bulletins = await Bulletin.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Gesamtanzahl für Paginierung
    const total = await Bulletin.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: bulletins.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: bulletins
    });
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Einzelnen Pinnwand-Eintrag abrufen
exports.getBulletin = async (req, res) => {
  try {
    const bulletin = await Bulletin.findById(req.params.id);
    
    if (!bulletin) {
      return res.status(404).json({ message: 'Pinnwand-Eintrag nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: bulletin
    });
  } catch (error) {
    console.error('Error fetching bulletin:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Neuen Pinnwand-Eintrag erstellen
exports.createBulletin = async (req, res) => {
  try {
    const newBulletin = await Bulletin.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: newBulletin
    });
  } catch (error) {
    console.error('Error creating bulletin:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Pinnwand-Eintrag aktualisieren
exports.updateBulletin = async (req, res) => {
  try {
    const bulletin = await Bulletin.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!bulletin) {
      return res.status(404).json({ message: 'Pinnwand-Eintrag nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: bulletin
    });
  } catch (error) {
    console.error('Error updating bulletin:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Pinnwand-Eintrag löschen
exports.deleteBulletin = async (req, res) => {
  try {
    const bulletin = await Bulletin.findByIdAndDelete(req.params.id);
    
    if (!bulletin) {
      return res.status(404).json({ message: 'Pinnwand-Eintrag nicht gefunden' });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting bulletin:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Status eines Pinnwand-Eintrags ändern
exports.updateBulletinStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'pending', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Ungültiger Status' });
    }
    
    const bulletin = await Bulletin.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!bulletin) {
      return res.status(404).json({ message: 'Pinnwand-Eintrag nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: bulletin
    });
  } catch (error) {
    console.error('Error updating bulletin status:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
}; 