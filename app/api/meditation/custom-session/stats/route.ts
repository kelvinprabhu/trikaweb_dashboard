import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MeditationSession from "@/models/meditationSession";
import { calculateStats } from "@/models/meditation-session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { error: "userEmail parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const sessions = await MeditationSession.find({ userEmail })
      .sort({ startTime: -1 })
      .lean();

    const stats = calculateStats(sessions as any);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching meditation stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch meditation stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json();

    if (!sessionData.userEmail || !sessionData.sessionId) {
      return NextResponse.json(
        { error: "Missing required fields: userEmail, sessionId" },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData = {
      ...sessionData,
      updatedAt: new Date(),
    };

    if (sessionData._id) {
      delete updateData._id;
    }

    const result = await MeditationSession.updateOne(
      {
        sessionId: sessionData.sessionId,
        userEmail: sessionData.userEmail,
      },
      {
        $set: updateData,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Meditation session updated successfully",
      upsertedId: result.upsertedId,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating meditation session:", error);
    return NextResponse.json(
      { error: "Failed to update meditation session" },
      { status: 500 }
    );
  }
}
