"use client"
import {useEffect,useState} from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChallengesContent } from "@/components/pages/challenges-content"

export default function Challenges() {
    const [email, setEmail] = useState("")
  
    useEffect(() => {
      const storedEmail = localStorage.getItem("trika_user_email")
      if (storedEmail) setEmail(storedEmail)
    }, [])
  return (
    <DashboardLayout currentPage="Challenges">
      <ChallengesContent email={email}/>
    </DashboardLayout>
  )
}
