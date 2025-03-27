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
    
    // Validierung der grundlegenden Eingabedaten
    if (!bulletinData.title || !bulletinData.content || !bulletinData.email || !bulletinData.userType || !bulletinData.messageType) {
      return res.status(400).json({ 
        message: 'Unvollständige Daten', 
        details: 'Titel, Inhalt, E-Mail, Benutzertyp und Nachrichtentyp sind erforderlich' 
      });
    }
    
    // Validierung für Angebote und Gesuche
    if ((bulletinData.messageType === 'Angebot' || bulletinData.messageType === 'Gesuch') && !bulletinData.startDate) {
      return res.status(400).json({ 
        message: 'Unvollständige Daten', 
        details: 'Für Angebote und Gesuche ist ein Startdatum erforderlich' 
      });
    }
    
    // Validierung für Klinik-Angebote
    if (bulletinData.userType === 'Klinik' && bulletinData.messageType === 'Angebot' && !bulletinData.federalState) {
      return res.status(400).json({ 
        message: 'Unvollständige Daten', 
        details: 'Für Klinik-Angebote ist ein Bundesland erforderlich' 
      });
    }
    
    // Datenschutzerklärung Validierung
    if (!bulletinData.privacyPolicyAccepted) {
      return res.status(400).json({ 
        message: 'Unvollständige Daten', 
        details: 'Die Datenschutzerklärung muss akzeptiert werden' 
      });
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
    
    // Mongoose Validierungsfehler speziell behandeln
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validierungsfehler', 
        details: validationErrors.join(', ') 
      });
    }
    
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

exports.addReply = async (req, res) => {
  try {
    const bulletinId = req.params.id;
    const { content, name, email, privacyPolicyAccepted } = req.body;
    const userId = req.user?._id; // Get user ID from authenticated request

    console.log('Adding reply to bulletin:', bulletinId);
    console.log('Reply data:', { content, name, email, privacyPolicyAccepted, userId });

    // Validate required fields
    if (!content || !name || !email || !privacyPolicyAccepted) {
      console.log('Missing required fields:', {
        content: !content,
        name: !name,
        email: !email,
        privacyPolicyAccepted: !privacyPolicyAccepted
      });
      return res.status(400).json({
        message: 'Required fields are missing',
        required: {
          content: !content,
          name: !name,
          email: !email,
          privacyPolicyAccepted: !privacyPolicyAccepted
        }
      });
    }

    // Find the bulletin
    const bulletin = await Bulletin.findById(bulletinId);
    if (!bulletin) {
      console.log('Bulletin not found:', bulletinId);
      return res.status(404).json({ message: 'Bulletin not found' });
    }

    // Create new reply
    const reply = {
      content,
      name,
      email,
      timestamp: new Date(),
      privacyPolicyAccepted,
      userId // Add user ID to the reply
    };

    // Add reply to bulletin
    bulletin.replies.push(reply);
    await bulletin.save();

    console.log('Reply added successfully:', reply);

    // Send email notification to bulletin author
    if (bulletin.email) {
      try {
        await sendEmail({
          to: bulletin.email,
          subject: 'Neue Antwort auf Ihr Bulletin',
          text: `Eine neue Antwort wurde auf Ihr Bulletin "${bulletin.title}" veröffentlicht.\n\nAntwort von: ${name}\nE-Mail: ${email}\n\nInhalt:\n${content}`
        });
        console.log('Email notification sent to:', bulletin.email);
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request if email sending fails
      }
    }

    res.json({
      message: 'Reply added successfully',
      reply
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      bulletinId: req.params.id,
      replyData: req.body
    });
    res.status(500).json({ 
      message: 'Error adding reply',
      error: error.message 
    });
  }
};

exports.updateReply = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id; // Get user ID from authenticated request

    console.log('Updating reply:', { bulletinId: id, replyId, userId });

    // Find the bulletin
    const bulletin = await Bulletin.findById(id);
    if (!bulletin) {
      return res.status(404).json({ message: 'Bulletin not found' });
    }

    // Find the reply
    const reply = bulletin.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check authorization
    const isAdmin = req.user?.role === 'admin';
    const isReplyOwner = reply.userId?.equals(userId);
    
    if (!isAdmin && !isReplyOwner) {
      return res.status(403).json({ message: 'Not authorized to edit this reply' });
    }

    // Update reply content
    reply.content = content;
    await bulletin.save();

    console.log('Reply updated successfully:', reply);
    res.json({
      message: 'Reply updated successfully',
      reply
    });
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({ 
      message: 'Error updating reply',
      error: error.message 
    });
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const userId = req.user?._id; // Get user ID from authenticated request

    console.log('Deleting reply:', { bulletinId: id, replyId, userId });

    // Find the bulletin
    const bulletin = await Bulletin.findById(id);
    if (!bulletin) {
      return res.status(404).json({ message: 'Bulletin not found' });
    }

    // Find the reply
    const reply = bulletin.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check authorization
    const isAdmin = req.user?.role === 'admin';
    const isReplyOwner = reply.userId?.equals(userId);
    
    if (!isAdmin && !isReplyOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    // Remove the reply
    reply.remove();
    await bulletin.save();

    console.log('Reply deleted successfully');
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ 
      message: 'Error deleting reply',
      error: error.message 
    });
  }
}; 