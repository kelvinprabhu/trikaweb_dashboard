import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { sessionId } = params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { error: "userEmail is required" },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findOne({
      userEmail,
      sessionId,
      status: "active",
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Convert messages to the format expected by the frontend
    const messages = conversation.messages.map((msg, index) => ({
      id: index + 1,
      type: msg.role === "user" ? "user" : "bot",
      content: msg.content,
      timestamp: new Date(msg.timestamp),
    }));

    return NextResponse.json({
      conversation: {
        sessionId: conversation.sessionId,
        title: conversation.title,
        messages,
        totalMessages: conversation.totalMessages,
        lastActivity: conversation.lastActivity,
        createdAt: conversation.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { sessionId } = params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { error: "userEmail is required" },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findOneAndUpdate(
      {
        userEmail,
        sessionId,
        status: "active",
      },
      {
        status: "deleted",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
