// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },

    // Onboarding fields
    personalInfo: {
      age: String,
      gender: String,
      height: String,
      weight: String,
      activityLevel: String,
    },
    fitnessGoals: {
      primaryGoal: String,
      fitnessLevel: String,
      workoutFrequency: String,
      preferredWorkouts: [String],
    },
    preferences: {
      notifications: Boolean,
      dataSharing: Boolean,
      newsletter: Boolean,
      reminderTime: String,
    },

    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
