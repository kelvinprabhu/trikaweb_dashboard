import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // adjust based on your path
import Habit from "@/models/Habit";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    await connectDB();
    const habits = await Habit.find({ userEmail: email });
    return NextResponse.json(habits, { status: 200 });
  } catch (error) {
    console.error("Fetch habits error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
