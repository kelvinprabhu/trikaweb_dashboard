import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userEmail, query, sessionId } = body;

    if (!userEmail || !query) {
      return NextResponse.json(
        { error: "userEmail and query are required" },
        { status: 400 }
      );
    }

    // Generate session ID if not provided
    const currentSessionId = sessionId || uuidv4();

    // Find or create conversation
    let conversation = await Conversation.findOne({
      userEmail,
      sessionId: currentSessionId,
      status: "active",
    });

    if (!conversation) {
      conversation = new Conversation({
        userEmail,
        sessionId: currentSessionId,
        title: `Conversation ${new Date().toLocaleDateString()}`,
        messages: [],
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: "user",
      content: query,
      timestamp: new Date(),
    });

    // Call Django API
    const djangoResponse = await fetch("http://127.0.0.1:8000/trikabot/chat", {
      // const currentSessionId = sessionId || uuidv4();
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: userEmail,
        Query: query,
        sessionId: sessionId || uuidv4(),
      }),
    });

    if (!djangoResponse.ok) {
      throw new Error(`Django API error: ${djangoResponse.status}`);
    }

    const djangoData = await djangoResponse.json();
    const botResponse =
      djangoData.message ||
      "I'm sorry, I couldn't process your request at the moment.";

    // Add bot response to conversation
    conversation.messages.push({
      role: "assistant",
      content: botResponse,
      timestamp: new Date(),
    });

    // Save conversation
    await conversation.save();

    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      response: botResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chatbot request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");
    const sessionId = searchParams.get("sessionId");

    if (!userEmail) {
      return NextResponse.json(
        { error: "userEmail is required" },
        { status: 400 }
      );
    }

    let query = { userEmail, status: "active" };

    if (sessionId) {
      query.sessionId = sessionId;
    }

    const conversations = await Conversation.find(query)
      .sort({ lastActivity: -1 })
      .limit(10)
      .select("sessionId title totalMessages lastActivity createdAt");

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
