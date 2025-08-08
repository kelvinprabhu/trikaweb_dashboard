import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";

export async function PUT(req, { params }) {
  try {
    console.log("Update schedule status API called with params:", params);
    await connectDB();

    const { id } = params;
    const body = await req.json();
    console.log("Status update request body:", body);

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    if (!["upcoming", "active", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update schedule status
    const updateData = { status, updatedAt: new Date() };

    if (status === "completed") {
      updateData.completedAt = new Date();
    } else if (status === "cancelled") {
      updateData.cancelledAt = new Date();
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedSchedule) {
      return NextResponse.json(
        { error: "Schedule item not found" },
        { status: 404 }
      );
    }

    console.log("Schedule status updated:", updatedSchedule);

    return NextResponse.json(
      {
        message: "Schedule status updated successfully",
        schedule: updatedSchedule,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update schedule status failed:", error);
    return NextResponse.json(
      { error: "Failed to update schedule status", details: error.message },
      { status: 500 }
    );
  }
}
