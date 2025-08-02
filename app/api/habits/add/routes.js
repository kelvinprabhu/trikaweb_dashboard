import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Habit from "@/models/Habit";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    const habit = await Habit.create(body);
    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("Habit creation failed:", error);
    return NextResponse.json({ error: "Failed to add habit" }, { status: 500 });
  }
}
