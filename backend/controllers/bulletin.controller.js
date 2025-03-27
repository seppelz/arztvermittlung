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

// Validate bulletin data for create and update
function validateBulletinData(data, isUpdate = false) {
  const errors = {};
  
  // Basic required fields check (skip on update if not provided)
  if (!isUpdate || data.title !== undefined) {
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
    } else if (data.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
  }
  
  if (!isUpdate || data.content !== undefined) {
    if (!data.content || data.content.trim() === '') {
      errors.content = 'Content is required';
    } else if (data.content.length > 1000) {
      errors.content = 'Content cannot exceed 1000 characters';
    }
  }
  
  if (!isUpdate) {
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Name is required';
    }
    
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
  }
  
  if (!isUpdate || data.messageType !== undefined) {
    if (!data.messageType || !['Information', 'Angebot', 'Gesuch'].includes(data.messageType)) {
      errors.messageType = 'Valid message type is required';
    }
  }
  
  // Special validations for job listings
  if ((data.messageType === 'Angebot' || data.messageType === 'Gesuch') && 
      (!isUpdate || data.startDate !== undefined)) {
    if (!data.startDate) {
      errors.startDate = 'Start date is required for job listings';
    } else {
      const startDate = new Date(data.startDate);
      if (isNaN(startDate.getTime())) {
        errors.startDate = 'Invalid start date format';
      }
    }
  }
  
  // Check privacy policy acceptance
  if (!isUpdate && !data.privacyPolicyAccepted) {
    errors.privacyPolicyAccepted = 'Privacy policy must be accepted';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Neuen Pinnwand-Eintrag erstellen
exports.createBulletin = async (req, res) => {
  try {
    const { name, email, content, messageType, specialty, federalState, startDate, phone, privacyPolicyAccepted, title } = req.body;
    
    // Validate bulletin data
    const validation = validateBulletinData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
        message: 'Validation failed'
      });
    }
    
    // Get user ID if authenticated, otherwise generate session ID
    const userId = req.user?._id;
    const sessionId = !userId ? generateSessionId() : null;

    const bulletin = new Bulletin({
      title,
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
    const updateData = req.body;

    // Validate update data
    const validation = validateBulletinData(updateData, true);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
        message: 'Validation failed'
      });
    }

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
    const allowedFields = ['title', 'content', 'specialty', 'federalState', 'startDate', 'phone'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        bulletin[field] = updateData[field];
      }
    });

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

