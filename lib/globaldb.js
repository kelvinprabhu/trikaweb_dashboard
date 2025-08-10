import mongoose from "mongoose";

const Global_URI = process.env.GlobalDB_URI || process.env.MONGODB_URI;

if (!Global_URI) {
  console.warn("⚠️ GlobalDB_URI not set, using MONGODB_URI as fallback");
  if (!process.env.MONGODB_URI) {
    throw new Error("⚠️ Add GlobalDB_URI or MONGODB_URI to .env.local");
  }
}

let cached = global.globalMongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .createConnection(Global_URI, {
        bufferCommands: false,
      })
      .then((connection) => {
        console.log("✅ Global MongoDB Connected");
        return connection;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
