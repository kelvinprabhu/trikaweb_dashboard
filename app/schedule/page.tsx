"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ScheduleContent } from "@/components/pages/schedule-content"

export default function Schedule() {
  return (
    <DashboardLayout currentPage="Schedule">
      <ScheduleContent />
    </DashboardLayout>
  )
}
