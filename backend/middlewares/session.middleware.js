const { isValidSessionId } = require('../utils/session');

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
  validateSession
}; 