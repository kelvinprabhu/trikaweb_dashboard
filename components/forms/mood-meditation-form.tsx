"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Heart, Brain, Waves, Volume2 } from "lucide-react"

interface MoodMeditationFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

const moodOptions = [
  { value: "stressed", label: "Stressed", emoji: "😰", color: "bg-red-500" },
  { value: "anxious", label: "Anxious", emoji: "😟", color: "bg-orange-500" },
  { value: "tired", label: "Tired", emoji: "😴", color: "bg-blue-500" },
  { value: "sad", label: "Sad", emoji: "😢", color: "bg-indigo-500" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "bg-gray-500" },
  { value: "content", label: "Content", emoji: "😌", color: "bg-green-500" },
  { value: "happy", label: "Happy", emoji: "😊", color: "bg-yellow-500" },
  { value: "excited", label: "Excited", emoji: "🤩", color: "bg-purple-500" },
]

const goals = [
  { value: "relax", label: "Relax & Unwind", icon: "🌸" },
  { value: "focus", label: "Improve Focus", icon: "🎯" },
  { value: "sleep", label: "Better Sleep", icon: "🌙" },
  { value: "energy", label: "Boost Energy", icon: "⚡" },
  { value: "creativity", label: "Enhance Creativity", icon: "🎨" },
  { value: "confidence", label: "Build Confidence", icon: "💪" },
  { value: "healing", label: "Emotional Healing", icon: "💚" },
  { value: "clarity", label: "Mental Clarity", icon: "🧠" },
]

const binauralFrequencies = [
  {
    range: "delta",
    label: "Delta (0.5-4 Hz)",
    description: "Deep sleep, healing, regeneration",
    benefits: ["Deep relaxation", "Pain relief", "Immune system boost"],
  },
  {
    range: "theta",
    label: "Theta (4-8 Hz)",
    description: "Deep meditation, creativity, intuition",
    benefits: ["Enhanced creativity", "Deep meditation", "Memory improvement"],
  },
  {
    range: "alpha",
    label: "Alpha (8-13 Hz)",
    description: "Relaxed awareness, light meditation",
    benefits: ["Stress reduction", "Improved focus", "Calm alertness"],
  },
  {
    range: "beta",
    label: "Beta (13-30 Hz)",
    description: "Active thinking, concentration, alertness",
    benefits: ["Enhanced focus", "Problem solving", "Active concentration"],
  },
  {
    range: "gamma",
    label: "Gamma (30-100 Hz)",
    description: "Higher consciousness, peak performance",
    benefits: ["Peak awareness", "Cognitive enhancement", "Spiritual experiences"],
  },
]

const ambientSounds = [
  { value: "rain", label: "Rain", icon: "🌧️" },
  { value: "ocean", label: "Ocean Waves", icon: "🌊" },
  { value: "forest", label: "Forest", icon: "🌲" },
  { value: "birds", label: "Birds", icon: "🐦" },
  { value: "wind", label: "Wind", icon: "💨" },
  { value: "fire", label: "Crackling Fire", icon: "🔥" },
  { value: "bells", label: "Tibetan Bells", icon: "🔔" },
  { value: "piano", label: "Soft Piano", icon: "🎹" },
  { value: "flute", label: "Bamboo Flute", icon: "🎵" },
  { value: "singing", label: "Singing Bowls", icon: "🥣" },
  { value: "white", label: "White Noise", icon: "📻" },
  { value: "brown", label: "Brown Noise", icon: "🤎" },
]

