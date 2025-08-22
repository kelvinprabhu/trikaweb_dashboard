import { ObjectId } from 'mongodb'

export interface MeditationSession {
  _id?: ObjectId
  userEmail: string
  sessionId: string
  sessionName: string
  sessionType: 'preset' | 'custom'
  
  // Session details
  duration: number // in minutes
  category: string
  instructor?: string
  
  // Custom session specific data
  customData?: {
    currentMood: string
    energyLevel: number
    stressLevel: number
    selectedGoals: string[]
    binauralFrequency: string
    ambientSounds: string[]
    includeGuidance: boolean
    includeBreathing: boolean
    personalIntention: string
    moodData: {
      value: string
      label: string
      emoji: string
      color: string
    }
    frequencyData: {
      range: string
      label: string
      description: string
      benefits: string[]
    }
    estimatedEffectiveness: number
  }
  
  // Session tracking
  startTime: Date
  endTime?: Date
  actualDuration?: number // actual time listened in minutes
  completed: boolean
  
  // Audio file info
  audioPath?: string // path to the generated MP3 file
  audioUrl?: string // URL to access the audio
  
  // User experience
  mood: {
    before: number // 1-10 scale
    after?: number // 1-10 scale
  }
  rating?: number // 1-5 stars
  pauseCount: number
  volume: number
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  generatedAt?: Date // for custom sessions
}

export interface MeditationStats {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  averageRating: number
  completionRate: number
  favoriteCategory: string
  lastSessionDate?: Date
}

export interface CustomSessionRequest {
  currentMood: string
  energyLevel: number
  stressLevel: number
  selectedGoals: string[]
  duration: number
  binauralFrequency: string
  ambientSounds: string[]
  volume: number
  includeGuidance: boolean
  includeBreathing: boolean
  personalIntention: string
  reminderTime?: string
  sessionName: string
  generatedAt: string
  moodData: {
    value: string
    label: string
    emoji: string
    color: string
  }
  frequencyData: {
    range: string
    label: string
    description: string
    benefits: string[]
  }
  estimatedEffectiveness: number
  sessionId: string
}

export interface CustomSessionResponse {
  success: boolean
  sessionId: string
  audioPath?: string
  audioUrl?: string
  message?: string
  error?: string
}

export interface MeditationStatsResponse {
  success: boolean
  stats: MeditationStats
  error?: string
}

// Helper functions
export const calculateStreak = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0
  
  const sortedSessions = sessions
    .filter(s => s.completed)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (const session of sortedSessions) {
    const sessionDate = new Date(session.startTime)
    sessionDate.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      streak++
    } else if (daysDiff === streak + 1) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export const calculateStats = (sessions: MeditationSession[]): MeditationStats => {
  const completedSessions = sessions.filter(s => s.completed)
  const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0)
  const ratedSessions = completedSessions.filter(s => s.rating)
  const averageRating = ratedSessions.length > 0 
    ? ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length 
    : 0
  
  // Find favorite category
  const categoryCount: { [key: string]: number } = {}
  completedSessions.forEach(s => {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1
  })
  
  const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
    categoryCount[a] > categoryCount[b] ? a : b, 'general'
  )
  
  return {
    totalSessions: completedSessions.length,
    totalMinutes: Math.round(totalMinutes),
    currentStreak: calculateStreak(sessions),
    averageRating: Math.round(averageRating * 10) / 10,
    completionRate: sessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) : 0,
    favoriteCategory,
    lastSessionDate: completedSessions.length > 0 ? completedSessions[0].startTime : undefined
  }
}
