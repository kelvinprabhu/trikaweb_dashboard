// import { NextRequest, NextResponse } from 'next/server'
// import { connectDB } from "@/lib/mongodb"
// import CustomMeditationSession from "@/models/CustomMeditationSession"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()

//     console.log('Adding custom meditation session to database:', body.sessionId)

//     // Validate required fields
//     if (!body.userEmail || !body.sessionId || !body.sessionName) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Missing required fields: userEmail, sessionId, sessionName'
//         },
//         { status: 400 }
//       )
//     }

//     // Connect to MongoDB
//     await connectDB()
//     console.log('Connected to MongoDB successfully')

//     // Create custom meditation session entry using the proper model
//     const sessionData = {
//       userEmail: body.userEmail,
//       currentMood: body.currentMood,
//       energyLevel: Array.isArray(body.energyLevel) ? body.energyLevel[0] : body.energyLevel,
//       stressLevel: Array.isArray(body.stressLevel) ? body.stressLevel[0] : body.stressLevel,
//       selectedGoals: body.selectedGoals,
//       duration: Array.isArray(body.duration) ? body.duration[0] : body.duration,
//       binauralFrequency: body.binauralFrequency,
//       ambientSounds: body.ambientSounds,
//       volume: Array.isArray(body.volume) ? body.volume[0] : body.volume,
//       includeGuidance: body.includeGuidance,
//       includeBreathing: body.includeBreathing,
//       personalIntention: body.personalIntention,
//       reminderTime: body.reminderTime,
//       sessionName: body.sessionName,
//       generatedAt: body.generatedAt ? new Date(body.generatedAt) : new Date(),
//       moodData: body.moodData,
//       frequencyData: body.frequencyData,
//       estimatedEffectiveness: body.estimatedEffectiveness,
//       sessionId: body.sessionId,
//       audio_path: body.audio_path || body.audioPath || null
//     }

//     console.log('Creating custom meditation session with data:', JSON.stringify(sessionData, null, 2))

//     // Create and save the custom meditation session
//     const result = await CustomMeditationSession.create(sessionData)

//     console.log('Custom meditation session saved successfully:', result._id)

//     return NextResponse.json({
//       success: true,
//       message: 'Custom meditation session added successfully',
//       session: result,
//       sessionId: result.sessionId,
//       _id: result._id
//     })

//   } catch (error) {
//     console.error('Error adding custom meditation session:', error)
//     console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
//     return NextResponse.json(
//       {
//         success: false,
//         error: `Failed to add custom meditation session: ${error instanceof Error ? error.message : 'Unknown error'}`
//       },
//       { status: 500 }
//     )
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const userEmail = searchParams.get('userEmail')

//     if (!userEmail) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'userEmail parameter is required'
//         },
//         { status: 400 }
//       )
//     }

//     console.log('Fetching custom meditation sessions for user:', userEmail)

//     await connectDB()

//     const sessions = await CustomMeditationSession.find({
//       userEmail: userEmail
//     })
//       .sort({ createdAt: -1 })
//       .lean()

//     console.log(`Found ${sessions.length} custom sessions for user`)

//     return NextResponse.json({
//       success: true,
//       sessions,
//       count: sessions.length
//     })

//   } catch (error) {
//     console.error('Error fetching custom meditation sessions:', error)
//     console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
//     return NextResponse.json(
//       {
//         success: false,
//         error: `Failed to fetch custom meditation sessions: ${error instanceof Error ? error.message : 'Unknown error'}`
//       },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { sessionId, userEmail, ...updateData } = body

//     if (!sessionId || !userEmail) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: 'sessionId and userEmail are required' 
//         },
//         { status: 400 }
//       )
//     }

//     console.log('Updating custom meditation session:', sessionId)

//     await connectDB()

//     const result = await CustomMeditationSession.updateOne(
//       { sessionId, userEmail },
//       { 
//         $set: { 
//           ...updateData, 
//           updatedAt: new Date() 
//         } 
//       }
//     )

//     if (result.matchedCount === 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: 'Session not found' 
//         },
//         { status: 404 }
//       )
//     }

//     console.log('Custom meditation session updated successfully')

//     return NextResponse.json({
//       success: true,
//       message: 'Custom meditation session updated successfully',
//       modifiedCount: result.modifiedCount
//     })

//   } catch (error) {
//     console.error('Error updating custom meditation session:', error)
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: `Failed to update session: ${error instanceof Error ? error.message : 'Unknown error'}` 
//       },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const sessionId = searchParams.get('sessionId')
//     const userEmail = searchParams.get('userEmail')

//     if (!sessionId || !userEmail) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: 'sessionId and userEmail are required' 
//         },
//         { status: 400 }
//       )
//     }

//     console.log('Deleting custom meditation session:', sessionId)

//     await connectDB()

//     const result = await CustomMeditationSession.deleteOne({
//       sessionId,
//       userEmail
//     })

//     if (result.deletedCount === 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: 'Session not found' 
//         },
//         { status: 404 }
//       )
//     }

//     console.log('Custom meditation session deleted successfully')

//     return NextResponse.json({
//       success: true,
//       message: 'Custom meditation session deleted successfully',
//       deletedCount: result.deletedCount
//     })

//   } catch (error) {
//     console.error('Error deleting custom meditation session:', error)
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: `Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}` 
//       },
//       { status: 500 }
//     )
//   }
// }
