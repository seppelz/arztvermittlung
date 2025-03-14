const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Bitte geben Sie einen Benutzernamen ein'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Bitte geben Sie eine E-Mail-Adresse ein'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Bitte geben Sie eine gültige E-Mail-Adresse ein']
  },
  password: {
    type: String,
    required: [true, 'Bitte geben Sie ein Passwort ein'],
    minlength: 8,
    select: false
  },
  name: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  userType: {
    type: String,
    enum: ['Arzt', 'Klinik', 'Administrator', 'Gast'],
    required: function() { 
      return this.role === 'user';
    }
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  // Spezifische Felder für Ärzte
  specialization: {
    type: String,
    trim: true
  },
  availability: [
    {
      from: Date,
      to: Date,
      location: String
    }
  ],
  // Spezifische Felder für Kliniken
  location: {
    type: String,
    trim: true
  },
  hospitalSize: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Passwort vor dem Speichern hashen
userSchema.pre('save', async function(next) {
  // Nur ausführen, wenn Passwort modifiziert wurde
  if (!this.isModified('password')) return next();
  
  // Passwort hashen
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Methode zum Vergleichen des Passworts
userSchema.methods.checkPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 