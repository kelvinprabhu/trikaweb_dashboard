"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmationProps {
  title: string
  message: string
  itemName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmation({ title, message, itemName, onConfirm, onCancel }: DeleteConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      onConfirm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>

      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-medium">"{itemName}"</p>
        <p className="text-red-700 text-sm mt-1">This action cannot be undone.</p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  )
}
