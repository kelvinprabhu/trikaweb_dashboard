"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatbotContent } from "@/components/pages/chatbot-content"

export default function Chatbot() {
  return (
    <DashboardLayout currentPage="AI Assistant">
      <ChatbotContent />
    </DashboardLayout>
  )
}
