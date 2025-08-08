import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Habit from "@/models/Habit";

export async function GET(req, { params }) {
  try {
    console.log("History API called with params:", params);
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days")) || 30; // Default to 30 days

    console.log("Looking for habit with ID:", id);
    const habit = await Habit.findById(id);

    if (!habit) {
      console.log("Habit not found for ID:", id);
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    console.log("Found habit:", {
      id: habit._id,
      name: habit.name,
      hasCompletionHistory: !!habit.completionHistory,
      completionHistoryLength: habit.completionHistory?.length || 0,
    });

    // Handle existing habits that don't have completionHistory yet
    if (!habit.completionHistory) {
      habit.completionHistory = [];
    }

    // Get completion history for the specified number of days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const filteredHistory = habit.completionHistory
      .filter((entry) => new Date(entry.date) >= startDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by date for easier display
    const groupedHistory = filteredHistory.reduce((acc, entry) => {
      const dateKey = new Date(entry.date).toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry);
      return acc;
    }, {});

    // Calculate statistics
    const totalCompletions = filteredHistory.filter(
      (entry) => entry.completed
    ).length;
    const completionRate = Math.round((totalCompletions / days) * 100);

    const responseData = {
      habit: {
        id: habit._id,
        name: habit.name,
        icon: habit.icon,
        category: habit.category,
        streak: habit.streak || 0,
        bestStreak: habit.bestStreak || 0,
      },
      history: groupedHistory,
      statistics: {
        totalCompletions,
        completionRate,
        daysTracked: days,
        currentStreak: habit.streak || 0,
        bestStreak: habit.bestStreak || 0,
      },
    };

    console.log("Returning history data:", responseData);
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Get history failed:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to get habit history", details: error.message },
      { status: 500 }
    );
  }
}
