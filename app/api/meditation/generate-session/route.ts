import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// import MeditationSession from '@/models/MeditationSession';

const GENERATED_DIR = path.join(process.cwd(), 'public', 'media', 'meditation', 'generated');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userEmail = body.userEmail;
    if (!userEmail) {
      return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 });
    }

    // Forward request to external API
    const externalRes = await fetch('http://127.0.0.1:8000/meditation/generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!externalRes.ok) {
      return NextResponse.json({ error: 'External API error' }, { status: 502 });
    }

  // Get audio file (assume response is audio/mp3)
  const arrayBuffer = await externalRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `meditation_${uuidv4()}.mp3`;
  const filePath = path.join(GENERATED_DIR, filename);

  // Ensure directory exists
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  fs.writeFileSync(filePath, buffer);

    // Save session data to MongoDB
    await connectDB();
    const sessionData = {
      ...body,
      userEmail,
      audioPath: `/media/meditation/generated/${filename}`,
      createdAt: new Date(),
    };
    // await MeditationSession.create(sessionData);

    return NextResponse.json({ success: true, session: sessionData });
  } catch (error) {
    console.error('Error generating meditation session:', error);
    return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 });
  }
}
