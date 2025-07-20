"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PersonalInfoStepProps {
  data: {
    age: string
    gender: string
    height: string
    weight: string
    activityLevel: string
  }
  onUpdate: (data: any) => void
}

export function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={data.age}
            onChange={(e) => handleChange("age", e.target.value)}
            min="13"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={data.gender} onValueChange={(value) => handleChange("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="Enter height in cm"
            value={data.height}
            onChange={(e) => handleChange("height", e.target.value)}
            min="100"
            max="250"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="Enter weight in kg"
            value={data.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
            min="30"
            max="300"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Current Activity Level</Label>
        <RadioGroup
          value={data.activityLevel}
          onValueChange={(value) => handleChange("activityLevel", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="sedentary" id="sedentary" />
            <div className="flex-1">
              <Label htmlFor="sedentary" className="font-medium">
                Sedentary
              </Label>
              <p className="text-sm text-gray-600">Little to no exercise</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="light" id="light" />
            <div className="flex-1">
              <Label htmlFor="light" className="font-medium">
                Light
              </Label>
              <p className="text-sm text-gray-600">Light exercise 1-3 days/week</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="moderate" id="moderate" />
            <div className="flex-1">
              <Label htmlFor="moderate" className="font-medium">
                Moderate
              </Label>
              <p className="text-sm text-gray-600">Moderate exercise 3-5 days/week</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="intense" id="intense" />
            <div className="flex-1">
              <Label htmlFor="intense" className="font-medium">
                Intense
              </Label>
              <p className="text-sm text-gray-600">Hard exercise 6-7 days/week</p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
