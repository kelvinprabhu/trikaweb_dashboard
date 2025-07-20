"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoStep } from "./onboarding-steps/personal-info-step"
import { FitnessGoalsStep } from "./onboarding-steps/fitness-goals-step"
import { PreferencesStep } from "./onboarding-steps/preferences-step"
import { WelcomeStep } from "./onboarding-steps/welcome-step"

interface OnboardingFlowProps {
  userEmail: string
  onComplete: () => void
}

export type OnboardingData = {
  personalInfo: {
    age: string
    gender: string
    height: string
    weight: string
    activityLevel: string
  }
  fitnessGoals: {
    primaryGoal: string
    fitnessLevel: string
    workoutFrequency: string
    preferredWorkouts: string[]
  }
  preferences: {
    notifications: boolean
    dataSharing: boolean
    newsletter: boolean
    reminderTime: string
  }
}

const steps = [
  { id: 1, title: "Personal Info", description: "Tell us about yourself" },
  { id: 2, title: "Fitness Goals", description: "What do you want to achieve?" },
  { id: 3, title: "Preferences", description: "Customize your experience" },
  { id: 4, title: "Welcome", description: "You're all set!" },
]

export function OnboardingFlow({ userEmail, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      age: "",
      gender: "",
      height: "",
      weight: "",
      activityLevel: "",
    },
    fitnessGoals: {
      primaryGoal: "",
      fitnessLevel: "",
      workoutFrequency: "",
      preferredWorkouts: [],
    },
    preferences: {
      notifications: true,
      dataSharing: false,
      newsletter: true,
      reminderTime: "09:00",
    },
  })

  const updateOnboardingData = (section: keyof OnboardingData, data: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsLoading(true)
      // Simulate API call to save onboarding data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store onboarding data
      localStorage.setItem("trika_onboarding_data", JSON.stringify(onboardingData))

      setIsLoading(false)
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          onboardingData.personalInfo.age &&
          onboardingData.personalInfo.gender &&
          onboardingData.personalInfo.height &&
          onboardingData.personalInfo.weight &&
          onboardingData.personalInfo.activityLevel
        )
      case 2:
        return (
          onboardingData.fitnessGoals.primaryGoal &&
          onboardingData.fitnessGoals.fitnessLevel &&
          onboardingData.fitnessGoals.workoutFrequency
        )
      case 3:
        return true // Preferences are optional
      case 4:
        return true
      default:
        return false
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Let's personalize your experience</h1>
            <p className="text-gray-600">This will help us create the perfect fitness plan for you</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Step {currentStep} of {steps.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 lg:space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                        ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 lg:w-12 h-1 mx-2 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <PersonalInfoStep
                data={onboardingData.personalInfo}
                onUpdate={(data) => updateOnboardingData("personalInfo", data)}
              />
            )}
            {currentStep === 2 && (
              <FitnessGoalsStep
                data={onboardingData.fitnessGoals}
                onUpdate={(data) => updateOnboardingData("fitnessGoals", data)}
              />
            )}
            {currentStep === 3 && (
              <PreferencesStep
                data={onboardingData.preferences}
                onUpdate={(data) => updateOnboardingData("preferences", data)}
              />
            )}
            {currentStep === 4 && <WelcomeStep userEmail={userEmail} onboardingData={onboardingData} />}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up...
                  </>
                ) : currentStep === steps.length ? (
                  <>
                    Complete Setup
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
