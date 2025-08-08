import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Habit from "@/models/Habit";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();
    const { notes } = body;

    const habit = await Habit.findById(id);

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    if (habit.isCompletedToday) {
      return NextResponse.json(
        { error: "Habit already completed today" },
        { status: 400 }
      );
    }

    // Add completion to history
    const completionEntry = {
      date: today,
      completed: true,
      notes: notes || "",
      timestamp: new Date(),
    };

    habit.completionHistory.push(completionEntry);
    habit.lastCompletedDate = today;
    habit.isCompletedToday = true;

    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      habit.lastCompletedDate &&
      habit.lastCompletedDate.getTime() === yesterday.getTime()
    ) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }

    // Update best streak
    if (habit.streak > habit.bestStreak) {
      habit.bestStreak = habit.streak;
    }

    // Update weekly data
    const dayOfWeek = today.getDay();
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0
    habit.weeklyData[adjustedDay] = true;
    habit.completedThisWeek += 1;

    // Update monthly completion
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const daysPassed = today.getDate();

    const monthlyCompletions = habit.completionHistory.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear() &&
        entry.completed
      );
    }).length;

    habit.monthlyCompletion = Math.round(
      (monthlyCompletions / daysPassed) * 100
    );

    await habit.save();

    return NextResponse.json(habit, { status: 200 });
  } catch (error) {
    console.error("Mark complete failed:", error);
    return NextResponse.json(
      { error: "Failed to mark habit as complete", details: error.message },
      { status: 500 }
    );
  }
}
