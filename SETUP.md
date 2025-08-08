# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection String
# Replace with your actual MongoDB URI
MONGODB_URI=mongodb://localhost:27017/trikafitness

# Example for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trikafitness?retryWrites=true&w=majority

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WebSocket URL (if using external WebSocket server)
NEXT_PUBLIC_WEB_SOCKET_URL=ws://127.0.0.1:8000/ws/posture/
```

## MongoDB Setup

1. **Local MongoDB**: Install MongoDB locally and start the service
2. **MongoDB Atlas**: Create a free cluster at https://cloud.mongodb.com
3. **Connection String**: Replace the MONGODB_URI with your actual connection string

## Testing the Connection

After setting up the environment variables, restart your development server:

```bash
npm run dev
```

The API should now work properly for adding habits.
