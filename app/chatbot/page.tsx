"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatbotContent } from "@/components/pages/chatbot-content"

export default function Chatbot() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("trika_user_email")
    if (storedEmail) setEmail(storedEmail)
  }, [])

  if (!email) return <div>Loading...</div>
  return (
    <DashboardLayout currentPage="AI Assistant">
      <ChatbotContent email={email} />
    </DashboardLayout>
  )
}
