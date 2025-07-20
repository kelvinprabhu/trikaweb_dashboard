import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workoutType: String,
  duration: Number, // in seconds
  caloriesBurned: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Workout ||
  mongoose.model("Workout", WorkoutSchema);
