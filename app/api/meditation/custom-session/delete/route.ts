import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { connectDB } from '@/lib/mongodb'
import MeditationLog from '@/models/MeditationLog'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const userEmail = searchParams.get('userEmail')

    if (!sessionId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters: sessionId, userEmail' },
        { status: 400 }
      )
    }

    console.log('Deleting custom meditation session:', sessionId)

    // Connect to MongoDB
    await connectDB()

    // Find the session to get the audio file path
    const session = await MeditationLog.findOne({
      sessionId,
      userEmail,
      category: 'custom'
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Delete the audio file if it exists (from customData)
    if (session.customData?.audioPath && existsSync(session.customData.audioPath)) {
      try {
        await unlink(session.customData.audioPath)
        console.log('Deleted audio file:', session.customData.audioPath)
      } catch (fileError) {
        console.warn('Failed to delete audio file:', fileError)
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the session from database
    const result = await MeditationLog.deleteOne({
      sessionId,
      userEmail,
      category: 'custom'
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete session from database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Custom meditation session deleted successfully',
      sessionId
    })

  } catch (error) {
    console.error('Error deleting custom meditation session:', error)
    return NextResponse.json(
      { error: 'Failed to delete custom meditation session' },
      { status: 500 }
    )
  }
}
