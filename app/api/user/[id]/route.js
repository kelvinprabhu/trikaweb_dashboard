import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function GET(_, { params }) {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) return new Response("User not found", { status: 404 });
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    return new Response("Error fetching user", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedUser = await User.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    return new Response("Error updating user", { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    await User.findByIdAndDelete(params.id);
    return new Response("User deleted", { status: 204 });
  } catch (err) {
    return new Response("Error deleting user", { status: 500 });
  }
}
