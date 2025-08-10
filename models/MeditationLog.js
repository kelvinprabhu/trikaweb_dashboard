import mongoose from "mongoose";

const MeditationLogSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    sessionId: { type: String, required: true },
    sessionTitle: { type: String, required: true },
    sessionDuration: { type: String, required: true }, // e.g., "10 min"
    actualDuration: { type: Number, required: true }, // in seconds
    completionPercentage: { type: Number, required: true, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
    sessionType: {
      type: String,
      enum: ["meditation", "breathing"],
      required: true
    },
    category: { type: String, required: true }, // e.g., "Energy", "Sleep", "Focus"
    instructor: { type: String }, // for meditation sessions
    exerciseName: { type: String }, // for breathing exercises
    mood: {
      before: { type: Number, min: 1, max: 10 },
      after: { type: Number, min: 1, max: 10 }
    },
    notes: { type: String },
    pauseCount: { type: Number, default: 0 },
    volume: { type: Number, default: 50, min: 0, max: 100 },
    backgroundSound: { type: String }, // e.g., "ocean", "forest", "rain"
    deviceInfo: {
      userAgent: String,
      platform: String
    },
    sessionDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
MeditationLogSchema.index({ userEmail: 1, sessionDate: -1 });
MeditationLogSchema.index({ userEmail: 1, sessionType: 1 });
MeditationLogSchema.index({ userEmail: 1, isCompleted: 1 });

// Pre-save middleware to update timestamps
MeditationLogSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.MeditationLog ||
  mongoose.model("MeditationLog", MeditationLogSchema);
