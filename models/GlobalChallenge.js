import mongoose from "mongoose";
import { connectDB } from "@/lib/globaldb";

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

// Create a function to get the model with the correct connection
export async function getGlobalChallengeModel() {
  const connection = await connectDB();
  return (
    connection.models.GlobalChallenge ||
    connection.model("GlobalChallenge", GlobalChallengeSchema)
  );
}

// For backward compatibility
export default mongoose.models.GlobalChallenge ||
  mongoose.model("GlobalChallenge", GlobalChallengeSchema);
