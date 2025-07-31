// pages/api/habit/add.js
import { connectDB } from "@/lib/mongodb";
// pages/api/habit/add.js
import Habit from "@/models/Habit";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();

  const { userEmail, name, description, icon, category } = req.body;

  try {
    const habit = await Habit.create({
      userEmail,
      name,
      description,
      icon,
      category,
    });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: "Failed to add habit" });
  }
}