export function MoodMeditationForm({ onSubmit, onCancel }: MoodMeditationFormProps) {
  interface FormData {
    currentMood: string
    energyLevel: number[]
    stressLevel: number[]
    selectedGoals: string[]
    duration: number[]
    binauralFrequency: string
    ambientSounds: string[]
    volume: number[]
    includeGuidance: boolean
    includeBreathing: boolean
    personalIntention: string
    reminderTime: string
    sessionName: string
  }

  const [formData, setFormData] = useState<FormData>({
    currentMood: "",
    energyLevel: [5],
    stressLevel: [5],
    selectedGoals: [],
    duration: [15],
    binauralFrequency: "",
    ambientSounds: [],
    volume: [70],
    includeGuidance: true,
    includeBreathing: true,
    personalIntention: "",
    reminderTime: "",
    sessionName: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate binaural beat generation based on mood and goals
    const selectedMood = moodOptions.find((m) => m.value === formData.currentMood)
    const selectedFreq = binauralFrequencies.find((f) => f.range === formData.binauralFrequency)

    const meditationData = {
      ...formData,
      generatedAt: new Date().toISOString(),
      moodData: selectedMood,
      frequencyData: selectedFreq,
      estimatedEffectiveness: Math.floor(Math.random() * 20) + 80, // 80-100%
      sessionId: `mood_${Date.now()}`,
    }
    console.warn(meditationData)

    try {
      await onSubmit(meditationData)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleGoal = (goalValue: string) => {
    const currentGoals = formData.selectedGoals
    const newGoals = currentGoals.includes(goalValue)
      ? currentGoals.filter((g) => g !== goalValue)
      : [...currentGoals, goalValue]

    setFormData({ ...formData, selectedGoals: newGoals })
  }

  const toggleAmbientSound = (soundValue: string) => {
    const currentSounds = formData.ambientSounds
    const newSounds = currentSounds.includes(soundValue)
      ? currentSounds.filter((s) => s !== soundValue)
      : [...currentSounds, soundValue]

    setFormData({ ...formData, ambientSounds: newSounds })
  }

  const getRecommendedFrequency = () => {
    if (!formData.currentMood) return null

    const moodToFrequency = {
      stressed: "alpha",
      anxious: "theta",
      tired: "delta",
      sad: "theta",
      neutral: "alpha",
      content: "alpha",
      happy: "beta",
      excited: "beta",
    }

    return moodToFrequency[formData.currentMood as keyof typeof moodToFrequency] || "alpha"
  }

  const recommendedFreq = getRecommendedFrequency()

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Current Mood */}
      <div className="form-section">
        <Label className="text-base font-medium text-white mb-3 block">How are you feeling right now?</Label>
        <div className="mood-selector">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => setFormData({ ...formData, currentMood: mood.value })}
              className={`mood-option ${formData.currentMood === mood.value ? "selected" : ""}`}
            >
              <span className="text-2xl block mb-1">{mood.emoji}</span>
              <span className="text-sm text-white">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy & Stress Levels */}
      <div className="form-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white">Energy Level: {formData.energyLevel[0]}/10</Label>
            <Slider
              value={formData.energyLevel}
              onValueChange={(value) => setFormData({ ...formData, energyLevel: value })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>

          <div>
            <Label className="text-white">Stress Level: {formData.stressLevel[0]}/10</Label>
            <Slider
              value={formData.stressLevel}
              onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Calm</span>
              <span>Very Stressed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="form-section">
        <Label className="text-base font-medium text-white mb-3 block">What would you like to achieve?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {goals.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => toggleGoal(goal.value)}
              className={`p-3 border-2 rounded-lg transition-all text-center ${
                formData.selectedGoals.includes(goal.value)
                  ? "border-blue-500 bg-blue-500 bg-opacity-20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-800"
              }`}
            >
              <span className="text-xl block mb-1">{goal.icon}</span>
              <span className="text-xs text-white">{goal.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="form-section">
        <Label className="text-white">Session Duration: {formData.duration[0]} minutes</Label>
        <Slider
          value={formData.duration}
          onValueChange={(value) => setFormData({ ...formData, duration: value })}
          max={60}
          min={5}
          step={5}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>5 min</span>
          <span>60 min</span>
        </div>
      </div>

      {/* Binaural Frequency */}
      <div className="form-section">
        <Label className="text-base font-medium text-white mb-3 block">
          <Waves className="w-4 h-4 inline mr-2" />
          Binaural Beat Frequency
        </Label>
        {recommendedFreq && (
          <div className="mb-3 p-3 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg">
            <p className="text-sm text-blue-300">
              <Brain className="w-4 h-4 inline mr-1" />
              Recommended for your mood: {binauralFrequencies.find((f) => f.range === recommendedFreq)?.label}
            </p>
          </div>
        )}
        <div className="space-y-3">
          {binauralFrequencies.map((freq) => (
            <div
              key={freq.range}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.binauralFrequency === freq.range
                  ? "border-blue-500 bg-blue-500 bg-opacity-20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-800"
              } ${freq.range === recommendedFreq ? "ring-2 ring-blue-400 ring-opacity-50" : ""}`}
              onClick={() => setFormData({ ...formData, binauralFrequency: freq.range })}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white">{freq.label}</h3>
                  <p className="text-sm text-slate-400 mt-1">{freq.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {freq.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
                {freq.range === recommendedFreq && <Badge className="bg-blue-500 text-white">Recommended</Badge>}
              </div>
              <div className="frequency-visualizer mt-3">
                <div className="frequency-wave"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient Sounds */}
      <div className="form-section">
        <Label className="text-base font-medium text-white mb-3 block">
          <Volume2 className="w-4 h-4 inline mr-2" />
          Ambient Sounds (Optional)
        </Label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {ambientSounds.map((sound) => (
            <button
              key={sound.value}
              type="button"
              onClick={() => toggleAmbientSound(sound.value)}
              className={`p-2 border-2 rounded-lg transition-all text-center ${
                formData.ambientSounds.includes(sound.value)
                  ? "border-blue-500 bg-blue-500 bg-opacity-20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-800"
              }`}
            >
              <span className="text-lg block">{sound.icon}</span>
              <span className="text-xs text-white">{sound.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div className="form-section">
        <Label className="text-white">Volume: {formData.volume[0]}%</Label>
        <Slider
          value={formData.volume}
          onValueChange={(value) => setFormData({ ...formData, volume: value })}
          max={100}
          min={10}
          step={5}
          className="mt-2"
        />
      </div>

      {/* Additional Options */}
      <div className="form-section">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Include Voice Guidance</Label>
              <p className="text-sm text-slate-400">Gentle voice instructions throughout the session</p>
            </div>
            <Switch
              checked={formData.includeGuidance}
              onCheckedChange={(checked) => setFormData({ ...formData, includeGuidance: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Include Breathing Cues</Label>
              <p className="text-sm text-slate-400">Visual and audio breathing guidance</p>
            </div>
            <Switch
              checked={formData.includeBreathing}
              onCheckedChange={(checked) => setFormData({ ...formData, includeBreathing: checked })}
            />
          </div>
        </div>
      </div>

      {/* Personal Intention */}
      <div className="form-section">
        <Label htmlFor="intention" className="text-white">
          Personal Intention (Optional)
        </Label>
        <Textarea
          id="intention"
          value={formData.personalIntention}
          onChange={(e) => setFormData({ ...formData, personalIntention: e.target.value })}
          placeholder="Set a personal intention for this meditation session..."
          className="dark-input"
          rows={3}
        />
      </div>

      {/* Session Name */}
      <div className="form-section">
        <Label htmlFor="sessionName" className="text-white">
          Session Name (Optional)
        </Label>
        <Input
          id="sessionName"
          value={formData.sessionName}
          onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
          placeholder="e.g., Morning Stress Relief"
          className="dark-input"
        />
      </div>

      {/* Preview */}
      {formData.currentMood && formData.binauralFrequency && (
        <Card className="dark-card">
          <CardHeader>
            <CardTitle className="text-white">Session Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-white">
                  Mood: {moodOptions.find((m) => m.value === formData.currentMood)?.label}
                  {moodOptions.find((m) => m.value === formData.currentMood)?.emoji}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Waves className="w-5 h-5 text-blue-500" />
                <span className="text-white">
                  Frequency: {binauralFrequencies.find((f) => f.range === formData.binauralFrequency)?.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-white">Duration: {formData.duration[0]} minutes</span>
              </div>
              {formData.selectedGoals.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.selectedGoals.map((goalValue) => {
                    const goal = goals.find((g) => g.value === goalValue)
                    return (
                      <Badge key={goalValue} variant="secondary">
                        {goal?.icon} {goal?.label}
                      </Badge>
                    )
                  })}
                </div>
              )}
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
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
          disabled={isLoading || !formData.currentMood || !formData.binauralFrequency}
        >
          {isLoading ? "Generating..." : "Generate Meditation"}
        </Button>
      </div>
    </form>
  )
}
