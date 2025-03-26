const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
    enum: ['krankenhaus', 'klinik', 'reha', 'praxis']
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{5}$/, 'Please enter a valid postal code']
    }
  },
  contact: {
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  specialties: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  website: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Please enter a valid URL']
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
hospitalSchema.index({ userId: 1 });

// Pre-save middleware to check if profile is complete
hospitalSchema.pre('save', function(next) {
  this.isProfileComplete = !!(
    this.name &&
    this.type &&
    this.address.street &&
    this.address.city &&
    this.address.postalCode &&
    this.contact.phone
  );
  next();
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital; 