import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
});

const ConversationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: "New Conversation",
    },
    messages: [MessageSchema],
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    tags: [String],
    summary: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ConversationSchema.index({ userEmail: 1, createdAt: -1 });
ConversationSchema.index({ sessionId: 1 });
ConversationSchema.index({ status: 1, lastActivity: -1 });

// Pre-save middleware to update totalMessages
ConversationSchema.pre("save", function (next) {
  this.totalMessages = this.messages.length;
  this.lastActivity = new Date();
  next();
});

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
