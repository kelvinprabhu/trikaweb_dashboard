import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const client = new MongoClient(uri)

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
    await client.connect()
    const db = client.db('TrikaDB')
    const collection = db.collection('workout_sessions')

    // Add server timestamp
    const workoutSession = {
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert the workout session
    const result = await collection.insertOne(workoutSession)

    return NextResponse.json({
      success: true,
      sessionId: result.insertedId,
      message: 'Workout session logged successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error saving workout session:', error)
    return NextResponse.json(
      { error: 'Failed to save workout session' },
      { status: 500 }
    )
  } finally {
    await client.close()
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
    await client.connect()
    const db = client.db('trika_fitness')
    const collection = db.collection('workout_sessions')

    // Get workout sessions for user
    const sessions = await collection
      .find({ userEmail })
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count
    const totalCount = await collection.countDocuments({ userEmail })

    return NextResponse.json({
      success: true,
      sessions,
      totalCount,
      hasMore: skip + limit < totalCount
    })

  } catch (error) {
    console.error('Error fetching workout sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workout sessions' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
