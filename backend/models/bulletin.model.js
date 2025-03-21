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
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Bitte geben Sie eine E-Mail-Adresse ein'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
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
    default: 'pending'
  },
  specialty: {
    type: String,
    trim: true
  },
  specialtyOther: {
    type: String,
    trim: true
  },
  federalState: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
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
  },
  privacyPolicyAccepted: {
    type: Boolean,
    required: [true, 'Bitte akzeptieren Sie die Datenschutzerklärung']
  }
}, {
  timestamps: true
});

const Bulletin = mongoose.model('Bulletin', bulletinSchema);

module.exports = Bulletin; 