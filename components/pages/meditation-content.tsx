"use client"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Timer,
  Waves,
  Wind,
  Plus,
  Edit,
  Trash2,
  Heart,
  Brain,
  Moon,
} from "lucide-react"
import BreathingExercise from "@/components/Breathing/BreathingExercise"
import meditationSessionsData from "@/data/meditation-sessions.json"
// import breathingExercisesData from "@/data/breathing-exercises.json"

// Add these imports at the top
import { FormModal } from "@/components/forms/form-modal"
import { MeditationForm } from "@/components/forms/meditation-form"
import { WorkoutForm } from "@/components/forms/workout-form"
import { DeleteConfirmation } from "@/components/forms/delete-confirmation"
import { MoodMeditationForm } from "@/components/forms/mood-meditation-form"

// Load meditation sessions from data file
const meditationSessions = meditationSessionsData.sessions.map(session => ({
  ...session,
  id: parseInt(session._id)
}))

type Phase = "inhale" | "hold" | "exhale" | "pause"
type Pattern = Partial<Record<Phase, number>>
type Exercise = {
  id: number
  name: string
  description: string
  duration: string
  pattern: Pattern
  benefits: string[]
}

const breathingExercises: Exercise[] = [
  {
    id: 1,
    name: "4-7-8 Breathing",
    description: "Inhale 4, hold 7, exhale 8 seconds",
    duration: "5 min",
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    benefits: ["Reduces anxiety", "Promotes sleep"],
  },
  {
    id: 2,
    name: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, hold",
    duration: "8 min",
    pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    benefits: ["Calms nervous system", "Improves focus"],
  },
  {
    id: 3,
    name: "Coherent Breathing",
    description: "5 seconds in, 5 seconds out",
    duration: "10 min",
    pattern: { inhale: 5, exhale: 5 },
    benefits: ["Balances autonomic nervous system", "Reduces stress"],
  },
]

const meditationStats = {
  totalSessions: 68,
  totalMinutes: 1240,
  currentStreak: 12,
  longestStreak: 28,
  averageRating: 4.7,
  favoriteCategory: "Mindfulness",
}


