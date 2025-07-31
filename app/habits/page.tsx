"use client"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { HabitsContent } from "@/components/pages/habits-content"



export default function Habits() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("trika_user_email")
    if (storedEmail) setEmail(storedEmail)
  }, [])

  if (!email) return <div>Loading...</div>
  
  return (
    <DashboardLayout currentPage="Habits">
      <HabitsContent email={email} />
    </DashboardLayout>
  )
}
