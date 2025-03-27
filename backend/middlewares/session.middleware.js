const { isValidSessionId, generateSessionId } = require('../utils/session');

/**
 * Middleware to validate or create a session for guests
 * This is used for actions that work for both authenticated and guest users
 */
const validateOrCreateSession = (req, res, next) => {
  // Skip for authenticated users
  if (req.user) {
    return next();
  }

  // Check for session ID in request
  const sessionId = req.headers['x-session-id'] || req.body.sessionId;
  
  if (sessionId) {
    // Validate session ID format
    if (!isValidSessionId(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID format'
      });
    }
    
    // Add valid session ID to request
    req.session = { id: sessionId };
  } else {
    // Create a new session ID for guest
    const newSessionId = generateSessionId();
    req.session = { id: newSessionId };
    
    // Add session ID to response headers
    res.setHeader('X-Session-Id', newSessionId);
  }
  
  next();
};

/**
 * Middleware that requires a valid session (stricter than validateOrCreateSession)
 */
const validateSession = (req, res, next) => {
  // Skip validation for authenticated users
  if (req.user) {
    return next();
  }

  // Check for session ID in request
  const sessionId = req.headers['x-session-id'] || req.body.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      error: 'Session ID is required for guest users'
    });
  }

  // Validate session ID format
  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid session ID format'
    });
  }

  // Add session ID to request for use in controllers
  req.session = { id: sessionId };
  next();
};

module.exports = {
  validateSession,
  validateOrCreateSession
}; 