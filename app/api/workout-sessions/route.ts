import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import WorkoutSession from '@/models/WorkoutSession'

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json()

    // Validate required fields
    if (!sessionData.userEmail || !sessionData.sessionType || !sessionData.exercises) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, sessionType, exercises' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Create new workout session using Mongoose model
    const workoutSession = new WorkoutSession({
      ...sessionData,
      startTime: sessionData.startTime || new Date(),
      endTime: sessionData.endTime || new Date()
    });

    // Save the workout session
    const savedSession = await workoutSession.save()

    return NextResponse.json({
      success: true,
      sessionId: savedSession._id,
      message: 'Workout session logged successfully',
      session: savedSession
    }, { status: 201 })

  } catch (error) {
    console.error('Error saving workout session:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save workout session',
        details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail parameter is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Get workout sessions for user using Mongoose model
    const [sessions, totalCount] = await Promise.all([
      WorkoutSession.find({ userEmail })
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WorkoutSession.countDocuments({ userEmail })
    ]);

    return NextResponse.json({
      success: true,
      sessions,
      totalCount,
      hasMore: skip + limit < totalCount
    })

  } catch (error) {
    console.error('Error fetching workout sessions:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch workout sessions',
        details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
      },
      { status: 500 }
    )
  }
}
