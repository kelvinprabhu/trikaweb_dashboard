import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true }, // To associate schedule with a user
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true }, // exercise, meditation, nutrition, wellness, appointment, reminder
    date: { type: Date, required: true },
    time: { type: String },
    duration: { type: Number }, // in minutes
    location: { type: String },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "custom"],
      default: "none",
    },
    customRepeat: { type: String },
    reminder: { type: Number, default: 15 }, // minutes before
    notes: { type: String },
    isAllDay: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    attendees: { type: String },
    equipment: { type: String },
    calories: { type: Number },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },
    category: { type: String },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
scheduleSchema.index({ userEmail: 1, date: 1 });
scheduleSchema.index({ userEmail: 1, status: 1 });

const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

export default Schedule;
