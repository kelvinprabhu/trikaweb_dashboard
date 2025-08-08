"use client"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ScheduleContent } from "@/components/pages/schedule-content"

export default function Schedule() {
  const [email, setEmail] = useState("")

useEffect(() => {
  const storedEmail = localStorage.getItem("trika_user_email")
  if (storedEmail) setEmail(storedEmail)
}, [])

 if (!email) return <div>Loading...</div>
  return (
    <DashboardLayout currentPage="Schedule">
      <ScheduleContent email={email} />
    </DashboardLayout>
  )
}
