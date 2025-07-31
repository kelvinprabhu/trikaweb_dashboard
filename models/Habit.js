// models/Habit.js
import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true }, // To associate habit with a user
    name: { type: String, required: true },
    icon: { type: String, default: "🔥" },
    category: { type: String },
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    target: { type: Number, default: 7 },
    frequency: { type: String, default: "Daily" },
    completedThisWeek: { type: Number, default: 0 },
    totalWeeks: { type: Number, default: 1 },
    weeklyData: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false],
    },
    monthlyCompletion: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Habit || mongoose.model("Habit", habitSchema);
