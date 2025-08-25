import mongoose from 'mongoose';

const CustomMeditationSessionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  currentMood: {
    type: String,
    required: true
  },
  energyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  selectedGoals: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number,
    required: true,
    min: 5,
    max: 60
  },
  binauralFrequency: {
    type: String,
    required: true,
    enum: ['delta', 'theta', 'alpha', 'beta', 'gamma']
  },
  ambientSounds: [{
    type: String
  }],
  volume: {
    type: Number,
    required: true,
    min: 10,
    max: 100
  },
  includeGuidance: {
    type: Boolean,
    default: true
  },
  includeBreathing: {
    type: Boolean,
    default: true
  },
  personalIntention: {
    type: String,
    default: ''
  },
  reminderTime: {
    type: String,
    default: ''
  },
  sessionName: {
    type: String,
    required: true
  },
  generatedAt: {
    type: Date,
    required: true
  },
  moodData: {
    value: String,
    label: String,
    emoji: String,
    color: String
  },
  frequencyData: {
    range: String,
    label: String,
    description: String,
    benefits: [String]
  },
  estimatedEffectiveness: {
    type: Number,
    min: 0,
    max: 100
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  audio_path: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
CustomMeditationSessionSchema.index({ userEmail: 1, createdAt: -1 });
CustomMeditationSessionSchema.index({ sessionId: 1 });

export default mongoose.models.CustomMeditationSession || mongoose.model('CustomMeditationSession', CustomMeditationSessionSchema);