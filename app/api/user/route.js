import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

// POST: Create User, GET: All Users
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newUser = await User.create(body);
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (err) {
    console.error("POST Error:", err);
    return new Response("Failed to create user", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET Error:", err);
    return new Response("Failed to fetch users", { status: 500 });
  }
}
