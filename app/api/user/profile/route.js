import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Construct response from DB
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.personalInfo?.gender || "",
      height: user.personalInfo?.height || "",
      weight: user.personalInfo?.weight || "",
      fitnessLevel: user.fitnessGoals?.fitnessLevel || "",
      goal: user.fitnessGoals?.primaryGoal || "",
      activityLevel: user.personalInfo?.activityLevel || "",
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
