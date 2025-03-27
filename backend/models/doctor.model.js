const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    trim: true
  },
  qualifications: [{
    type: String,
    trim: true
  }],
  otherQualifications: {
    type: String,
    trim: true
  },
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    }
  },
  availability: {
    availableFrom: {
      type: Date,
      required: true
    },
    federalState: {
      type: String,
      trim: true
    }
  },
  additionalInfo: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
doctorSchema.index({ userId: 1 });

// Pre-save middleware to check if profile is complete
doctorSchema.pre('save', function(next) {
  this.isProfileComplete = !!(
    this.name &&
    this.contact.email &&
    this.availability.availableFrom
  );
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor; 