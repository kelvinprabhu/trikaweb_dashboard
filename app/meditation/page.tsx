"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MeditationContent } from "@/components/pages/meditation-content"

export default function Meditation() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("trika_user_email")
    if (storedEmail) setEmail(storedEmail)
  }, [])

  if (!email) return <div>Loading...</div>
  return (
    <DashboardLayout currentPage="Meditation">
      <MeditationContent email={email}/>
    </DashboardLayout>
  )
}
