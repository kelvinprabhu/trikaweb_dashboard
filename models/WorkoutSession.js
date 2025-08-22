import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  breaksTaken: { type: Number, default: 0 },
  postureGuidance: { type: String },
  met: { type: Number, required: true },
  category: { type: String, required: true }
});

const BreakSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  durationSeconds: { type: Number, required: true }
});

const WorkoutSessionSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    sessionType: {
      type: String,
      enum: ["Global", "Custom", "Regular"],
      required: true
    },
    title: { type: String, required: true },
    workoutType: { type: String },
    totalDurationMinutes: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    caloriesBurned: { type: Number, default: 0 },
    restDurationSeconds: { type: Number, default: 30 },
    intervalType: {
      type: String,
      enum: ["Fixed", "Reps"],
      default: "Fixed"
    },
    exercises: [ExerciseSchema],
    breaks: [BreakSchema],
    voiceGuidanceUsed: { type: Boolean, default: false },
    aiMotivationPhrases: [{ type: String }],
    notes: { type: String }
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
WorkoutSessionSchema.index({ userEmail: 1, startTime: -1 });
WorkoutSessionSchema.index({ userEmail: 1, sessionType: 1 });

export default mongoose.models.WorkoutSession || 
  mongoose.model("WorkoutSession", WorkoutSessionSchema);
