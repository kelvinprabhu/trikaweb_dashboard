"use client"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsContent } from "@/components/pages/settings-content"
export default function Settings() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("trika_user_email")
    if (storedEmail) setEmail(storedEmail)
  }, [])

  if (!email) return <div>Loading...</div>

  return (
    <DashboardLayout currentPage="Settings">
      <SettingsContent email={email} />
    </DashboardLayout>
  )
}
