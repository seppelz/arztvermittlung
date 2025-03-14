const mongoose = require('mongoose');

const bulletinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bitte geben Sie einen Titel ein'],
    trim: true,
    maxlength: [100, 'Der Titel darf nicht länger als 100 Zeichen sein']
  },
  content: {
    type: String,
    required: [true, 'Bitte geben Sie einen Inhalt ein'],
    trim: true,
    maxlength: [1000, 'Der Inhalt darf nicht länger als 1000 Zeichen sein']
  },
  name: {
    type: String,
    required: [true, 'Bitte geben Sie einen Namen ein'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Bitte geben Sie eine E-Mail-Adresse ein'],
    trim: true,
    lowercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userType: {
    type: String,
    required: [true, 'Bitte geben Sie den Benutzertyp ein'],
    enum: ['Arzt', 'Klinik']
  },
  messageType: {
    type: String,
    required: [true, 'Bitte geben Sie den Nachrichtentyp ein'],
    enum: ['Angebot', 'Gesuch', 'Information']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'archived'],
    default: 'active'
  },
  // Für zukünftige Erweiterungen
  category: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  compensation: {
    type: Number
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Bulletin = mongoose.model('Bulletin', bulletinSchema);

module.exports = Bulletin; 