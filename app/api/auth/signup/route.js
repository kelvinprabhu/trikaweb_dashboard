import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();
    const { firstName, lastName, email, password } = await req.json();

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    return NextResponse.json({
      success: true,
      user: { email: user.email, name: `${user.firstName} ${user.lastName}` },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error"  + err }, { status: 500 });
  }
}
