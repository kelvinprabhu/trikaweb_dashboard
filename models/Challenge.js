import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  durationDays: Number,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  progress: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      completed: Boolean,
      completionDate: Date,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Challenge ||
  mongoose.model("Challenge", ChallengeSchema);
