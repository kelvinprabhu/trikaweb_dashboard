import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  completedDates: [Date],
  targetStreak: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Habit || mongoose.model("Habit", HabitSchema);
