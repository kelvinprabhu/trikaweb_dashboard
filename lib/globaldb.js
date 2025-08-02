import mongoose from "mongoose";

const Global_URI = process.env.GlobalDB_URI;

if (!Global_URI) throw new Error("⚠️ Add Global_URI to .env.local");

let cached = global.mongoose || { conn: null, promise: null };
mongoose.set("debug", true);

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(Global_URI, {
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
