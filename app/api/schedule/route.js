import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";
import Habit from "@/models/Habit";

export async function GET(req) {
  try {
    console.log("Get schedule API called");
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    console.log("Query params:", { userEmail, date, status });

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Build query for schedules
    const scheduleQuery = { userEmail };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      scheduleQuery.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (status) {
      scheduleQuery.status = status;
    }

    console.log("MongoDB schedule query:", scheduleQuery);

    // Fetch schedules
    const schedules = await Schedule.find(scheduleQuery).sort({ date: 1, time: 1 });
    console.log(`Found ${schedules.length} schedules`);

    // Fetch habits for the same user
    const habits = await Habit.find({ userEmail }).sort({ createdAt: 1 });
    console.log(`Found ${habits.length} habits`);

    // Convert habits to schedule-like format for display
    const habitSchedules = habits.map(habit => ({
      _id: `habit_${habit._id}`,
      userEmail: habit.userEmail,
      title: habit.name,
      description: habit.description || `Daily habit: ${habit.name}`,
      type: "habit",
      date: date ? new Date(date) : new Date(),
      time: "09:00", // Default time for habits
      duration: 15, // Default duration for habits
      location: "",
      priority: "medium",
      repeat: "daily",
      customRepeat: "",
      reminder: 15,
      notes: habit.notes || "",
      isAllDay: false,
      isPrivate: false,
      attendees: "",
      equipment: "",
      calories: habit.calories || 0,
      status: "upcoming",
      category: habit.category || "Habit",
      completedAt: null,
      cancelledAt: null,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      isHabit: true, // Flag to identify habits
      habitId: habit._id,
      streak: habit.streak || 0,
      bestStreak: habit.bestStreak || 0,
      isCompletedToday: habit.isCompletedToday || false,
    }));

    // Combine schedules and habits, sort by time
    const allItems = [...schedules, ...habitSchedules].sort((a, b) => {
      // Sort by time if both have time, otherwise by creation date
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    console.log(`Total items (schedules + habits): ${allItems.length}`);

    return NextResponse.json({ schedules: allItems }, { status: 200 });
  } catch (error) {
    console.error("Get schedule failed:", error);
    return NextResponse.json(
      { error: "Failed to get schedule items", details: error.message },
      { status: 500 }
    );
  }
}
