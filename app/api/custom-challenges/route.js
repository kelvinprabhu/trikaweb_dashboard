import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomChallenge from "@/models/CustomChallenge";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { error: "userEmail is required" },
        { status: 400 }
      );
    }

    const challenges = await CustomChallenge.find({ userEmail })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching custom challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom challenges" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Check if this is a request to generate AI challenge
    if (body.generateAIChallenge && body.userEmail) {
      try {
        // Call the AI challenge generation API
        const aiResponse = await fetch('http://127.0.0.1:8000/trikabot/generate-challenge/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: body.userEmail
          })
        });

        if (!aiResponse.ok) {
          throw new Error(`AI API responded with status: ${aiResponse.status}`);
        }

        const aiChallenges = await aiResponse.json();
        
        // Save the first challenge to database
        if (aiChallenges && aiChallenges.length > 0) {
          const aiChallenge = aiChallenges[0];
          
          // Map AI response to our schema
          const challengeData = {
            userEmail: aiChallenge.userEmail,
            title: aiChallenge.title,
            description: aiChallenge.description,
            category: aiChallenge.category, // "TrikaVision" or "Regular"
            type: aiChallenge.type,
            fitnessLevel: aiChallenge.fitnessLevel,
            difficulty: aiChallenge.fitnessLevel, // Map fitnessLevel to difficulty
            goalTags: aiChallenge.goalTags || [],
            workout: aiChallenge.workout,
            exercises: aiChallenge.exercises || [],
            aiRecommendationReason: aiChallenge.aiRecommendationReason,
            status: aiChallenge.status || "active",
            durationDays: 7, // Default duration, can be adjusted
            badge: "🤖", // AI-generated challenge badge
            color: aiChallenge.category === "TrikaVision" ? "from-purple-500 to-pink-500" : "from-green-500 to-blue-500"
          };

          const challenge = new CustomChallenge(challengeData);
          await challenge.save();

          return NextResponse.json({ 
            challenge, 
            message: "AI challenge generated and saved successfully" 
          }, { status: 201 });
        } else {
          return NextResponse.json(
            { error: "No challenges returned from AI API" },
            { status: 400 }
          );
        }
      } catch (aiError) {
        console.error("Error calling AI challenge API:", aiError);
        return NextResponse.json(
          { error: "Failed to generate AI challenge", details: aiError.message },
          { status: 500 }
        );
      }
    } else {
      // Regular challenge creation
      const challenge = new CustomChallenge(body);
      await challenge.save();

      return NextResponse.json({ challenge }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating custom challenge:", error);
    return NextResponse.json(
      { error: "Failed to create custom challenge" },
      { status: 500 }
    );
  }
}


