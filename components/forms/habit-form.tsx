"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface HabitFormProps {
  habit?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

const categories = [
  { value: "fitness", label: "Fitness", icon: "💪" },
  { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
  { value: "nutrition", label: "Nutrition", icon: "🥗" },
  { value: "recovery", label: "Recovery", icon: "😴" },
  { value: "activity", label: "Activity", icon: "👟" },
  { value: "wellness", label: "Wellness", icon: "💧" },
]

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom Days" },
]

const weekDays = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
]

export function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const [formData, setFormData] = useState({
    name: habit?.name || "",
    description: habit?.description || "",
    category: habit?.category || "",
    icon: habit?.icon || "",
    frequency: habit?.frequency || "daily",
    target: habit?.target || 1,
    unit: habit?.unit || "times",
    reminderTime: habit?.reminderTime || "09:00",
    customDays: habit?.customDays || [],
    isActive: habit?.isActive ?? true,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDayToggle = (day: string, checked: boolean) => {
    const updatedDays = checked ? [...formData.customDays, day] : formData.customDays.filter((d) => d !== day)

    setFormData({ ...formData, customDays: updatedDays })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Habit Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Morning Workout"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <span className="flex items-center gap-2">
                    {cat.icon} {cat.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your habit..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            placeholder="e.g., 💪"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target">Target</Label>
          <Input
            id="target"
            type="number"
            min="1"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: Number.parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label>Unit</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="times">times</SelectItem>
              <SelectItem value="minutes">minutes</SelectItem>
              <SelectItem value="hours">hours</SelectItem>
              <SelectItem value="glasses">glasses</SelectItem>
              <SelectItem value="pages">pages</SelectItem>
              <SelectItem value="steps">steps</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Frequency *</Label>
        <RadioGroup
          value={formData.frequency}
          onValueChange={(value) => setFormData({ ...formData, frequency: value })}
        >
          {frequencies.map((freq) => (
            <div key={freq.value} className="flex items-center space-x-2">
              <RadioGroupItem value={freq.value} id={freq.value} />
              <Label htmlFor={freq.value}>{freq.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {formData.frequency === "custom" && (
        <div className="space-y-3">
          <Label>Select Days</Label>
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={day.value}
                  checked={formData.customDays.includes(day.value)}
                  onCheckedChange={(checked) => handleDayToggle(day.value, checked as boolean)}
                />
                <Label htmlFor={day.value} className="text-sm">
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="reminderTime">Reminder Time</Label>
        <Input
          id="reminderTime"
          type="time"
          value={formData.reminderTime}
          onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
        />
        <Label htmlFor="isActive">Active habit</Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.name || !formData.category}
          className="flex-1 bg-gradient-to-r from-red-500 to-blue-500"
        >
          {isLoading ? "Saving..." : habit ? "Update Habit" : "Create Habit"}
        </Button>
      </div>
    </form>
  )
}
