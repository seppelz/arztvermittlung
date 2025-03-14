const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bitte geben Sie den Arzt an']
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bitte geben Sie die Klinik an']
  },
  initialContactDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['initiated', 'agreed', 'completed', 'cancelled'],
    default: 'initiated'
  },
  agreementDate: {
    type: Date
  },
  compensationAgreed: {
    type: Boolean,
    default: false
  },
  compensationPaid: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number
  },
  duration: {
    type: String,
    trim: true
  },
  positionTitle: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Placement = mongoose.model('Placement', placementSchema);

module.exports = Placement; 