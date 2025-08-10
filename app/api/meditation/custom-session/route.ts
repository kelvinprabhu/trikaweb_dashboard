import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import type { CustomSessionRequest, MeditationSession } from '@/lib/models/meditation-session'
import { connectDB } from "@/lib/mongodb";
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const client = new MongoClient(uri)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const formData: CustomSessionRequest = body

    // Extract user email from request body
    const userEmail = body.userEmail || body.email

    // Validate required fields
    if (!formData.sessionId || !formData.sessionName || !formData.duration || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, sessionName, duration, userEmail' },
        { status: 400 }
      )
    }

    console.log('Generating custom meditation session:', formData.sessionId)

    // Call external meditation generation API
    const response = await fetch('http://127.0.0.1:8000/meditation/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    if (!response.ok) {
      throw new Error(`External API error: ${response.status} ${response.statusText}`)
    }

    // Get the MP3 file as buffer
    const audioBuffer = await response.arrayBuffer()

    // Create directory if it doesn't exist
    const mediaDir = join(process.cwd(), 'public', 'media', 'meditation', 'generated')
    if (!existsSync(mediaDir)) {
      await mkdir(mediaDir, { recursive: true })
    }

    // Save the MP3 file
    const fileName = `${formData.sessionId}.mp3`
    const filePath = join(mediaDir, fileName)
    await writeFile(filePath, Buffer.from(audioBuffer))

    // Create audio URL
    const audioUrl = `/media/meditation/generated/${fileName}`

    // Connect to MongoDB and save session data
    await client.connect()
    const db = client.db('TrikaDB')
    const collection = db.collection('meditation_sessions')

    const meditationSession: MeditationSession = {
      userEmail: userEmail,
      sessionId: formData.sessionId,
      sessionName: formData.sessionName,
      sessionType: 'custom',
      duration: formData.duration,
      category: 'custom',
      customData: {
        currentMood: formData.currentMood,
        energyLevel: formData.energyLevel,
        stressLevel: formData.stressLevel,
        selectedGoals: formData.selectedGoals,
        binauralFrequency: formData.binauralFrequency,
        ambientSounds: formData.ambientSounds,
        includeGuidance: formData.includeGuidance,
        includeBreathing: formData.includeBreathing,
        personalIntention: formData.personalIntention,
        moodData: formData.moodData,
        frequencyData: formData.frequencyData,
        estimatedEffectiveness: formData.estimatedEffectiveness
      },
      startTime: new Date(),
      completed: false,
      audioPath: filePath,
      audioUrl: audioUrl,
      mood: {
        before: 7 // Default, should be collected from user
      },
      pauseCount: 0,
      volume: formData.volume,
      createdAt: new Date(),
      updatedAt: new Date(),
      generatedAt: new Date(formData.generatedAt)
    }

    const result = await collection.insertOne(meditationSession)

    return NextResponse.json({
      success: true,
      sessionId: formData.sessionId,
      audioUrl: audioUrl,
      audioPath: filePath,
      message: 'Custom meditation session created successfully',
      dbId: result.insertedId
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating custom meditation session:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('External API error')) {
        return NextResponse.json(
          { error: 'Failed to generate meditation audio. Please try again.' },
          { status: 502 }
        )
      }
      if (error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { error: 'Meditation generation service is unavailable. Please try again later.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create custom meditation session' },
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
    const sessionType = searchParams.get('sessionType')
    const limit = parseInt(searchParams.get('limit') || '10')

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

    // Build query
    const query: any = { userEmail }
    if (sessionType) {
      query.sessionType = sessionType
    }

    // Get meditation sessions
    const sessions = await collection
      .find(query)
      .sort({ startTime: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      sessions
    })

  } catch (error) {
    console.error('Error fetching meditation sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meditation sessions' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
