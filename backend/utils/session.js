const crypto = require('crypto');

// Generate a unique session ID for guest users
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate a session ID format
const isValidSessionId = (sessionId) => {
  return typeof sessionId === 'string' && sessionId.length === 64;
};

module.exports = {
  generateSessionId,
  isValidSessionId
}; 