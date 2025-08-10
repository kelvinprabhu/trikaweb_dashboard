import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Habit from "@/models/Habit";
import Schedule from "@/models/Schedule";
import CustomChallenge from "@/models/CustomChallenge";
import Conversation from "@/models/Conversation";
import Workout from "@/models/Workout";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      const response = NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return response;
    }

    // Fetch user basic information
    const user = await User.findOne({ email }).lean();
    if (!user) {
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return response;
    }

    // Fetch all user-related data in parallel for better performance
    const [
      habits,
      schedules,
      customChallenges,
      conversations,
      workouts
    ] = await Promise.all([
      // Fetch user habits
      Habit.find({ userEmail: email })
        .sort({ createdAt: -1 })
        .lean(),
      
      // Fetch user schedules
      Schedule.find({ userEmail: email })
        .sort({ date: -1 })
        .lean(),
      
      // Fetch user custom challenges
      CustomChallenge.find({ userEmail: email })
        .sort({ createdAt: -1 })
        .lean(),
      
      // Fetch user conversations
      Conversation.find({ userEmail: email })
        .sort({ updatedAt: -1 })
        .lean(),
      
      // Fetch user workouts
      Workout.find({ user: user._id })
        .sort({ date: -1 })
        .lean()
    ]);

    // Ensure arrays are not null/undefined
    const safeHabits = habits || [];
    const safeSchedules = schedules || [];
    const safeCustomChallenges = customChallenges || [];
    const safeConversations = conversations || [];
    const safeWorkouts = workouts || [];

    // Calculate user statistics
    const stats = {
      totalHabits: safeHabits.length,
      activeHabits: safeHabits.filter(h => h.isCompletedToday).length,
      totalStreak: safeHabits.reduce((sum, h) => sum + (h.streak || 0), 0),
      bestStreak: safeHabits.length > 0 ? Math.max(...safeHabits.map(h => h.bestStreak || 0)) : 0,
      
      totalSchedules: safeSchedules.length,
      upcomingSchedules: safeSchedules.filter(s => s.status === 'upcoming').length,
      completedSchedules: safeSchedules.filter(s => s.status === 'completed').length,
      
      totalCustomChallenges: safeCustomChallenges.length,
      activeChallenges: safeCustomChallenges.filter(c => c.isActive && !c.isCompleted).length,
      completedChallenges: safeCustomChallenges.filter(c => c.isCompleted).length,
      
      totalConversations: safeConversations.length,
      totalWorkouts: safeWorkouts.length,
      totalCaloriesBurned: safeWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      totalWorkoutDuration: safeWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) // in seconds
    };

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = {
      recentHabits: safeHabits.filter(h => 
        h.completionHistory && Array.isArray(h.completionHistory) && 
        h.completionHistory.some(c => new Date(c.date) >= sevenDaysAgo)
      ),
      recentSchedules: safeSchedules.filter(s => s.date && new Date(s.date) >= sevenDaysAgo),
      recentWorkouts: safeWorkouts.filter(w => w.date && new Date(w.date) >= sevenDaysAgo),
      recentConversations: safeConversations.filter(c => c.updatedAt && new Date(c.updatedAt) >= sevenDaysAgo)
    };

    // Comprehensive user information
    const completeUserInfo = {
      // Basic user information
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        personalInfo: user.personalInfo,
        fitnessGoals: user.fitnessGoals,
        preferences: user.preferences,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },

      // All related data
      habits: safeHabits,
      schedules: safeSchedules,
      customChallenges: safeCustomChallenges,
      conversations: safeConversations,
      workouts: safeWorkouts,

      // Statistics
      statistics: stats,

      // Recent activity
      recentActivity: recentActivity,

      // Summary counts
      summary: {
        dataLastUpdated: new Date().toISOString(),
        totalRecords: {
          habits: safeHabits.length,
          schedules: safeSchedules.length,
          customChallenges: safeCustomChallenges.length,
          conversations: safeConversations.length,
          workouts: safeWorkouts.length
        }
      }
    };

    const response = NextResponse.json({
      success: true,
      data: completeUserInfo
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error) {
    console.error("Error fetching complete user info:", error);
    const response = NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS(req) {
  const response = new NextResponse(null, { status: 200 });
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return response;
}
