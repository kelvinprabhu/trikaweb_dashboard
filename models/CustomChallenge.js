import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  exercise: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  reason: { type: String, required: true },
});

const WorkoutSessionSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  workoutType: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  duration: { type: Number }, // in minutes
  restTime: { type: Number }, // in seconds
  notes: String,
});

const CustomChallengeSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: ["TrikaVision", "Regular", "Strength", "Cardio", "Flexibility", "Mixed"],
      default: "Regular",
    },
    type: { type: String }, // e.g., "HIIT"
    fitnessLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    goalTags: [{ type: String }], // e.g., ["cardio", "calorie-burn"]
    workout: { type: String }, // workout name
    exercises: [ExerciseSchema], // AI-generated exercises
    aiRecommendationReason: { type: String }, // AI explanation
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
    durationDays: { type: Number, required: true },
    workoutSessions: [WorkoutSessionSchema],
    badge: { type: String, default: "🏆" },
    color: { type: String, default: "from-blue-500 to-purple-500" },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    completedDays: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    progress: { type: Number, default: 0 }, // percentage
    logs: [
      {
        date: { type: Date, required: true },
        completed: { type: Boolean, default: false },
        notes: String,
        actualSets: Number,
        actualReps: Number,
        actualDuration: Number,
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
CustomChallengeSchema.index({ userEmail: 1, isActive: 1 });
CustomChallengeSchema.index({ userEmail: 1, createdAt: -1 });

// Pre-save middleware to update progress
CustomChallengeSchema.pre("save", function (next) {
  if (this.durationDays > 0) {
    this.progress = Math.round((this.completedDays / this.durationDays) * 100);
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.CustomChallenge ||
  mongoose.model("CustomChallenge", CustomChallengeSchema);