export function MeditationContent({ email }: { email: string }) {
  // Add state for modals in the component
  const [showAddSessionModal, setShowAddSessionModal] = useState(false)
  const [showEditSessionModal, setShowEditSessionModal] = useState(false)
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false)
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false)
  const [showMoodMeditationModal, setShowMoodMeditationModal] = useState(false)
  const [showMoodModal, setShowMoodModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [currentSession, setCurrentSession] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sessionProgress, setSessionProgress] = useState(0)
  const [volume, setVolume] = useState([50])
  const [isMuted, setIsMuted] = useState(false)
  const [activeExercise, setActiveExercise] = useState<number | null>(null)
  const [breathingPhase, setBreathingPhase] = useState("inhale")
  const [breathingCount, setBreathingCount] = useState(0)

  // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [backgroundSound, setBackgroundSound] = useState<string | null>(null)
  const [breathingSession, setBreathingSession] = useState<string | null>(null)
  const [pauseCount, setPauseCount] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [moodBefore, setMoodBefore] = useState<number | null>(null)
  const [moodAfter, setMoodAfter] = useState<number | null>(null)

  // Analytics state
  const [meditationLogs, setMeditationLogs] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  // Meditation stats from database
  const [meditationStats, setMeditationStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    averageRating: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  // Custom session state
  const [customSessions, setCustomSessions] = useState<any[]>([])
  const [loadingCustomSessions, setLoadingCustomSessions] = useState(false)
  const [generatingSession, setGeneratingSession] = useState(false)

  // Custom session player state
  const [currentCustomSession, setCurrentCustomSession] = useState<string | null>(null)
  const [customSessionProgress, setCustomSessionProgress] = useState(0)
  const [isCustomPlaying, setIsCustomPlaying] = useState(false)
  const [customCurrentTime, setCustomCurrentTime] = useState(0)
  const [customDuration, setCustomDuration] = useState(0)
  const [customVolume, setCustomVolume] = useState([50])
  const [isCustomMuted, setIsCustomMuted] = useState(false)
  const [customSessionStartTime, setCustomSessionStartTime] = useState<Date | null>(null)
  const [customPauseCount, setCustomPauseCount] = useState(0)
  const customAudioRef = useRef<HTMLAudioElement | null>(null)

  const [voiceGuidance, setVoiceGuidance] = useState(true)
  // track which index in the phase order we are on (0 = inhale, 1 = hold, ...)
  const phaseIndexRef = useRef<number>(0)
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Breathing patterns for guided sessions
  const breathingPatterns = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
    'box': { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    'coherent': { inhale: 5, exhale: 5 }
  }

  // helper: build the order of phases for a pattern
  const buildPhaseOrder = (pattern: Pattern): Phase[] => {
    const order: Phase[] = []
    order.push("inhale")
    if (pattern.hold) order.push("hold")
    order.push("exhale")
    if (pattern.pause) order.push("pause")
    return order
  }

  // Breathing session integration with meditation timing
  useEffect(() => {
    if (!breathingSession || !currentSession || !isPlaying) {
      if (breathingTimerRef.current) {
        clearInterval(breathingTimerRef.current)
        breathingTimerRef.current = null
      }
      return
    }

    const pattern = breathingPatterns[breathingSession as keyof typeof breathingPatterns]
    if (!pattern) return

    const phaseOrder = buildPhaseOrder(pattern)
    let currentPhaseIndex = 0
    let currentPhaseTime = pattern[phaseOrder[0] as keyof typeof pattern] || 4

    setBreathingPhase(phaseOrder[0])
    setBreathingCount(currentPhaseTime)

    breathingTimerRef.current = setInterval(() => {
      setBreathingCount(prev => {
        if (prev <= 1) {
          // Move to next phase
          currentPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length
          const nextPhase = phaseOrder[currentPhaseIndex]
          setBreathingPhase(nextPhase)
          currentPhaseTime = pattern[nextPhase as keyof typeof pattern] || 4
          return currentPhaseTime
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (breathingTimerRef.current) {
        clearInterval(breathingTimerRef.current)
        breathingTimerRef.current = null
      }
    }
  }, [breathingSession, currentSession, isPlaying])
  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100
    }
  }, [volume, isMuted])

  // Log session when component unmounts or session changes
  useEffect(() => {
    return () => {
      if (currentSession && sessionStartTime) {
        logMeditationSession(false)
      }
    }
  }, [currentSession])

  // Breathing exercise animation
  useEffect(() => {
    if (activeExercise === null) {
      // reset visualizer when nothing active
      setBreathingPhase("inhale")
      setBreathingCount(0)
      return
    }

    const exercise = breathingExercises.find((e) => e.id === activeExercise)
    if (!exercise) return

    const order = buildPhaseOrder(exercise.pattern)

    // initialize to the first phase of this exercise
    phaseIndexRef.current = 0
    setBreathingPhase(order[0])
    setBreathingCount(exercise.pattern[order[0]] ?? exercise.pattern.inhale ?? 1)

    const tick = setInterval(() => {
      setBreathingCount((prev) => {
        if (prev <= 1) {
          // advance to next phase
          phaseIndexRef.current = (phaseIndexRef.current + 1) % order.length
          const nextPhase = order[phaseIndexRef.current]
          const nextCount = exercise.pattern[nextPhase] ?? exercise.pattern.inhale ?? 1
          setBreathingPhase(nextPhase)
          return nextCount
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(tick)
  }, [activeExercise]) // re-run when user starts a different exercise (or stops it)




  // Audio playback functions
  const startSession = async (sessionId: number) => {
    const session = meditationSessions.find(s => s.id === sessionId)
    if (!session) return

    setCurrentSession(sessionId)
    setSessionProgress(0)
    setSessionStartTime(new Date())
    setPauseCount(0)

    // Initialize audio
    if (audioRef.current) {
      audioRef.current.src = session.src
      audioRef.current.volume = volume[0] / 100
      audioRef.current.muted = isMuted

      try {
        await audioRef.current.load()
        setIsPlaying(true)
        await audioRef.current.play()
      } catch (error) {
        console.error('Error playing audio:', error)
      }
    }
  }

  const pauseSession = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setPauseCount(prev => prev + 1)
    }
  }

  const resumeSession = async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Error resuming audio:', error)
      }
    }
  }

  const resetSession = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setCurrentSession(null)
    setSessionProgress(0)
    setCurrentTime(0)
    setIsPlaying(false)
    setSessionStartTime(null)
    setPauseCount(0)
  }

  // Log meditation session to database
  const logMeditationSession = async (completed: boolean = false) => {
    if (!currentSession || !sessionStartTime) {
      console.log('Cannot log session: missing currentSession or sessionStartTime')
      return
    }

    const session = meditationSessions.find(s => s.id === currentSession)
    if (!session) {
      console.log('Cannot log session: session not found')
      return
    }

    const actualDuration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)
    const completionPercentage = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

    const logData = {
      userEmail: email || '',
      sessionId: session.id.toString(),
      sessionTitle: session.title || '',
      sessionDuration: session.duration || '0 min',
      actualDuration: actualDuration || 0,
      completionPercentage: Math.round(completionPercentage) || 0,
      isCompleted: completed || completionPercentage >= 80,
      sessionType: 'meditation',
      category: session.category || 'general',
      instructor: session.instructor || 'Unknown',
      mood: {
        before: moodBefore || 7,
        after: moodAfter || 10
      },
      pauseCount: pauseCount || 0,
      volume: volume[0] || 50,
      backgroundSound: backgroundSound || null,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    }

    console.log('Attempting to log meditation session with data:', logData)

    try {
      const response = await fetch('/api/meditation-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      })

      if (response.ok) {
        console.log('Meditation session logged successfully')
        // Show completion modal if session was completed
        if (completed) {
          setShowMoodModal(true)
        }
      } else {
        const errorText = await response.text()
        console.error('Failed to log meditation session:', response.status, errorText)
      }
    } catch (error) {
      console.error('Error logging meditation session:', error)
    }
  }

  // Complete session with mood tracking
  const completeSession = async () => {
    await logMeditationSession(true)
    resetSession()
  }

  // Fetch meditation analytics
  const fetchMeditationAnalytics = async () => {
    setLoadingAnalytics(true)
    try {
      const response = await fetch(`/api/meditation-logs?userEmail=${email}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setMeditationLogs(data.logs || [])
        setAnalytics(data.analytics || {})
      }
    } catch (error) {
      console.error('Error fetching meditation analytics:', error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  // Fetch meditation stats from database
  const fetchMeditationStats = async () => {
    try {
      setLoadingStats(true)
      const response = await fetch(`/api/meditation/stats?userEmail=${email}`)
      const data = await response.json()

      if (data.success) {
        setMeditationStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching meditation stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  // Fetch custom meditation sessions
  const fetchCustomSessions = async () => {
    try {
      setLoadingCustomSessions(true)
      const response = await fetch(`/api/meditation/custom-session/add?userEmail=${email}`)
      const data = await response.json()

      if (data.success) {
        setCustomSessions(data.sessions)
      }
    } catch (error) {
      console.error('Error fetching custom sessions:', error)
    } finally {
      setLoadingCustomSessions(false)
    }
  }

  // Load analytics and stats on component mount
  useEffect(() => {
    fetchMeditationAnalytics()
    fetchMeditationStats()
    fetchCustomSessions()
  }, [email])

  // Add these handler functions
  const handleAddSession = (data: any) => {
    console.log("Adding meditation session:", data)
    setShowAddSessionModal(false)
    // Add API call here
  }

  const handleEditSession = (data: any) => {
    console.log("Editing meditation session:", data)
    setShowEditSessionModal(false)
    setSelectedSession(null)
    // Add API call here
  }

  const handleDeleteSession = () => {
    console.log("Deleting meditation session:", selectedSession)
    setShowDeleteSessionModal(false)
    setSelectedSession(null)
    // Add API call here
  }

  const handleAddWorkout = (data: any) => {
    console.log("Adding workout:", data)
    setShowAddWorkoutModal(false)
    // Add API call here
  }

  // Custom session player functions
  const startCustomSession = (sessionId: string) => {
    const session = customSessions.find(s => s.sessionId === sessionId)
    if (!session || !session.audioUrl) return

    setCurrentCustomSession(sessionId)
    setCustomSessionStartTime(new Date())
    setCustomPauseCount(0)
    setCustomSessionProgress(0)
    setCustomCurrentTime(0)

    // Create audio element
    if (customAudioRef.current) {
      customAudioRef.current.pause()
      customAudioRef.current = null
    }

    const audio = new Audio(session.audioUrl)
    customAudioRef.current = audio
    audio.volume = customVolume[0] / 100
    audio.muted = isCustomMuted

    audio.play().then(() => {
      setIsCustomPlaying(true)

      // Update session start in database
      fetch('/api/meditation/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...session,
          startTime: new Date(),
          userEmail: email
        })
      }).catch(console.error)
    }).catch(console.error)
  }

  const pauseCustomSession = () => {
    if (customAudioRef.current) {
      customAudioRef.current.pause()
      setIsCustomPlaying(false)
      setCustomPauseCount(prev => prev + 1)
    }
  }

  const resumeCustomSession = () => {
    if (customAudioRef.current) {
      customAudioRef.current.play().then(() => {
        setIsCustomPlaying(true)
      }).catch(console.error)
    }
  }

  const resetCustomSession = () => {
    if (customAudioRef.current) {
      customAudioRef.current.currentTime = 0
      setCustomCurrentTime(0)
      setCustomSessionProgress(0)
    }
  }

  const completeCustomSession = async () => {
    const session = customSessions.find(s => s.sessionId === currentCustomSession)
    if (!session) return

    try {
      // Mark session as completed
      await fetch('/api/meditation/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...session,
          completed: true,
          endTime: new Date(),
          actualDuration: Math.floor(customCurrentTime / 60),
          pauseCount: customPauseCount,
          userEmail: email
        })
      })

      // Refresh stats and sessions
      await fetchMeditationStats()
      await fetchCustomSessions()

      // Reset player
      setCurrentCustomSession(null)
      setIsCustomPlaying(false)
      setCustomSessionProgress(0)
      setCustomCurrentTime(0)

      console.log('Custom meditation session completed! 🧘‍♀️')
    } catch (error) {
      console.error('Error completing custom session:', error)
    }
  }

  // Custom session audio effects
  useEffect(() => {
    const audio = customAudioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCustomCurrentTime(audio.currentTime)
      if (customDuration > 0) {
        setCustomSessionProgress((audio.currentTime / customDuration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setCustomDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsCustomPlaying(false)
      setCustomSessionProgress(100)
      completeCustomSession()
    }

    const handleError = (e: any) => {
      console.error('Custom session audio error:', e)
      setIsCustomPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [currentCustomSession, customDuration, email, customVolume, isCustomMuted, customPauseCount])

  // Update custom audio volume
  useEffect(() => {
    if (customAudioRef.current) {
      customAudioRef.current.volume = isCustomMuted ? 0 : customVolume[0] / 100
      customAudioRef.current.muted = isCustomMuted
    }
  }, [customVolume, isCustomMuted])

  const handleMoodMeditation = async (data: any) => {
    try {
      setGeneratingSession(true)
      console.log("Creating custom meditation session:", data)

      // POST to the correct backend route
      const response = await fetch('/api/meditation/custom-session/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userEmail: email
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log("Custom meditation session created successfully:", result)
        await fetchCustomSessions()
        await fetchMeditationStats()
        console.log(`Custom meditation session "${data.sessionName}" created successfully! You can now play it from the Custom Sessions tab.`)
      } else {
        console.error("Failed to create custom meditation session:", result.error)
      }
    } catch (error) {
      console.error('Error creating custom meditation session:', error)
    } finally {
      setGeneratingSession(false)
      setShowMoodMeditationModal(false)
    }
  }

  const openEditSessionModal = (session: any) => {
    setSelectedSession(session)
    setShowEditSessionModal(true)
  }

  const openDeleteSessionModal = (session: any) => {
    setSelectedSession(session)
    setShowDeleteSessionModal(true)
  }

  useEffect(() => {
    audioRef.current = new Audio()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (duration > 0) {
        setSessionProgress((audio.currentTime / duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setSessionProgress(100)
      logMeditationSession(true)
    }

    const handleError = (e: any) => {
      console.error('Audio error:', e)
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [currentSession, duration, email, volume, backgroundSound, moodBefore, moodAfter, pauseCount])

  return (
    <div className="w-full h-full space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meditation & Mindfulness
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">AI-powered meditation for mind, body, and soul</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Total Sessions</p>
              <p className="text-lg lg:text-2xl font-bold">{analytics?.totalSessions || 0}</p>
            </div>
            <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Minutes</p>
              <p className="text-lg lg:text-2xl font-bold">{Math.round(analytics?.totalMinutes || 0)}</p>
            </div>
            <Timer className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Completion Rate</p>
              <p className="text-lg lg:text-2xl font-bold">{Math.round(analytics?.averageCompletion || 0)}%</p>
            </div>
            <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Avg Rating</p>
              <p className="text-lg lg:text-2xl font-bold">{Math.round(analytics?.averageCompletion || 0)}</p>
            </div>
            <Target className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Mood-Based Meditation */}
      <Card className="dark-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Heart className="w-5 h-5 text-red-500" />
              Mood-Based Meditation
            </CardTitle>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={() => setShowMoodMeditationModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Session
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 mb-4">
            Generate personalized meditation with binaural beats based on your current mood and goals.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 h-auto p-4 flex-col"
            >
              <span className="text-2xl mb-2">😰</span>
              <span className="text-sm">Stressed</span>
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 h-auto p-4 flex-col"
            >
              <span className="text-2xl mb-2">😴</span>
              <span className="text-sm">Tired</span>
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 h-auto p-4 flex-col"
            >
              <span className="text-2xl mb-2">🎯</span>
              <span className="text-sm">Need Focus</span>
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 h-auto p-4 flex-col"
            >
              <span className="text-2xl mb-2">😊</span>
              <span className="text-sm">Happy</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sessions" className="space-y-4 lg:space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
          <TabsTrigger value="sessions" className="text-xs lg:text-sm">
            Sessions
          </TabsTrigger>
          <TabsTrigger value="custom" className="text-xs lg:text-sm">
            Custom Sessions
          </TabsTrigger>
          <TabsTrigger value="breathing" className="text-xs lg:text-sm">
            Breathing
          </TabsTrigger>

          <TabsTrigger value="analytics" className="text-xs lg:text-sm">
            Analytics
          </TabsTrigger>

        </TabsList>


        <TabsContent value="sessions" className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
              {meditationSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${session.color}`}></div>
                  <CardHeader className="p-4 lg:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl lg:text-3xl">{session.image}</span>
                        <div className="min-w-0">
                          <CardTitle className="text-base lg:text-lg truncate">{session.title}</CardTitle>
                          <CardDescription className="text-xs lg:text-sm">{session.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {session.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {session.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {session.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0">
                    <div className="space-y-3">
                      <div className="text-xs lg:text-sm text-gray-600">
                        <p>Instructor: {session.instructor}</p>
                        <p>
                          ⭐ {session.rating}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs lg:text-sm font-medium">Benefits:</p>
                        <div className="flex flex-wrap gap-1">
                          {session.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>


                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center text-lg lg:text-xl">
                    {currentSession ? meditationSessions.find((s) => s.id === currentSession)?.title : "Select a Session"}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {currentSession
                      ? meditationSessions.find((s) => s.id === currentSession)?.instructor
                      : "Choose from our AI-guided sessions"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentSession && (
                    <>
                      <div className="text-center">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-4xl lg:text-5xl">
                            {meditationSessions.find((s) => s.id === currentSession)?.image}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(sessionProgress)}%</span>
                          </div>
                          <Progress value={sessionProgress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}</span>
                            <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" size="icon" onClick={resetSession}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          onClick={isPlaying ? pauseSession : resumeSession}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 lg:w-6 lg:h-6" />
                          ) : (
                            <Play className="w-5 h-5 lg:w-6 lg:h-6" />
                          )}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setVoiceGuidance(!voiceGuidance)}>
                          {voiceGuidance ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="flex-1"
                            disabled={isMuted}
                          />
                          <span className="text-sm text-gray-500 min-w-[3rem]">{isMuted ? "Muted" : `${volume[0]}%`}</span>
                        </div>

                        <div className="text-center space-y-2">
                          <p className="text-sm text-gray-600">Breathing Guide</p>
                          <div className="flex justify-center gap-2 flex-wrap">
                            <Button
                              variant={breathingSession === '4-7-8' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setBreathingSession(breathingSession === '4-7-8' ? null : '4-7-8')}
                            >
                              <Brain className="w-3 h-3 mr-1" />
                              4-7-8
                            </Button>
                            <Button
                              variant={breathingSession === 'box' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setBreathingSession(breathingSession === 'box' ? null : 'box')}
                            >
                              <Target className="w-3 h-3 mr-1" />
                              Box
                            </Button>
                            <Button
                              variant={breathingSession === 'coherent' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setBreathingSession(breathingSession === 'coherent' ? null : 'coherent')}
                            >
                              <Heart className="w-3 h-3 mr-1" />
                              Coherent
                            </Button>
                          </div>
                        </div>

                        {/* Breathing Visualizer */}
                        {breathingSession && (
                          <div className="text-center space-y-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700">Breathing Guide Active</p>
                            <div className="relative w-24 h-24 mx-auto">
                              <div
                                className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ${breathingPhase === "inhale"
                                  ? "scale-110"
                                  : breathingPhase === "exhale"
                                    ? "scale-90"
                                    : "scale-100"
                                  }`}
                                style={{
                                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white">
                                  <p className="text-xs font-bold capitalize">{breathingPhase}</p>
                                  <p className="text-lg font-bold">{breathingCount}</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">
                              {breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)} for {breathingCount} seconds
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Session completion button */}
                      {sessionProgress >= 80 && (
                        <div className="text-center">
                          <Button
                            onClick={completeSession}
                            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          >
                            Complete Session
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {!currentSession && (
                    <div className="text-center space-y-4">
                      <p className="text-gray-600">Select a meditation session to begin</p>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        {meditationSessions.slice(0, 4).map((session) => (
                          <Button
                            key={session.id}
                            variant="outline"
                            size="sm"
                            onClick={() => startSession(session.id)}
                            className="justify-start"
                          >
                            <span className="mr-2">{session.image}</span>
                            {session.title}
                          </Button>
                        ))}
                      </div>

                      {/* Mood tracking before session */}
                      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium mb-2 text-white-500">How are you feeling right now?</p>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                            <Button
                              key={mood}
                              variant={moodBefore === mood ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setMoodBefore(mood)}
                              className="w-8 h-8 p-0"
                            >
                              {mood}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>


          </div>
        </TabsContent>
        <TabsContent value="custom" className="space-y-4 lg:space-y-6">
          {/* Header with generation status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Custom Sessions</h3>
              <p className="text-sm text-gray-600">AI-generated meditations based on your mood and preferences</p>
            </div>
            {generatingSession && (
              <div className="flex items-center gap-2 text-purple-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm">Generating session...</span>
              </div>
            )}
          </div>

          {loadingCustomSessions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your custom sessions...</p>
            </div>
          ) : customSessions.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Custom Sessions Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first personalized meditation session using the "Create Custom Session" button above.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={() => setShowMoodMeditationModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Session
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-6">
                {customSessions.map((session) => (
                  <Card key={session.sessionId} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <CardHeader className="p-4 lg:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-base lg:text-lg truncate">{session.sessionName}</CardTitle>
                            <CardDescription className="text-xs lg:text-sm">
                              Custom • {session.duration} min • Created {new Date(session.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </div>

                      {session.customData && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {session.customData.moodData?.label || session.customData.currentMood}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {session.customData.frequencyData?.range || session.customData.binauralFrequency}
                          </Badge>
                          {session.customData.includeGuidance && (
                            <Badge variant="outline" className="text-xs">
                              Guided
                            </Badge>
                          )}
                          {session.customData.includeBreathing && (
                            <Badge variant="outline" className="text-xs">
                              Breathing
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="p-4 lg:p-6 pt-0">
                      <div className="space-y-4">
                        {/* Session Details */}
                        {session.customData && (
                          <div className="space-y-2">
                            <div className="text-xs lg:text-sm text-gray-600">
                              <p><strong>Mood:</strong> {session.customData.moodData?.label} {session.customData.moodData?.emoji}</p>
                              <p><strong>Goals:</strong> {session.customData.selectedGoals?.join(', ')}</p>
                              {session.customData.personalIntention && (
                                <p><strong>Intention:</strong> {session.customData.personalIntention}</p>
                              )}
                            </div>

                            {session.customData.frequencyData && (
                              <div className="text-xs text-gray-500">
                                <p><strong>Frequency:</strong> {session.customData.frequencyData.description}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Audio Player
                      {session.audioUrl && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2 text-blue-500">
                            <span className="text-sm font-medium">Custom Meditation Audio</span>
                            <Badge variant="outline" className="text-xs text-black-500">
                              {session.completed ? 'Completed' : 'Ready to Play'}
                            </Badge>
                          </div>

                          <audio
                            controls
                            className="w-full"
                            preload="metadata"
                            onPlay={() => {
                              // Update session start time if not already started
                              if (!session.startTime) {
                                // Call API to update session start time
                                fetch('/api/meditation/stats', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    ...session,
                                    startTime: new Date(),
                                    userEmail: email
                                  })
                                }).catch(console.error)
                              }
                            }}
                            onEnded={() => {
                              // Mark session as completed
                              fetch('/api/meditation/stats', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  ...session,
                                  completed: true,
                                  endTime: new Date(),
                                  actualDuration: session.duration,
                                  userEmail: email
                                })
                              }).then(() => {
                                // Refresh stats and sessions
                                fetchMeditationStats()
                                fetchCustomSessions()
                              }).catch(console.error)
                            }}
                          >
                            <source src={session.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )} */}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {/* {session.audioUrl ? (
                            // <Button
                            //   size="sm"
                            //   className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            //   onClick={() => startCustomSession(session.sessionId)}
                            // >
                            //   <Play className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                            //   Start Session
                            // </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled className="flex-1">
                              <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                              Processing...
                            </Button>
                          )} */}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this custom session? This action cannot be undone.')) {
                                try {
                                  const response = await fetch(`/api/meditation/custom-session/delete?sessionId=${session.sessionId}&userEmail=${email}`, {
                                    method: 'DELETE'
                                  })

                                  const result = await response.json()

                                  if (result.success) {
                                    // Refresh custom sessions list
                                    await fetchCustomSessions()
                                    // Refresh stats
                                    await fetchMeditationStats()
                                    console.log('Custom session deleted successfully!')
                                  } else {
                                    console.error(`Failed to delete session: ${result.error}`)
                                  }
                                } catch (error) {
                                  console.error('Error deleting session:', error)
                                }
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Session Player */}
              <div>
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-center text-lg lg:text-xl">
                      {currentCustomSession
                        ? customSessions.find((s) => s.sessionId === currentCustomSession)?.sessionName
                        : "Select a Custom Session"}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {currentCustomSession
                        ? "AI-Generated Custom Meditation"
                        : "Choose from your personalized sessions"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentCustomSession && (
                      <>
                        <div className="text-center">
                          <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <Sparkles className="text-4xl lg:text-5xl text-white" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.round(customSessionProgress)}%</span>
                            </div>
                            <Progress value={customSessionProgress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{Math.floor(customCurrentTime / 60)}:{(Math.floor(customCurrentTime % 60)).toString().padStart(2, '0')}</span>
                              <span>{Math.floor(customDuration / 60)}:{(Math.floor(customDuration % 60)).toString().padStart(2, '0')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                          <Button variant="outline" size="icon" onClick={resetCustomSession}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            onClick={isCustomPlaying ? pauseCustomSession : resumeCustomSession}
                          >
                            {isCustomPlaying ? (
                              <Pause className="w-5 h-5 lg:w-6 lg:h-6" />
                            ) : (
                              <Play className="w-5 h-5 lg:w-6 lg:h-6" />
                            )}
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => setVoiceGuidance(!voiceGuidance)}>
                            {voiceGuidance ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => setIsCustomMuted(!isCustomMuted)}>
                              {isCustomMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                            <Slider
                              value={customVolume}
                              onValueChange={setCustomVolume}
                              max={100}
                              step={1}
                              className="flex-1"
                              disabled={isCustomMuted}
                            />
                            <span className="text-sm text-gray-500 min-w-[3rem]">{isCustomMuted ? "Muted" : `${customVolume[0]}%`}</span>
                          </div>

                          {/* Session Details */}
                          {(() => {
                            const session = customSessions.find(s => s.sessionId === currentCustomSession)
                            return session?.customData && (
                              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Session Details</p>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                  <div>
                                    <strong>Mood:</strong> {session.customData.moodData?.label} {session.customData.moodData?.emoji}
                                  </div>
                                  <div>
                                    <strong>Duration:</strong> {session.duration} min
                                  </div>
                                  <div>
                                    <strong>Frequency:</strong> {session.customData.frequencyData?.range}
                                  </div>
                                  <div>
                                    <strong>Features:</strong> {[
                                      session.customData.includeGuidance && 'Guided',
                                      session.customData.includeBreathing && 'Breathing'
                                    ].filter(Boolean).join(', ') || 'Pure Audio'}
                                  </div>
                                </div>
                                {session.customData.personalIntention && (
                                  <div className="mt-2 text-xs text-gray-600">
                                    <strong>Intention:</strong> {session.customData.personalIntention}
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                        </div>

                        {/* Session completion button */}
                        {customSessionProgress >= 80 && (
                          <div className="text-center">
                            <Button
                              onClick={completeCustomSession}
                              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                            >
                              Complete Session
                            </Button>
                          </div>
                        )}
                      </>
                    )}

                    {!currentCustomSession && (
                      <div className="text-center space-y-4">
                        <p className="text-gray-600">Select a custom meditation session to begin</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {customSessions.slice(0, 4).map((session) => (
                            <Button
                              key={session.sessionId}
                              variant="outline"
                              size="sm"
                              onClick={() => startCustomSession(session.sessionId)}
                              className="justify-start"
                              disabled={!session.audioUrl}
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              {session.sessionName}
                            </Button>
                          ))}
                        </div>

                        {/* Mood tracking before session */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-purple-800 to-pink-800 rounded-lg">
                          <p className="text-sm font-medium mb-2 text-white">How are you feeling right now?</p>
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                              <Button
                                key={mood}
                                variant={moodBefore === mood ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setMoodBefore(mood)}
                                className="w-8 h-8 p-0"
                              >
                                {mood}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="breathing" className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-6">

            <BreathingExercise />

          </div>
        </TabsContent>



        <TabsContent value="analytics" className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Weekly Progress
                </CardTitle>
                <CardDescription>Your meditation journey this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingAnalytics ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Loading analytics...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Sessions</p>
                        <p className="text-lg lg:text-2xl font-bold text-purple-600">
                          {analytics?.totalSessions || 0}
                        </p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Minutes</p>
                        <p className="text-lg lg:text-2xl font-bold text-blue-600">
                          {Math.round(analytics?.totalMinutes || 0)}
                        </p>
                        <p className="text-xs text-gray-500">Total time</p>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Completed</p>
                        <p className="text-lg lg:text-2xl font-bold text-green-600">
                          {analytics?.completedSessions || 0}
                        </p>
                        <p className="text-xs text-gray-500">Sessions</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recent Sessions</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {meditationLogs.slice(0, 5).map((log, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium">{log.sessionTitle}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(log.sessionDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={log.isCompleted ? 'default' : 'secondary'}>
                              {log.completionPercentage}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Mood Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <Heart className="w-5 h-5 text-red-500" />
                  Mood Insights
                </CardTitle>
                <CardDescription>How meditation affects your well-being</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingAnalytics ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Loading mood data...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Avg Improvement</p>
                        <p className="text-lg lg:text-2xl font-bold text-green-600">
                          +{(analytics?.averageMoodImprovement || 0).toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">Mood points</p>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Completion Rate</p>
                        <p className="text-lg lg:text-2xl font-bold text-blue-600">
                          {Math.round(analytics?.averageCompletion || 0)}%
                        </p>
                        <p className="text-xs text-gray-500">Average</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recent Mood Changes</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {meditationLogs
                          .filter(log => log.mood?.before && log.mood?.after)
                          .slice(0, 5)
                          .map((log, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-medium">{log.sessionTitle}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(log.sessionDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {log.mood.before} → {log.mood.after}
                                </p>
                                <p className="text-xs text-green-600">
                                  +{(log.mood.after - log.mood.before).toFixed(1)}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Moon className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-800">Sleep Quality</p>
                <p className="text-xs text-purple-700">Evening meditation improves your sleep quality by 40%</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {/* Mood Tracking Modal */}
      {showMoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center">How do you feel now?</CardTitle>
              <CardDescription className="text-center">
                Rate your mood after the meditation session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                  <Button
                    key={mood}
                    variant={moodAfter === mood ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMoodAfter(mood)}
                    className="w-8 h-8 p-0"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowMoodModal(false)
                    setMoodAfter(null)
                  }}
                >
                  Skip
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowMoodModal(false)
                    // Mood is already set, will be logged on next session
                  }}
                  disabled={!moodAfter}
                >
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add a floating action button for adding new sessions */}
      {/* <div className="fixed bottom-6 right-6 flex flex-col gap-2"> */}
      {/* <Button
          onClick={() => setShowAddSessionModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button> */}
      {/* <Button
          onClick={() => setShowAddWorkoutModal(true)}
          variant="outline"
          className="w-14 h-14 rounded-full shadow-lg"
        >
          // 
        </Button> */}
      {/* </div> */}

      {/* Add these modals at the end of the component, before the closing div */}
      <FormModal
        isOpen={showAddSessionModal}
        onClose={() => setShowAddSessionModal(false)}
        title="Create New Meditation Session"
      >
        <MeditationForm onSubmit={handleAddSession} onCancel={() => setShowAddSessionModal(false)} />
      </FormModal>

      <FormModal
        isOpen={showEditSessionModal}
        onClose={() => setShowEditSessionModal(false)}
        title="Edit Meditation Session"
      >
        <MeditationForm
          session={selectedSession}
          onSubmit={handleEditSession}
          onCancel={() => setShowEditSessionModal(false)}
        />
      </FormModal>

      <FormModal
        isOpen={showDeleteSessionModal}
        onClose={() => setShowDeleteSessionModal(false)}
        title="Delete Meditation Session"
      >
        <DeleteConfirmation
          title="Delete Meditation Session"
          message="Are you sure you want to delete this meditation session?"
          itemName={selectedSession?.title || ""}
          onConfirm={handleDeleteSession}
          onCancel={() => setShowDeleteSessionModal(false)}
        />
      </FormModal>

      <FormModal isOpen={showAddWorkoutModal} onClose={() => setShowAddWorkoutModal(false)} title="Create New Workout">
        <WorkoutForm onSubmit={handleAddWorkout} onCancel={() => setShowAddWorkoutModal(false)} />
      </FormModal>

      <FormModal
        isOpen={showMoodMeditationModal}
        onClose={() => setShowMoodMeditationModal(false)}
        title="Create Mood-Based Meditation"
      >
        <MoodMeditationForm onSubmit={handleMoodMeditation} onCancel={() => setShowMoodMeditationModal(false)} />
      </FormModal>
    </div>
  )
}
