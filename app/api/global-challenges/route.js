import { NextResponse } from "next/server";
import globalChallengesData from "@/data/global-challenges.json";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const workoutType = searchParams.get("workoutType");

    let challenges = globalChallengesData.challenges;

    // Filter by difficulty if provided
    if (difficulty) {
      challenges = challenges.filter(
        (challenge) => challenge.difficulty === difficulty
      );
    }

    // Filter by workout type if provided
    if (workoutType) {
      challenges = challenges.filter(
        (challenge) => challenge.workoutType === workoutType
      );
    }

    // Sort by creation date (newest first)
    challenges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching global challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch global challenges" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // For demo purposes, we'll just return a success message
    // In a real implementation, you might want to save to a database
    return NextResponse.json(
      { message: "Global challenges are read-only from static data" },
      { status: 405 }
    );
  } catch (error) {
    console.error("Error creating global challenge:", error);
    return NextResponse.json(
      { error: "Failed to create global challenge" },
      { status: 500 }
    );
  }
}
