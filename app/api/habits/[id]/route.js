// pages/api/habit/[id].js
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Habit from "@/models/Habit";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;
  const habit = await Habit.findById(id);
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }
  return NextResponse.json(habit);
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  await Habit.findByIdAndDelete(id);
  return NextResponse.json({ message: "Habit deleted successfully" });
}
