import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  const body = await req.json();
  await connectDB();
  const user = await User.create(body);
  return new Response(JSON.stringify(user), { status: 201 });
}
