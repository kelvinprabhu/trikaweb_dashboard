// app/api/onboarding/update/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, onboardingData } = body;

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          personalInfo: onboardingData.personalInfo,
          fitnessGoals: onboardingData.fitnessGoals,
          preferences: onboardingData.preferences,
          onboardingCompleted: true,
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Onboarding update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
