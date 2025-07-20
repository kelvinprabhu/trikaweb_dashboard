"use client"

import { useState, useEffect } from "react"
import { AuthFlow } from "@/components/auth/auth-flow"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/pages/dashboard-content"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authToken = localStorage.getItem("trika_auth_token")
      const onboardingComplete = localStorage.getItem("trika_onboarding_complete")

      if (authToken && onboardingComplete) {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthFlow onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <DashboardLayout currentPage="Dashboard">
      <DashboardContent />
    </DashboardLayout>
  )
}
