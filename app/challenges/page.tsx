"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ChallengesContent } from "@/components/pages/challenges-content"

export default function Challenges() {
  return (
    <DashboardLayout currentPage="Challenges">
      <ChallengesContent />
    </DashboardLayout>
  )
}