// Add reply to a bulletin
exports.addReply = async (req, res) => {
  try {
    const { bulletinId } = req.params;
    const { name, email, content, privacyPolicyAccepted, userId, sessionId: clientSessionId } = req.body;

    console.log('Adding reply to bulletin:', bulletinId);
    console.log('Request user:', req.user ? { id: req.user._id, name: req.user.name } : 'No user');
    console.log('Request session:', req.session ? { id: req.session.id } : 'No session');
    console.log('Request body:', { 
      name, 
      email, 
      content: content?.substring(0, 20) + '...',
      privacyPolicyAccepted: privacyPolicyAccepted ? 'Accepted' : 'Not provided',
      userId: userId ? 'Provided' : 'Not provided',
      clientSessionId: clientSessionId ? 'Provided' : 'Not provided'
    });

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }
    
    // For authenticated users, always assume privacy policy is accepted
    // For unauthenticated users, require explicit acceptance
    if (!req.user && !privacyPolicyAccepted) {
      return res.status(400).json({
        success: false,
        error: 'Privacy policy acceptance is required for guest users'
      });
    }
    
    // For unauthenticated users, name and email are required
    if (!req.user && (!name || !email)) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required for guest users'
      });
    }

    // Find the bulletin
    const bulletin = await Bulletin.findById(bulletinId);
    if (!bulletin) {
      return res.status(404).json({
        success: false,
        error: 'Bulletin not found'
      });
    }

    // Collect all possible session IDs (server session, header, body)
    const serverSessionId = req.session?.id;
    const headerSessionId = req.headers['x-session-id'];
    const sessionIdToUse = serverSessionId || headerSessionId || clientSessionId;
    
    console.log('Session ID sources:', { 
      server: serverSessionId ? 'Present' : 'Not present', 
      header: headerSessionId ? 'Present' : 'Not present',
      client: clientSessionId ? 'Present' : 'Not present',
      used: sessionIdToUse ? 'Using ID' : 'No session ID available'
    });

    // Create new reply with appropriate data
    const reply = {
      content,
      privacyPolicyAccepted: req.user ? true : !!privacyPolicyAccepted // Always true for authenticated users
    };
    
    // Set user information based on authentication state
    if (req.user) {
      // For authenticated users
      reply.name = req.user.name;
      reply.email = req.user.email;
      reply.userId = req.user._id;
      console.log('Using authenticated user data:', { id: req.user._id, name: req.user.name });
    } else {
      // For guest users
      reply.name = name;
      reply.email = email;
      reply.sessionId = sessionIdToUse;
      console.log('Using guest user data with session ID:', sessionIdToUse);
    }

    console.log('Creating reply with:', { 
      name: reply.name, 
      email: reply.email,
      userId: reply.userId ? 'Set' : 'Not set',
      sessionId: reply.sessionId ? 'Set' : 'Not set',
      privacyPolicyAccepted: reply.privacyPolicyAccepted
    });

    // Initialize replies array if it doesn't exist
    if (!bulletin.replies) {
      bulletin.replies = [];
    }

    bulletin.replies.push(reply);
    await bulletin.save();

    // Send email notification for new reply
    try {
      await sendEmail({
        to: bulletin.email,
        subject: 'New Reply to Your Bulletin Entry',
        text: `A new reply has been added to your bulletin entry by ${reply.name} (${reply.email}).`
      });
    } catch (emailError) {
      console.error('Failed to send email notification for reply:', emailError);
      // Continue processing even if email fails
    }

    res.status(201).json({
      success: true,
      data: bulletin
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error based on the type of error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error: ' + error.message
      });
    } else if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid bulletin ID format'
      });
    }
    
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

    // Validate content
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const bulletin = await Bulletin.findById(bulletinId);
    if (!bulletin) {
      return res.status(404).json({
        success: false,
        error: 'Bulletin not found'
      });
    }

    // Check if replies array exists
    if (!bulletin.replies || bulletin.replies.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No replies found for this bulletin'
      });
    }

    // Find the reply to update
    const replyIndex = bulletin.replies.findIndex(reply => 
      reply._id.toString() === replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Reply not found'
      });
    }

    const reply = bulletin.replies[replyIndex];

    // Check permissions - admin, owner of the reply, or owner of the bulletin can update
    const isAdmin = req.user && req.user.role === 'admin';
    const isReplyOwner = req.user && reply.userId && reply.userId.toString() === req.user._id.toString();
    const isBulletinOwner = req.user && bulletin.userId && bulletin.userId.toString() === req.user._id.toString();
    const isSessionMatch = req.session && req.session.id === reply.sessionId;

    if (!isAdmin && !isReplyOwner && !isBulletinOwner && !isSessionMatch) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this reply'
      });
    }

    // Update the reply
    bulletin.replies[replyIndex].content = content;
    await bulletin.save();

    return res.status(200).json({
      success: true,
      message: 'Reply updated successfully',
      data: bulletin
    });
  } catch (error) {
    console.error('Error updating reply:', error);
    return res.status(500).json({
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

    // Check if replies array exists
    if (!bulletin.replies || bulletin.replies.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No replies found for this bulletin'
      });
    }

    // Find the reply to delete
    const replyIndex = bulletin.replies.findIndex(reply => 
      reply._id.toString() === replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Reply not found'
      });
    }

    const reply = bulletin.replies[replyIndex];

    // Check permissions - admin, owner of the reply, or owner of the bulletin can delete
    const isAdmin = req.user && req.user.role === 'admin';
    const isReplyOwner = req.user && reply.userId && reply.userId.toString() === req.user._id.toString();
    const isBulletinOwner = req.user && bulletin.userId && bulletin.userId.toString() === req.user._id.toString();
    const isSessionMatch = req.session && req.session.id === reply.sessionId;

    if (!isAdmin && !isReplyOwner && !isBulletinOwner && !isSessionMatch) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this reply'
      });
    }

    // Remove the reply
    bulletin.replies.splice(replyIndex, 1);
    await bulletin.save();

    return res.status(200).json({
      success: true,
      message: 'Reply deleted successfully',
      data: bulletin
    });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return res.status(500).json({
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