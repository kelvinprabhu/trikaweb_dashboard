import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";

export async function PUT(req, { params }) {
  try {
    console.log("Update schedule API called with params:", params);
    await connectDB();

    const { id } = params;
    const body = await req.json();
    console.log("Update request body:", body);

    const {
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
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    // Update schedule item
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      {
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
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedSchedule) {
      return NextResponse.json(
        { error: "Schedule item not found" },
        { status: 404 }
      );
    }

    console.log("Schedule updated:", updatedSchedule);

    return NextResponse.json(
      {
        message: "Schedule item updated successfully",
        schedule: updatedSchedule,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update schedule failed:", error);
    return NextResponse.json(
      { error: "Failed to update schedule item", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    console.log("Delete schedule API called with params:", params);
    await connectDB();

    const { id } = params;

    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return NextResponse.json(
        { error: "Schedule item not found" },
        { status: 404 }
      );
    }

    console.log("Schedule deleted:", deletedSchedule);

    return NextResponse.json(
      { message: "Schedule item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete schedule failed:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule item", details: error.message },
      { status: 500 }
    );
  }
}
