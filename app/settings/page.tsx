"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsContent } from "@/components/pages/settings-content"

export default function Settings() {
  return (
    <DashboardLayout currentPage="Settings">
      <SettingsContent />
    </DashboardLayout>
  )
}
