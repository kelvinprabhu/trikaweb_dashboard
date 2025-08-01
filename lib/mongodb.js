import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("⚠️ Add MONGODB_URI to .env.local");

let cached = global.mongoose || { conn: null, promise: null };
mongoose.set("debug", true);

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
