// app/api/test-db/route.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const testUser = await User.create({
      username: "kelvin_user",
      email: "kelvinnew@trika.ai",
      passwordHash: "dummyHash123",
      age: 25,
      weight: 70,
      height: 175,
      fitnessLevel: "beginner",
      preferences: {
        goal: "stamina and strength",
        workoutTime: "morning",
      },
    });

    return new Response(JSON.stringify(testUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ DB Error:", err);
    return new Response("DB error", { status: 500 });
  }
}
