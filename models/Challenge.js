import mongoose from "mongoose";

const UserChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "GlobalChallenge" },

  startDate: { type: Date, default: Date.now },
  completedDays: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },

  // Optionally track daily logs:
  logs: [
    {
      date: Date,
      completed: Boolean,
    },
  ],
});

export default mongoose.models.UserChallenge ||
  mongoose.model("UserChallenge", UserChallengeSchema);
