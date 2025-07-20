"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { HabitsContent } from "@/components/pages/habits-content"

export default function Habits() {
  return (
    <DashboardLayout currentPage="Habits">
      <HabitsContent />
    </DashboardLayout>
  )
}
