"use client"

import { useState, useEffect } from "react"
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
  const [loading, setLoading] = useState(false)

  const checkOnboardingStatus = async (email: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/user/status?email=${encodeURIComponent(email)}`)
      const data = await res.json()

      if (data.onboardingCompleted) {
        localStorage.setItem("trika_onboarding_complete", "true") // Optional caching
        onAuthSuccess()
      } else {
        setCurrentStep("onboarding")
      }
    } catch (err) {
      console.error("Failed to check onboarding status:", err)
      setCurrentStep("onboarding")
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    checkOnboardingStatus(email)
  }

  const handleSignupSuccess = (email: string) => {
    setUserEmail(email)
    setCurrentStep("onboarding")
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("trika_onboarding_complete", "true")
    onAuthSuccess()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg">Checking your setup...</div>
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
