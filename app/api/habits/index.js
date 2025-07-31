// pages/api/habit/index.js
import { connectDB } from "@/lib/mongodb";
import Habit from "@/models/Habit";

export default async function handler(req, res) {
  await connectDB();
  const { email } = req.query;

  try {
    const habits = await Habit.find({ userEmail: email });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
}
