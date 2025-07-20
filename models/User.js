// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  age: Number,
  weight: Number,
  height: Number,
  fitnessLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },
  preferences: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
