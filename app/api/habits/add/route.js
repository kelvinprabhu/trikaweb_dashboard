import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Habit from "@/models/Habit";

export async function POST(req) {
  try {
    console.log("Starting habit creation...");
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return NextResponse.json(
        {
          error: "Database configuration error",
          details:
            "MONGODB_URI environment variable is not set. Please check your .env.local file.",
        },
        { status: 500 }
      );
    }

    try {
      await connectDB();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError.message,
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log("Received habit data:", body);

    // Validate required fields
    if (!body.userEmail || !body.name || !body.category) {
      console.log("Validation failed - missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: userEmail, name, or category" },
        { status: 400 }
      );
    }

    console.log("Creating habit in database...");
    const habit = await Habit.create(body);
    console.log("Created habit:", habit);

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("Habit creation failed with error:", error);
    console.error("Error stack:", error.stack);

    // Return a more detailed error response
    return NextResponse.json(
      {
        error: "Failed to add habit",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
