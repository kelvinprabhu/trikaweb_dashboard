import { ObjectId } from 'mongodb'

export interface Exercise {
  name: string
  durationMinutes: number
  completed: boolean
  breaksTaken: number
  postureGuidance: string
  caloriesBurned?: number
  category?: string
}

export interface WorkoutBreak {
  timestamp: Date
  durationSeconds: number
  reason?: string
}

export interface WorkoutSession {
  _id?: ObjectId
  userEmail: string
  sessionType: "Global" | "Custom" | "Regular"
  title: string
  workoutType?: string
  totalDurationMinutes: number
  startTime: Date
  endTime?: Date
  caloriesBurned: number
  restDurationSeconds: number
  intervalType: "Fixed" | "Reps"
  exercises: Exercise[]
  breaks: WorkoutBreak[]
  voiceGuidanceUsed: boolean
  aiMotivationPhrases: string[]
  notes: string
  createdAt?: Date
  updatedAt?: Date
}

export interface WorkoutSessionResponse {
  success: boolean
  sessionId?: ObjectId
  message?: string
  error?: string
}

export interface WorkoutSessionsListResponse {
  success: boolean
  sessions: WorkoutSession[]
  totalCount: number
  hasMore: boolean
  error?: string
}

// Exercise library types
export interface ExerciseTemplate {
  name: string
  met: number
  guidance: string
  category: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  equipment?: string[]
  muscleGroups?: string[]
}

export interface WorkoutTemplate {
  id: string
  name: string
  category: string
  description: string
  exercises: ExerciseTemplate[]
  estimatedDuration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

// Calorie calculation constants
export const WORKOUT_TYPE_MULTIPLIERS = {
  cardio: 1.2,
  strength: 0.9,
  flexibility: 0.7,
  bodyweight: 1.0,
  endurance: 1.4,
  core: 0.8,
  mixed: 1.0
} as const

export const USER_WEIGHT_DEFAULT = 70 // kg

// Helper functions
export const calculateCalories = (
  exerciseName: string,
  durationMinutes: number,
  userWeight: number = USER_WEIGHT_DEFAULT,
  workoutCategory?: string
): number => {
  // This would typically import from the exercise library
  const baseMET = 5.0
  const category = workoutCategory || 'mixed'
  const multiplier = WORKOUT_TYPE_MULTIPLIERS[category as keyof typeof WORKOUT_TYPE_MULTIPLIERS] || 1.0
  
  const baseCalories = (baseMET * userWeight * durationMinutes) / 60
  return Math.round(baseCalories * multiplier)
}

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export const getWorkoutIntensity = (caloriesPerMinute: number): string => {
  if (caloriesPerMinute < 5) return 'Low'
  if (caloriesPerMinute < 10) return 'Moderate'
  if (caloriesPerMinute < 15) return 'High'
  return 'Very High'
}
