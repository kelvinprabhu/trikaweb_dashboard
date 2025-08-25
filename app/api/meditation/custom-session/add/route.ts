import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomMeditationSession from "@/models/CustomMeditationSession";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    let sessionData;
    try {
      sessionData = await request.json();
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Validate required fields
    if (!sessionData.userEmail || !sessionData.sessionId) {
      return NextResponse.json({ 
        error: "Missing required fields: userEmail, sessionId" 
      }, { status: 400 });
    }

    console.log("Received session data:", sessionData);

    // Prepare data for external API
    const apiPayload = {
      currentMood: sessionData.currentMood,
      energyLevel: Array.isArray(sessionData.energyLevel) ? sessionData.energyLevel[0] : sessionData.energyLevel,
      stressLevel: Array.isArray(sessionData.stressLevel) ? sessionData.stressLevel[0] : sessionData.stressLevel,
      selectedGoals: sessionData.selectedGoals,
      duration: Array.isArray(sessionData.duration) ? sessionData.duration[0] : sessionData.duration,
      binauralFrequency: sessionData.binauralFrequency,
      ambientSounds: sessionData.ambientSounds,
      volume: Array.isArray(sessionData.volume) ? sessionData.volume[0] : sessionData.volume,
      includeGuidance: sessionData.includeGuidance,
      includeBreathing: sessionData.includeBreathing,
      personalIntention: sessionData.personalIntention,
      reminderTime: sessionData.reminderTime,
      sessionName: sessionData.sessionName,
      generatedAt: sessionData.generatedAt,
      moodData: sessionData.moodData,
      frequencyData: sessionData.frequencyData,
      estimatedEffectiveness: sessionData.estimatedEffectiveness,
      sessionId: sessionData.sessionId
    };

    console.log("Calling external API with payload:", apiPayload);

    // Call external meditation generation API
    const externalApiResponse = await fetch('http://127.0.0.1:8000/meditation/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiPayload)
    });

    if (!externalApiResponse.ok) {
      const errorText = await externalApiResponse.text();
      console.error("External API error:", errorText);
      return NextResponse.json({ 
        error: "Failed to generate meditation audio", 
        details: errorText 
      }, { status: 500 });
    }

    // Get the audio file as buffer
    const audioBuffer = await externalApiResponse.arrayBuffer();
    
    // Ensure the directory exists
    const audioDir = path.join(process.cwd(), 'public', 'media', 'meditation', 'generated');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `meditation_${sessionData.sessionId}_${timestamp}.mp3`;
    const audioPath = path.join(audioDir, filename);
    const publicAudioPath = `/media/meditation/generated/${filename}`;

    // Save audio file
    fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
    console.log("Audio file saved to:", audioPath);

    // Connect to database
    await connectDB();

    // Prepare complete session data for database
    const completeSessionData = {
      userEmail: sessionData.userEmail,
      currentMood: sessionData.currentMood,
      energyLevel: Array.isArray(sessionData.energyLevel) ? sessionData.energyLevel[0] : sessionData.energyLevel,
      stressLevel: Array.isArray(sessionData.stressLevel) ? sessionData.stressLevel[0] : sessionData.stressLevel,
      selectedGoals: sessionData.selectedGoals,
      duration: Array.isArray(sessionData.duration) ? sessionData.duration[0] : sessionData.duration,
      binauralFrequency: sessionData.binauralFrequency,
      ambientSounds: sessionData.ambientSounds,
      volume: Array.isArray(sessionData.volume) ? sessionData.volume[0] : sessionData.volume,
      includeGuidance: sessionData.includeGuidance,
      includeBreathing: sessionData.includeBreathing,
      personalIntention: sessionData.personalIntention,
      reminderTime: sessionData.reminderTime,
      sessionName: sessionData.sessionName,
      generatedAt: new Date(sessionData.generatedAt),
      moodData: sessionData.moodData,
      frequencyData: sessionData.frequencyData,
      estimatedEffectiveness: sessionData.estimatedEffectiveness,
      sessionId: sessionData.sessionId,
      audio_path: publicAudioPath
    };

    // Create new custom meditation session in database
    const newSession = await CustomMeditationSession.create(completeSessionData);
    console.log("Session saved to database:", newSession._id);

    return NextResponse.json({ 
      success: true, 
      session: newSession,
      audio_path: publicAudioPath,
      message: "Custom meditation session generated and saved successfully"
    });

  } catch (error) {
    console.error("Error in custom meditation session creation:", error);
    return NextResponse.json({ 
      error: "Failed to create custom meditation session", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
