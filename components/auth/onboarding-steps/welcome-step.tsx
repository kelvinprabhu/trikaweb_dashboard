"use client"

import { CheckCircle, Target, Brain, Activity, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { OnboardingData } from "../onboarding-flow"

interface WelcomeStepProps {
  userEmail: string
  onboardingData: OnboardingData
}

export function WelcomeStep({ userEmail, onboardingData }: WelcomeStepProps) {
  const userName = localStorage.getItem("trika_user_name") || "there"

  const getPersonalizedMessage = () => {
    const goal = onboardingData.fitnessGoals.primaryGoal
    switch (goal) {
      case "lose-weight":
        return "We'll help you burn calories and reach your weight goals with personalized workouts and nutrition guidance."
      case "build-muscle":
        return "Get ready to build strength and muscle mass with our AI-powered training programs."
      case "improve-endurance":
        return "We'll boost your cardiovascular fitness with tailored endurance training plans."
      default:
        return "We'll help you maintain a healthy and active lifestyle with personalized recommendations."
    }
  }

  const features = [
    {
      icon: Target,
      title: "Personalized Workouts",
      description: "AI-generated routines based on your goals and fitness level",
    },
    {
      icon: Brain,
      title: "Smart Coaching",
      description: "Real-time guidance and form corrections during workouts",
    },
    {
      icon: Activity,
      title: "Progress Tracking",
      description: "Detailed analytics and insights into your fitness journey",
    },
    {
      icon: Heart,
      title: "Wellness Integration",
      description: "Meditation, sleep tracking, and holistic health monitoring",
    },
  ]

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Trika.ai, {userName.split(" ")[0]}! 🎉</h2>
          <p className="text-gray-600 max-w-md mx-auto">{getPersonalizedMessage()}</p>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-red-50 to-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Your Personalized Plan</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-left">
            <span className="text-gray-600">Goal:</span>
            <Badge variant="secondary" className="ml-2">
              {onboardingData.fitnessGoals.primaryGoal.replace("-", " ")}
            </Badge>
          </div>
          <div className="text-left">
            <span className="text-gray-600">Level:</span>
            <Badge variant="secondary" className="ml-2">
              {onboardingData.fitnessGoals.fitnessLevel}
            </Badge>
          </div>
          <div className="text-left">
            <span className="text-gray-600">Frequency:</span>
            <Badge variant="secondary" className="ml-2">
              {onboardingData.fitnessGoals.workoutFrequency}/week
            </Badge>
          </div>
          <div className="text-left">
            <span className="text-gray-600">Workouts:</span>
            <Badge variant="secondary" className="ml-2">
              {onboardingData.fitnessGoals.preferredWorkouts.length} types
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">What's waiting for you:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg text-left">
              <feature.icon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 text-sm">
          🚀 Your AI fitness coach is ready! Let's start your transformation journey.
        </p>
      </div>
    </div>
  )
}
