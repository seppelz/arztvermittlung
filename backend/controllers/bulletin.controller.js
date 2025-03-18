const Bulletin = require('../models/bulletin.model');

// Alle Pinnwand-Einträge abrufen
exports.getAllBulletins = async (req, res) => {
  try {
    console.log(`Received request for bulletins with query:`, req.query);
    
    // Filterobjekt erstellen
    const filter = {};
    
    // Nach Typ filtern, falls angegeben
    if (req.query.messageType) {
      filter.messageType = req.query.messageType;
      console.log(`Filtering by messageType: ${req.query.messageType}`);
    }

    // Nach Status filtern, falls angegeben
    if (req.query.status) {
      filter.status = req.query.status;
      console.log(`Filtering by status: ${req.query.status}`);
    }

    // Nach Benutzertyp filtern, falls angegeben
    if (req.query.userType) {
      filter.userType = req.query.userType;
      console.log(`Filtering by userType: ${req.query.userType}`);
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
      console.log(`Sorting by:`, sort);
    } else {
      // Standardsortierung nach Zeitstempel (neueste zuerst)
      sort.timestamp = -1;
      console.log(`Using default sort by timestamp desc`);
    }

    // Paginierung
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`Using filter:`, filter);
    console.log(`Pagination: page=${page}, limit=${limit}, skip=${skip}`);

    // Abfrage ausführen
    const bulletins = await Bulletin.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    console.log(`Found ${bulletins.length} bulletins`);

    // Gesamtanzahl für Paginierung
    const total = await Bulletin.countDocuments(filter);
    console.log(`Total bulletins matching filter: ${total}`);

    res.status(200).json({
      status: 'success',
      results: bulletins.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: bulletins
    });
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check if this is a MongoDB connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      console.error('MongoDB connection error detected');
    }
    
    res.status(500).json({ 
      message: 'Ein Fehler ist aufgetreten beim Abrufen der Pinnwand-Einträge', 
      error: error.message 
    });
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
    const bulletinData = req.body;
    
    // Validierung der Eingabedaten
    if (!bulletinData.title || !bulletinData.content) {
      return res.status(400).json({ message: 'Titel und Inhalt sind erforderlich' });
    }
    
    const newBulletin = new Bulletin(bulletinData);
    const savedBulletin = await newBulletin.save();
    
    res.status(201).json({ 
      message: 'Pinnwand-Eintrag erfolgreich erstellt',
      data: savedBulletin 
    });
    
    // Das erstellte Bulletin-Objekt zurückgeben, damit es für E-Mail-Benachrichtigungen verwendet werden kann
    return savedBulletin;
  } catch (error) {
    console.error('Error creating bulletin:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
    return null;
  }
};

// Pinnwand-Eintrag aktualisieren
exports.updateBulletin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedBulletin = await Bulletin.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Gibt das aktualisierte Dokument zurück
    );
    
    if (!updatedBulletin) {
      return res.status(404).json({ message: 'Pinnwand-Eintrag nicht gefunden' });
    }
    
    res.status(200).json({ 
      message: 'Pinnwand-Eintrag erfolgreich aktualisiert',
      data: updatedBulletin 
    });
  } catch (error) {
    console.error('Error updating bulletin:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Pinnwand-Eintrag löschen
exports.deleteBulletin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBulletin = await Bulletin.findByIdAndDelete(id);
    
    if (!deletedBulletin) {
      return res.status(404).json({ message: 'Pinnwand-Eintrag nicht gefunden' });
    }
    
    res.status(200).json({ 
      message: 'Pinnwand-Eintrag erfolgreich gelöscht',
      data: deletedBulletin
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