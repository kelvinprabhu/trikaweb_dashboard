import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";

export async function POST(req) {
  try {
    console.log("Add schedule API called");
    await connectDB();

    const body = await req.json();
    console.log("Request body:", body);

    const {
      userEmail,
      title,
      description,
      type,
      date,
      time,
      duration,
      location,
      priority,
      repeat,
      customRepeat,
      reminder,
      notes,
      isAllDay,
      isPrivate,
      attendees,
      equipment,
      calories,
      category,
    } = body;

    // Validation
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    // Create schedule item
    const scheduleItem = new Schedule({
      userEmail,
      title,
      description,
      type,
      date: new Date(date),
      time,
      duration: duration ? parseInt(duration) : undefined,
      location,
      priority,
      repeat,
      customRepeat,
      reminder: reminder ? parseInt(reminder) : 15,
      notes,
      isAllDay,
      isPrivate,
      attendees,
      equipment,
      calories: calories ? parseInt(calories) : undefined,
      category,
    });

    const savedSchedule = await scheduleItem.save();
    console.log("Schedule saved:", savedSchedule);

    return NextResponse.json(
      {
        message: "Schedule item created successfully",
        schedule: savedSchedule,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add schedule failed:", error);
    return NextResponse.json(
      { error: "Failed to create schedule item", details: error.message },
      { status: 500 }
    );
  }
}
