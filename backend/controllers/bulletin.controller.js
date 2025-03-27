const Bulletin = require('../models/bulletin.model');
const { sendEmail } = require('../utils/email');
const { generateSessionId } = require('../utils/session');

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
    const { name, email, content, messageType, specialty, federalState, startDate, phone, privacyPolicyAccepted } = req.body;
    
    // Get user ID if authenticated, otherwise generate session ID
    const userId = req.user?._id;
    const sessionId = !userId ? generateSessionId() : null;

    const bulletin = new Bulletin({
      name,
      email,
      content,
      messageType,
      specialty,
      federalState,
      startDate,
      phone,
      privacyPolicyAccepted,
      userId,
      sessionId
    });

    await bulletin.save();

    // Send email notification for new bulletin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New ${messageType} Bulletin Entry`,
      text: `A new ${messageType} bulletin entry has been created by ${name} (${email}).`
    });

    res.status(201).json({
      success: true,
      data: bulletin
    });
  } catch (error) {
    console.error('Error creating bulletin:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating bulletin entry'
    });
  }
};

// Pinnwand-Eintrag aktualisieren
exports.updateBulletin = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, specialty, federalState, startDate, phone } = req.body;

    const bulletin = await Bulletin.findById(id);
    if (!bulletin) {
      return res.status(404).json({
        success: false,
        error: 'Bulletin not found'
      });
    }

    // Check if user can edit this bulletin
    const canEdit = bulletin.canEdit(req.user?._id, req.session?.id);
    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to edit this bulletin'
      });
    }

    // Update only allowed fields
    bulletin.content = content;
    bulletin.specialty = specialty;
    bulletin.federalState = federalState;
    bulletin.startDate = startDate;
    bulletin.phone = phone;

    await bulletin.save();

    res.status(200).json({
      success: true,
      data: bulletin
    });
  } catch (error) {
    console.error('Error updating bulletin:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating bulletin'
    });
  }
};

// Pinnwand-Eintrag löschen
exports.deleteBulletin = async (req, res) => {
  try {
    const { id } = req.params;

    const bulletin = await Bulletin.findById(id);
    if (!bulletin) {
      return res.status(404).json({
        success: false,
        error: 'Bulletin not found'
      });
    }

    // Check if user can delete this bulletin
    const canEdit = bulletin.canEdit(req.user?._id, req.session?.id);
    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this bulletin'
      });
    }

    bulletin.status = 'deleted';
    await bulletin.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting bulletin:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting bulletin'
    });
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

// Add a reply to a bulletin
exports.addReply = async (req, res) => {
  try {
    const { bulletinId } = req.params;
    const { name, email, content, privacyPolicyAccepted } = req.body;

    // Get user ID if authenticated, otherwise generate session ID
    const userId = req.user?._id;
    const sessionId = !userId ? generateSessionId() : null;

    const bulletin = await Bulletin.findById(bulletinId);
    if (!bulletin) {
      return res.status(404).json({
        success: false,
        error: 'Bulletin not found'
      });
    }

    bulletin.replies.push({
      name,
      email,
      content,
      privacyPolicyAccepted,
      userId,
      sessionId
    });

    await bulletin.save();

    // Send email notification for new reply
    await sendEmail({
      to: bulletin.email,
      subject: 'New Reply to Your Bulletin Entry',
      text: `A new reply has been added to your bulletin entry by ${name} (${email}).`
    });

    res.status(201).json({
      success: true,
      data: bulletin
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({
      success: false,
      error: 'Error adding reply'
    });
  }
};

// Update a reply
exports.updateReply = async (req, res) => {
  try {
    const { bulletinId, replyId } = req.params;
    const { content } = req.body;

    const bulletin = await Bulletin.findById(bulletinId);
    if (!bulletin) {
      return res.status(404).json({
        success: false,
        error: 'Bulletin not found'
      });
    }

    // Check if user can edit this reply
    const canEdit = bulletin.canEditReply(replyId, req.user?._id, req.session?.id);
    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to edit this reply'
      });
    }

    const reply = bulletin.replies.id(replyId);
    reply.content = content;

    await bulletin.save();

    res.status(200).json({
      success: true,
      data: bulletin
    });
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating reply'
    });
  }
};

// Delete a reply
exports.deleteReply = async (req, res) => {
  try {
    const { bulletinId, replyId } = req.params;

    const bulletin = await Bulletin.findById(bulletinId);
    if (!bulletin) {
      return res.status(404).json({
        success: false,
        error: 'Bulletin not found'
      });
    }

    // Check if user can delete this reply
    const canEdit = bulletin.canEditReply(replyId, req.user?._id, req.session?.id);
    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this reply'
      });
    }

    bulletin.replies.pull(replyId);
    await bulletin.save();

    res.status(200).json({
      success: true,
      data: bulletin
    });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting reply'
    });
  }
};

// Search bulletins with filters
exports.searchBulletins = async (req, res) => {
  try {
    const {
      messageType,
      userType,
      federalState,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Build query based on filters
    if (messageType) query.messageType = messageType;
    if (userType) query.userType = userType;
    if (federalState) query.federalState = federalState;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const bulletins = await Bulletin.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Bulletin.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: bulletins,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching bulletins:', error);
    res.status(500).json({ 
      message: 'Error searching bulletins',
      error: error.message 
    });
  }
};

// Get bulletins by user ID
exports.getBulletinsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const bulletins = await Bulletin.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Bulletin.countDocuments({ userId });

    res.status(200).json({
      status: 'success',
      data: bulletins,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user bulletins:', error);
    res.status(500).json({ 
      message: 'Error getting user bulletins',
      error: error.message 
    });
  }
};

// Get all bulletins with optional filters
exports.getBulletins = async (req, res) => {
  try {
    const { messageType, status = 'active', page = 1, limit = 10 } = req.query;
    const query = { status };

    if (messageType) {
      query.messageType = messageType;
    }

    const bulletins = await Bulletin.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Bulletin.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bulletins,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching bulletins'
    });
  }
};

// Get user's bulletins
exports.getUserBulletins = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = {
      $or: [
        { userId: req.user._id },
        { sessionId: req.session.id }
      ]
    };

    const bulletins = await Bulletin.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Bulletin.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bulletins,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user bulletins:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user bulletins'
    });
  }
}; 