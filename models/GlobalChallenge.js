import mongoose from "mongoose";

const GlobalChallengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  durationDays: Number,
  workoutType: String,
  badge: String,
  color: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GlobalChallenge ||
  mongoose.model("GlobalChallenge", GlobalChallengeSchema);
