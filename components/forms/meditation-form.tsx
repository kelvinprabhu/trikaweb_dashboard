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

interface MeditationFormProps {
  session?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

const categories = [
  { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
  { value: "sleep", label: "Sleep", icon: "🌙" },
  { value: "breathing", label: "Breathing", icon: "🌬️" },
  { value: "focus", label: "Focus", icon: "🎯" },
  { value: "stress-relief", label: "Stress Relief", icon: "😌" },
  { value: "body-scan", label: "Body Scan", icon: "🫧" },
]

const difficulties = [
  { value: "beginner", label: "Beginner", description: "New to meditation" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "advanced", label: "Advanced", description: "Regular practitioner" },
]

const durations = [
  { value: "5", label: "5 minutes" },
  { value: "10", label: "10 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "20", label: "20 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "custom", label: "Custom" },
]

const instructors = [
  { value: "ai-sarah", label: "AI Guide Sarah" },
  { value: "ai-luna", label: "AI Guide Luna" },
  { value: "ai-zen", label: "AI Guide Zen" },
  { value: "ai-focus", label: "AI Guide Focus" },
]

export function MeditationForm({ session, onSubmit, onCancel }: MeditationFormProps) {
  const [formData, setFormData] = useState({
    title: session?.title || "",
    description: session?.description || "",
    category: session?.category || "",
    difficulty: session?.difficulty || "",
    duration: session?.duration || "",
    customDuration: session?.customDuration || "",
    instructor: session?.instructor || "",
    image: session?.image || "",
    benefits: session?.benefits || [],
    backgroundSounds: session?.backgroundSounds || [],
    hasVoiceGuidance: session?.hasVoiceGuidance ?? true,
    hasBreathingCues: session?.hasBreathingCues ?? false,
    script: session?.script || "",
    isPublic: session?.isPublic ?? true,
  })

  const [newBenefit, setNewBenefit] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const backgroundSoundOptions = [
    "Ocean waves",
    "Forest sounds",
    "Rain",
    "White noise",
    "Tibetan bowls",
    "Nature sounds",
    "Silence",
  ]

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

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData({ ...formData, benefits: [...formData.benefits, newBenefit.trim()] })
      setNewBenefit("")
    }
  }

  const removeBenefit = (benefitToRemove: string) => {
    setFormData({ ...formData, benefits: formData.benefits.filter((benefit) => benefit !== benefitToRemove) })
  }

  const toggleBackgroundSound = (sound: string) => {
    const updatedSounds = formData.backgroundSounds.includes(sound)
      ? formData.backgroundSounds.filter((s) => s !== sound)
      : [...formData.backgroundSounds, sound]

    setFormData({ ...formData, backgroundSounds: updatedSounds })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Session Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Morning Mindfulness"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          placeholder="Describe the meditation session and its purpose..."
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
            <Label htmlFor="customDuration">Custom Duration (minutes)</Label>
            <Input
              id="customDuration"
              type="number"
              min="1"
              placeholder="Enter minutes"
              value={formData.customDuration}
              onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>AI Instructor</Label>
          <Select
            value={formData.instructor}
            onValueChange={(value) => setFormData({ ...formData, instructor: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.value} value={instructor.value}>
                  {instructor.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Session Icon/Emoji</Label>
        <Input
          id="image"
          placeholder="e.g., 🌅"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <Label>Benefits</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a benefit..."
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
          />
          <Button type="button" onClick={addBenefit} variant="outline">
            Add
          </Button>
        </div>
        {formData.benefits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.benefits.map((benefit, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeBenefit(benefit)}>
                {benefit} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>Background Sounds</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {backgroundSoundOptions.map((sound) => (
            <div key={sound} className="flex items-center space-x-2">
              <Checkbox
                id={sound}
                checked={formData.backgroundSounds.includes(sound)}
                onCheckedChange={() => toggleBackgroundSound(sound)}
              />
              <Label htmlFor={sound} className="text-sm">
                {sound}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasVoiceGuidance"
            checked={formData.hasVoiceGuidance}
            onCheckedChange={(checked) => setFormData({ ...formData, hasVoiceGuidance: checked as boolean })}
          />
          <Label htmlFor="hasVoiceGuidance">Include voice guidance</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasBreathingCues"
            checked={formData.hasBreathingCues}
            onCheckedChange={(checked) => setFormData({ ...formData, hasBreathingCues: checked as boolean })}
          />
          <Label htmlFor="hasBreathingCues">Include breathing cues</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublic"
            checked={formData.isPublic}
            onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked as boolean })}
          />
          <Label htmlFor="isPublic">Make this session public</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="script">Meditation Script</Label>
        <Textarea
          id="script"
          placeholder="Enter the meditation script or guidance notes..."
          value={formData.script}
          onChange={(e) => setFormData({ ...formData, script: e.target.value })}
          rows={6}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.title || !formData.description || !formData.category || !formData.difficulty}
          className="flex-1 bg-gradient-to-r from-red-500 to-blue-500"
        >
          {isLoading ? "Saving..." : session ? "Update Session" : "Create Session"}
        </Button>
      </div>
    </form>
  )
}
