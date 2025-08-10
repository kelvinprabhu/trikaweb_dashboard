import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import type { MeditationSession, MeditationStats } from '@/lib/models/meditation-session'
import { calculateStats } from '@/lib/models/meditation-session'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const client = new MongoClient(uri)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail parameter is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await client.connect()
    const db = client.db('trika_fitness')
    const collection = db.collection('meditation_sessions')

    // Get all meditation sessions for the user
    const sessions = await collection
      .find({ userEmail })
      .sort({ startTime: -1 })
      .toArray() as MeditationSession[]

    // Calculate stats
    const stats = calculateStats(sessions)

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Error fetching meditation stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meditation stats' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json()
    
    // Validate required fields
    if (!sessionData.userEmail || !sessionData.sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, sessionId' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await client.connect()
    const db = client.db('trika_fitness')
    const collection = db.collection('meditation_sessions')

    // Update existing session or create new one
    const updateData = {
      ...sessionData,
      updatedAt: new Date()
    }

    if (sessionData._id) {
      delete updateData._id
    }

    const result = await collection.updateOne(
      { sessionId: sessionData.sessionId, userEmail: sessionData.userEmail },
      { 
        $set: updateData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Meditation session updated successfully',
      upsertedId: result.upsertedId,
      modifiedCount: result.modifiedCount
    })

  } catch (error) {
    console.error('Error updating meditation session:', error)
    return NextResponse.json(
      { error: 'Failed to update meditation session' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
