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
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessionId: {
    type: String,
    required: false
  },
  userType: {
    type: String,
    required: false,
    enum: ['Arzt', 'Klinik', 'anonymous'],
    default: 'Arzt'
  },
  messageType: {
    type: String,
    enum: ['Information', 'Angebot', 'Gesuch'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  specialty: {
    type: String,
    required: false
  },
  specialtyOther: {
    type: String,
    trim: true
  },
  federalState: {
    type: String,
    required: false
  },
  startDate: {
    type: Date,
    required: false
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
    required: true
  },
  replies: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    sessionId: {
      type: String,
      required: false
    },
    privacyPolicyAccepted: {
      type: Boolean,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
bulletinSchema.index({ messageType: 1, status: 1 });
bulletinSchema.index({ userId: 1 });
bulletinSchema.index({ sessionId: 1 });
bulletinSchema.index({ timestamp: -1 });

// Add method to check if a user can edit/delete a bulletin
bulletinSchema.methods.canEdit = function(userId, sessionId) {
  if (!userId && !sessionId) return false;
  return this.userId?.equals(userId) || this.sessionId === sessionId;
};

// Add method to check if a user can edit/delete a reply
bulletinSchema.methods.canEditReply = function(replyId, userId, sessionId) {
  const reply = this.replies.id(replyId);
  if (!reply) return false;
  if (!userId && !sessionId) return false;
  return reply.userId?.equals(userId) || reply.sessionId === sessionId;
};

const Bulletin = mongoose.model('Bulletin', bulletinSchema);

module.exports = Bulletin; 