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
import { Badge } from "@/components/ui/badge"

interface ChallengeFormProps {
  challenge?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

const categories = [
  { value: "strength", label: "Strength", icon: "💪" },
  { value: "cardio", label: "Cardio", icon: "🏃" },
  { value: "flexibility", label: "Flexibility", icon: "🤸" },
  { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
  { value: "nutrition", label: "Nutrition", icon: "🥗" },
  { value: "wellness", label: "Wellness", icon: "💧" },
]

const difficulties = [
  { value: "beginner", label: "Beginner", description: "Perfect for getting started" },
  { value: "intermediate", label: "Intermediate", description: "Some experience required" },
  { value: "advanced", label: "Advanced", description: "For experienced users" },
]

const durations = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "21", label: "21 days" },
  { value: "30", label: "30 days" },
  { value: "custom", label: "Custom" },
]

export function ChallengeForm({ challenge, onSubmit, onCancel }: ChallengeFormProps) {
  const [formData, setFormData] = useState({
    name: challenge?.name || "",
    description: challenge?.description || "",
    category: challenge?.category || "",
    difficulty: challenge?.difficulty || "",
    duration: challenge?.duration || "",
    customDuration: challenge?.customDuration || "",
    dailyGoal: challenge?.dailyGoal || "",
    reward: challenge?.reward || "",
    requirements: challenge?.requirements || "",
    isPublic: challenge?.isPublic ?? true,
    allowTeams: challenge?.allowTeams ?? false,
    maxParticipants: challenge?.maxParticipants || "",
    startDate: challenge?.startDate || "",
    tags: challenge?.tags || [],
  })

  const [newTag, setNewTag] = useState("")
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Challenge Name *</Label>
          <Input
            id="name"
            placeholder="e.g., 30-Day Pushup Challenge"
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
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe the challenge and its benefits..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Difficulty Level *</Label>
        <RadioGroup
          value={formData.difficulty}
          onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
        >
          {difficulties.map((diff) => (
            <div key={diff.value} className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value={diff.value} id={diff.value} />
              <div className="flex-1">
                <Label htmlFor={diff.value} className="font-medium">
                  {diff.label}
                </Label>
                <p className="text-sm text-gray-600">{diff.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duration *</Label>
          <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((dur) => (
                <SelectItem key={dur.value} value={dur.value}>
                  {dur.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.duration === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="customDuration">Custom Duration (days)</Label>
            <Input
              id="customDuration"
              type="number"
              min="1"
              placeholder="Enter number of days"
              value={formData.customDuration}
              onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dailyGoal">Daily Goal *</Label>
        <Input
          id="dailyGoal"
          placeholder="e.g., Complete 20 pushups"
          value={formData.dailyGoal}
          onChange={(e) => setFormData({ ...formData, dailyGoal: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reward">Reward</Label>
          <Input
            id="reward"
            placeholder="e.g., Strength Badge + 500 XP"
            value={formData.reward}
            onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxParticipants">Max Participants</Label>
          <Input
            id="maxParticipants"
            type="number"
            placeholder="Leave empty for unlimited"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          placeholder="Any equipment or prerequisites needed..."
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-3">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublic"
            checked={formData.isPublic}
            onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked as boolean })}
          />
          <Label htmlFor="isPublic">Make this challenge public</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowTeams"
            checked={formData.allowTeams}
            onCheckedChange={(checked) => setFormData({ ...formData, allowTeams: checked as boolean })}
          />
          <Label htmlFor="allowTeams">Allow team participation</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.name || !formData.description || !formData.category || !formData.difficulty}
          className="flex-1 bg-gradient-to-r from-red-500 to-blue-500"
        >
          {isLoading ? "Saving..." : challenge ? "Update Challenge" : "Create Challenge"}
        </Button>
      </div>
    </form>
  )
}
