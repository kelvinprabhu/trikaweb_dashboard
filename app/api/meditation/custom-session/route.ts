import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import type { CustomSessionRequest } from '@/models/meditation-session'
import { connectDB } from "@/lib/mongodb"
import MeditationLog from "@/models/MeditationLog"

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
    await connectDB()

    // Create meditation log entry for the custom session
    const meditationLogData = {
      userEmail: userEmail,
      sessionId: formData.sessionId,
      sessionTitle: formData.sessionName,
      sessionDuration: `${formData.duration} min`,
      actualDuration: formData.duration * 60, // Convert to seconds
      completionPercentage: 0, // Will be updated when session is completed
      isCompleted: false,
      sessionType: 'meditation',
      category: 'custom',
      mood: {
        before: formData.currentMood || 7
      },
      notes: formData.personalIntention || '',
      pauseCount: 0,
      volume: formData.volume || 50,
      backgroundSound: formData.ambientSounds,
      sessionDate: new Date(),
      customData: {
        energyLevel: formData.energyLevel,
        stressLevel: formData.stressLevel,
        selectedGoals: formData.selectedGoals,
        binauralFrequency: formData.binauralFrequency,
        includeGuidance: formData.includeGuidance,
        includeBreathing: formData.includeBreathing,
        moodData: formData.moodData,
        frequencyData: formData.frequencyData,
        estimatedEffectiveness: formData.estimatedEffectiveness,
        audioPath: filePath,
        audioUrl: audioUrl,
        generatedAt: new Date(formData.generatedAt)
      }
    }

    const meditationLog = new MeditationLog(meditationLogData)
    const result = await meditationLog.save()

    return NextResponse.json({
      success: true,
      sessionId: result._id,
      audioUrl,
      session: result,
      message: 'Custom meditation session generated and saved successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error generating custom meditation session:', error)
    return NextResponse.json(
      { error: 'Failed to generate custom meditation session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')
    const sessionId = searchParams.get('sessionId')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail parameter is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    let query: any = { userEmail, category: 'custom' }
    if (sessionId) {
      query.sessionId = sessionId
    }

    const sessions = await MeditationLog.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      sessions,
      count: sessions.length
    })

  } catch (error) {
    console.error('Error fetching custom meditation sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch custom meditation sessions' },
      { status: 500 }
    )
  }
}
