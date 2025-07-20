"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MeditationContent } from "@/components/pages/meditation-content"

export default function Meditation() {
  return (
    <DashboardLayout currentPage="Meditation">
      <MeditationContent />
    </DashboardLayout>
  )
}
