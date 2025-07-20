"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface WorkoutFormProps {
  workout?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

const workoutTypes = [
  { value: "strength", label: "Strength Training" },
  { value: "cardio", label: "Cardio" },
  { value: "hiit", label: "HIIT" },
  { value: "yoga", label: "Yoga" },
  { value: "pilates", label: "Pilates" },
  { value: "stretching", label: "Stretching" },
  { value: "sports", label: "Sports" },
  { value: "dance", label: "Dance" },
]

const intensityLevels = [
  { value: "low", label: "Low", description: "Light activity, easy pace" },
  { value: "moderate", label: "Moderate", description: "Moderate effort, can hold conversation" },
  { value: "high", label: "High", description: "Hard effort, difficult to talk" },
  { value: "maximum", label: "Maximum", description: "All-out effort" },
]

export function WorkoutForm({ workout, onSubmit, onCancel }: WorkoutFormProps) {
  const [formData, setFormData] = useState({
    name: workout?.name || "",
    description: workout?.description || "",
    type: workout?.type || "",
    duration: workout?.duration || "",
    intensity: workout?.intensity || "",
    caloriesBurned: workout?.caloriesBurned || "",
    equipment: workout?.equipment || [],
    exercises: workout?.exercises || [{ name: "", sets: "", reps: "", duration: "", notes: "" }],
    instructions: workout?.instructions || "",
    targetMuscles: workout?.targetMuscles || [],
    difficulty: workout?.difficulty || "",
  })

  const [newEquipment, setNewEquipment] = useState("")
  const [newMuscle, setNewMuscle] = useState("")
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

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: "", sets: "", reps: "", duration: "", notes: "" }],
    })
  }

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    })
  }

  const updateExercise = (index: number, field: string, value: string) => {
    const updatedExercises = formData.exercises.map((exercise, i) =>
      i === index ? { ...exercise, [field]: value } : exercise,
    )
    setFormData({ ...formData, exercises: updatedExercises })
  }

  const addEquipment = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      setFormData({ ...formData, equipment: [...formData.equipment, newEquipment.trim()] })
      setNewEquipment("")
    }
  }

  const removeEquipment = (equipmentToRemove: string) => {
    setFormData({ ...formData, equipment: formData.equipment.filter((eq) => eq !== equipmentToRemove) })
  }

  const addMuscle = () => {
    if (newMuscle.trim() && !formData.targetMuscles.includes(newMuscle.trim())) {
      setFormData({ ...formData, targetMuscles: [...formData.targetMuscles, newMuscle.trim()] })
      setNewMuscle("")
    }
  }

  const removeMuscle = (muscleToRemove: string) => {
    setFormData({ ...formData, targetMuscles: formData.targetMuscles.filter((muscle) => muscle !== muscleToRemove) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Workout Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Upper Body Strength"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Workout Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {workoutTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
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
          placeholder="Describe the workout and its benefits..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            placeholder="30"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Intensity *</Label>
          <Select value={formData.intensity} onValueChange={(value) => setFormData({ ...formData, intensity: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select intensity" />
            </SelectTrigger>
            <SelectContent>
              {intensityLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="caloriesBurned">Estimated Calories Burned</Label>
        <Input
          id="caloriesBurned"
          type="number"
          placeholder="300"
          value={formData.caloriesBurned}
          onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <Label>Equipment Needed</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add equipment..."
            value={newEquipment}
            onChange={(e) => setNewEquipment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEquipment())}
          />
          <Button type="button" onClick={addEquipment} variant="outline">
            Add
          </Button>
        </div>
        {formData.equipment.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.equipment.map((eq, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeEquipment(eq)}>
                {eq} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>Target Muscles</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add muscle group..."
            value={newMuscle}
            onChange={(e) => setNewMuscle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMuscle())}
          />
          <Button type="button" onClick={addMuscle} variant="outline">
            Add
          </Button>
        </div>
        {formData.targetMuscles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.targetMuscles.map((muscle, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeMuscle(muscle)}>
                {muscle} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Exercises</Label>
          <Button type="button" onClick={addExercise} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Exercise
          </Button>
        </div>

        <div className="space-y-4">
          {formData.exercises.map((exercise, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Exercise {index + 1}</h4>
                {formData.exercises.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeExercise(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Exercise name"
                  value={exercise.name}
                  onChange={(e) => updateExercise(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Sets"
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, "sets", e.target.value)}
                />
                <Input
                  placeholder="Reps"
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, "reps", e.target.value)}
                />
                <Input
                  placeholder="Duration"
                  value={exercise.duration}
                  onChange={(e) => updateExercise(index, "duration", e.target.value)}
                />
              </div>

              <Input
                placeholder="Notes (optional)"
                value={exercise.notes}
                onChange={(e) => updateExercise(index, "notes", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          placeholder="Detailed workout instructions..."
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.name || !formData.type || !formData.duration || !formData.intensity}
          className="flex-1 bg-gradient-to-r from-red-500 to-blue-500"
        >
          {isLoading ? "Saving..." : workout ? "Update Workout" : "Create Workout"}
        </Button>
      </div>
    </form>
  )
}
