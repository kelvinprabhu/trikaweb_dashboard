import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Testing database connection...");
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          status: "error",
          message: "MONGODB_URI environment variable is not set",
          details:
            "Please create a .env.local file with MONGODB_URI=mongodb://localhost:27017/trikafitness",
        },
        { status: 500 }
      );
    }

    await connectDB();

    return NextResponse.json(
      {
        status: "success",
        message: "Database connection successful",
        mongodbUri: process.env.MONGODB_URI ? "Set" : "Not set",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
