import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MeditationLog from "@/models/MeditationLog";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");
    const sessionType = searchParams.get("sessionType");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const page = parseInt(searchParams.get("page")) || 1;

    if (!userEmail) {
      return NextResponse.json(
        { error: "userEmail is required" },
        { status: 400 }
      );
    }

    const query = { userEmail };
    if (sessionType) {
      query.sessionType = sessionType;
    }

    const skip = (page - 1) * limit;
    
    const logs = await MeditationLog.find(query)
      .sort({ sessionDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await MeditationLog.countDocuments(query);

    // Calculate analytics
    const analytics = await MeditationLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: { $cond: [{ $eq: ["$isCompleted", true] }, 1, 0] }
          },
          totalMinutes: {
            $sum: { $divide: ["$actualDuration", 60] }
          },
          averageCompletion: { $avg: "$completionPercentage" },
          averageMoodImprovement: {
            $avg: {
              $subtract: ["$mood.after", "$mood.before"]
            }
          }
        }
      }
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      analytics: analytics[0] || {
        totalSessions: 0,
        completedSessions: 0,
        totalMinutes: 0,
        averageCompletion: 0,
        averageMoodImprovement: 0
      }
    });
  } catch (error) {
    console.error("Error fetching meditation logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch meditation logs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log("POST /api/meditation-logs - Starting request");
    await connectDB();

    const body = await request.json();
    console.log("Request body received:", JSON.stringify(body, null, 2));
    
    // Validate required fields
    const requiredFields = ['userEmail', 'sessionId', 'sessionTitle', 'sessionDuration', 'actualDuration', 'completionPercentage', 'sessionType', 'category'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        console.log(`Validation failed: ${field} is missing or empty`);
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate completion percentage
    if (body.completionPercentage < 0 || body.completionPercentage > 100) {
      console.log(`Validation failed: completionPercentage ${body.completionPercentage} is out of range`);
      return NextResponse.json(
        { error: "completionPercentage must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Set isCompleted based on completion percentage
    body.isCompleted = body.completionPercentage >= 80;

    console.log("Creating meditation log with validated data");
    const log = new MeditationLog(body);
    const savedLog = await log.save();
    console.log("Meditation log saved successfully:", savedLog._id);

    return NextResponse.json({ log: savedLog, message: "Meditation log saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating meditation log:", error);
    console.error("Error stack:", error.stack);
    
    // Handle MongoDB duplicate key errors specifically
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate meditation log entry" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create meditation log", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { logId, ...updateData } = body;

    if (!logId) {
      return NextResponse.json(
        { error: "logId is required" },
        { status: 400 }
      );
    }

    const updatedLog = await MeditationLog.findByIdAndUpdate(
      logId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedLog) {
      return NextResponse.json(
        { error: "Meditation log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ log: updatedLog, message: "Meditation log updated successfully" });
  } catch (error) {
    console.error("Error updating meditation log:", error);
    return NextResponse.json(
      { error: "Failed to update meditation log" },
      { status: 500 }
    );
  }
}
