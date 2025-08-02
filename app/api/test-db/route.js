// app/api/test-db/route.js
import { connectDB } from "@/lib/globaldb";

export async function GET() {
  try {
    await connectDB();

    return new Response(
      JSON.stringify({ success: true, message: "✅ Database connected!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "❌ DB connection failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
