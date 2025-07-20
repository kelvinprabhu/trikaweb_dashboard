"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface FitnessGoalsStepProps {
  data: {
    primaryGoal: string
    fitnessLevel: string
    workoutFrequency: string
    preferredWorkouts: string[]
  }
  onUpdate: (data: any) => void
}

const workoutTypes = [
  { id: "strength", label: "Strength Training", icon: "💪" },
  { id: "cardio", label: "Cardio", icon: "🏃" },
  { id: "yoga", label: "Yoga", icon: "🧘" },
  { id: "pilates", label: "Pilates", icon: "🤸" },
  { id: "hiit", label: "HIIT", icon: "⚡" },
  { id: "swimming", label: "Swimming", icon: "🏊" },
  { id: "cycling", label: "Cycling", icon: "🚴" },
  { id: "dancing", label: "Dancing", icon: "💃" },
]

export function FitnessGoalsStep({ data, onUpdate }: FitnessGoalsStepProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value })
  }

  const handleWorkoutToggle = (workoutId: string, checked: boolean) => {
    const updatedWorkouts = checked
      ? [...data.preferredWorkouts, workoutId]
      : data.preferredWorkouts.filter((id) => id !== workoutId)

    onUpdate({ preferredWorkouts: updatedWorkouts })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>What's your primary fitness goal?</Label>
        <RadioGroup
          value={data.primaryGoal}
          onValueChange={(value) => handleChange("primaryGoal", value)}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="lose-weight" id="lose-weight" />
            <div className="flex-1">
              <Label htmlFor="lose-weight" className="font-medium">
                Lose Weight
              </Label>
              <p className="text-sm text-gray-600">Burn calories and reduce body fat</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="build-muscle" id="build-muscle" />
            <div className="flex-1">
              <Label htmlFor="build-muscle" className="font-medium">
                Build Muscle
              </Label>
              <p className="text-sm text-gray-600">Increase strength and muscle mass</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="improve-endurance" id="improve-endurance" />
            <div className="flex-1">
              <Label htmlFor="improve-endurance" className="font-medium">
                Improve Endurance
              </Label>
              <p className="text-sm text-gray-600">Boost cardiovascular fitness</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="maintain-health" id="maintain-health" />
            <div className="flex-1">
              <Label htmlFor="maintain-health" className="font-medium">
                Maintain Health
              </Label>
              <p className="text-sm text-gray-600">Stay active and healthy</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Fitness Level</Label>
          <Select value={data.fitnessLevel} onValueChange={(value) => handleChange("fitnessLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select fitness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preferred Workout Frequency</Label>
          <Select value={data.workoutFrequency} onValueChange={(value) => handleChange("workoutFrequency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="How often?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1-2 times per week</SelectItem>
              <SelectItem value="3-4">3-4 times per week</SelectItem>
              <SelectItem value="5-6">5-6 times per week</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>What types of workouts do you enjoy? (Select all that apply)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {workoutTypes.map((workout) => (
            <div key={workout.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
              <Checkbox
                id={workout.id}
                checked={data.preferredWorkouts.includes(workout.id)}
                onCheckedChange={(checked) => handleWorkoutToggle(workout.id, checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor={workout.id} className="font-medium text-sm flex items-center gap-2">
                  <span>{workout.icon}</span>
                  {workout.label}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
