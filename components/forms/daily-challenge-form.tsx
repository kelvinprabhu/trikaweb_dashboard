"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { X, Plus } from "lucide-react"

interface DailyChallengeFormProps {
  challenge?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

const challengeTypes = [
  { value: "exercise", label: "Exercise", icon: "💪" },
  { value: "nutrition", label: "Nutrition", icon: "🥗" },
  { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
  { value: "habit", label: "Habit", icon: "✅" },
  { value: "wellness", label: "Wellness", icon: "🌟" },
]

const difficultyLevels = [
  { value: "easy", label: "Easy", points: 5, color: "bg-green-500" },
  { value: "medium", label: "Medium", points: 10, color: "bg-yellow-500" },
  { value: "hard", label: "Hard", points: 15, color: "bg-red-500" },
]

export function DailyChallengeForm({ challenge, onSubmit, onCancel }: DailyChallengeFormProps) {
  const [formData, setFormData] = useState({
    title: challenge?.title || "",
    description: challenge?.description || "",
    type: challenge?.type || "",
    difficulty: challenge?.difficulty || "easy",
    targetValue: challenge?.targetValue || 1,
    targetUnit: challenge?.targetUnit || "",
    timeSlot: challenge?.timeSlot || "",
    instructions: challenge?.instructions || "",
    motivationalTip: challenge?.motivationalTip || "",
    tags: challenge?.tags || [],
    isRecurring: challenge?.isRecurring || false,
    reminderEnabled: challenge?.reminderEnabled || true,
    estimatedDuration: challenge?.estimatedDuration || [15],
  })

  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const selectedDifficulty = difficultyLevels.find((d) => d.value === formData.difficulty)
    const challengeData = {
      ...formData,
      points: selectedDifficulty?.points || 5,
      createdAt: new Date().toISOString(),
      status: "active",
    }

    try {
      await onSubmit(challengeData)
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const selectedType = challengeTypes.find((t) => t.value === formData.type)
  const selectedDifficulty = difficultyLevels.find((d) => d.value === formData.difficulty)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Challenge Type */}
      <div className="form-section">
        <Label className="text-base font-medium text-white">Challenge Type</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {challengeTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, type: type.value })}
              className={`p-3 border-2 rounded-lg transition-all text-center ${
                formData.type === type.value
                  ? "border-blue-500 bg-blue-500 bg-opacity-20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-800"
              }`}
            >
              <span className="text-2xl block mb-1">{type.icon}</span>
              <span className="text-sm text-white">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="form-section">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">
              Challenge Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., 30 Push-ups Challenge"
              className="dark-input"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the challenge..."
              className="dark-input"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Difficulty & Points */}
      <div className="form-section">
        <Label className="text-base font-medium text-white">Difficulty Level</Label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {difficultyLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData({ ...formData, difficulty: level.value })}
              className={`p-3 border-2 rounded-lg transition-all text-center ${
                formData.difficulty === level.value
                  ? "border-blue-500 bg-blue-500 bg-opacity-20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-800"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${level.color} mx-auto mb-2`}></div>
              <span className="text-sm font-medium text-white block">{level.label}</span>
              <span className="text-xs text-slate-400">{level.points} points</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target & Duration */}
      <div className="form-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetValue" className="text-white">
              Target Value
            </Label>
            <Input
              id="targetValue"
              type="number"
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: Number.parseInt(e.target.value) })}
              className="dark-input"
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="targetUnit" className="text-white">
              Unit
            </Label>
            <Select
              value={formData.targetUnit}
              onValueChange={(value) => setFormData({ ...formData, targetUnit: value })}
            >
              <SelectTrigger className="dark-input">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="dark-input">
                <SelectItem value="reps">Repetitions</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="steps">Steps</SelectItem>
                <SelectItem value="glasses">Glasses</SelectItem>
                <SelectItem value="servings">Servings</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="times">Times</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-white">Estimated Duration: {formData.estimatedDuration[0]} minutes</Label>
          <Slider
            value={formData.estimatedDuration}
            onValueChange={(value) => setFormData({ ...formData, estimatedDuration: value })}
            max={120}
            min={5}
            step={5}
            className="mt-2"
          />
        </div>
      </div>

      {/* Time Slot */}
      <div className="form-section">
        <Label htmlFor="timeSlot" className="text-white">
          Preferred Time Slot
        </Label>
        <Select value={formData.timeSlot} onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}>
          <SelectTrigger className="dark-input">
            <SelectValue placeholder="Select time slot" />
          </SelectTrigger>
          <SelectContent className="dark-input">
            <SelectItem value="morning">Morning (6:00 - 12:00)</SelectItem>
            <SelectItem value="afternoon">Afternoon (12:00 - 18:00)</SelectItem>
            <SelectItem value="evening">Evening (18:00 - 22:00)</SelectItem>
            <SelectItem value="anytime">Anytime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Instructions & Tips */}
      <div className="form-section">
        <div className="space-y-4">
          <div>
            <Label htmlFor="instructions" className="text-white">
              Instructions
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Step-by-step instructions for completing the challenge..."
              className="dark-input"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="motivationalTip" className="text-white">
              Motivational Tip
            </Label>
            <Textarea
              id="motivationalTip"
              value={formData.motivationalTip}
              onChange={(e) => setFormData({ ...formData, motivationalTip: e.target.value })}
              placeholder="A motivational message to encourage completion..."
              className="dark-input"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="form-section">
        <Label className="text-white">Tags</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="dark-input flex-1"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="form-section">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Recurring Challenge</Label>
              <p className="text-sm text-slate-400">Repeat this challenge daily</p>
            </div>
            <Switch
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Reminder Notifications</Label>
              <p className="text-sm text-slate-400">Get notified about this challenge</p>
            </div>
            <Switch
              checked={formData.reminderEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, reminderEnabled: checked })}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      {formData.title && formData.type && (
        <Card className="dark-card">
          <CardHeader>
            <CardTitle className="text-white">Challenge Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
              <span className="text-2xl">{selectedType?.icon}</span>
              <div className="flex-1">
                <h3 className="font-medium text-white">{formData.title}</h3>
                <p className="text-sm text-slate-400">{formData.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${selectedDifficulty?.color} text-white`}>{selectedDifficulty?.label}</Badge>
                  <Badge variant="outline">{selectedDifficulty?.points} pts</Badge>
                  <Badge variant="outline">{formData.estimatedDuration[0]} min</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-700">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-slate-600"
          disabled={isLoading || !formData.title || !formData.type}
        >
          {isLoading ? "Creating..." : challenge ? "Update Challenge" : "Create Challenge"}
        </Button>
      </div>
    </form>
  )
}
