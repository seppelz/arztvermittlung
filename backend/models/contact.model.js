const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Bitte geben Sie Ihren Namen ein'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Bitte geben Sie Ihre E-Mail-Adresse ein'],
    trim: true,
    lowercase: true
  },
  relatedPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bulletin'
  },
  message: {
    type: String,
    required: [true, 'Bitte geben Sie eine Nachricht ein'],
    trim: true,
    maxlength: [1000, 'Die Nachricht darf nicht länger als 1000 Zeichen sein']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'responded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 