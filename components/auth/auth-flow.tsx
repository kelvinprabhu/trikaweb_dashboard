"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { OnboardingFlow } from "./onboarding-flow"

type AuthStep = "login" | "signup" | "onboarding"

interface AuthFlowProps {
  onAuthSuccess?: () => void
}

export function AuthFlow({ onAuthSuccess = () => {} }: AuthFlowProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("login")
  const [userEmail, setUserEmail] = useState("")

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    // Check if user needs onboarding
    const onboardingComplete = localStorage.getItem("trika_onboarding_complete")
    if (onboardingComplete) {
      onAuthSuccess()
    } else {
      setCurrentStep("onboarding")
    }
  }

  const handleSignupSuccess = (email: string) => {
    setUserEmail(email)
    setCurrentStep("onboarding")
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("trika_onboarding_complete", "true")
    onAuthSuccess()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-cyan-50">
      {currentStep === "login" && (
        <LoginForm onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setCurrentStep("signup")} />
      )}
      {currentStep === "signup" && (
        <SignupForm onSignupSuccess={handleSignupSuccess} onSwitchToLogin={() => setCurrentStep("login")} />
      )}
      {currentStep === "onboarding" && <OnboardingFlow userEmail={userEmail} onComplete={handleOnboardingComplete} />}
    </div>
  )
}
