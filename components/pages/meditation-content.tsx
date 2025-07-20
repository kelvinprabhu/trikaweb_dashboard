"use client"

import { useState, useEffect } from "react"
import {
  Play,
  Pause,
  RotateCcw,
  Heart,
  Brain,
  Moon,
  Wind,
  Waves,
  Volume2,
  VolumeX,
  Timer,
  Target,
  TrendingUp,
  Sparkles,
  Mic,
  MicOff,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

// Add these imports at the top
import { FormModal } from "@/components/forms/form-modal"
import { MeditationForm } from "@/components/forms/meditation-form"
import { WorkoutForm } from "@/components/forms/workout-form"
import { DeleteConfirmation } from "@/components/forms/delete-confirmation"
import { MoodMeditationForm } from "@/components/forms/mood-meditation-form"

const meditationSessions = [
  {
    id: 1,
    title: "Morning Mindfulness",
    description: "Start your day with clarity and focus",
    duration: "10 min",
    category: "Mindfulness",
    difficulty: "Beginner",
    instructor: "AI Guide Sarah",
    image: "🌅",
    color: "from-orange-400 to-pink-400",
    benefits: ["Reduces stress", "Improves focus", "Boosts energy"],
    completions: 24,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Deep Sleep Journey",
    description: "Drift into peaceful, restorative sleep",
    duration: "20 min",
    category: "Sleep",
    difficulty: "Beginner",
    instructor: "AI Guide Luna",
    image: "🌙",
    color: "from-indigo-400 to-purple-400",
    benefits: ["Better sleep quality", "Reduces anxiety", "Calms mind"],
    completions: 18,
    rating: 4.9,
  },
  {
    id: 3,
    title: "Stress Relief Breathing",
    description: "Release tension with guided breathing",
    duration: "15 min",
    category: "Breathing",
    difficulty: "Intermediate",
    instructor: "AI Guide Zen",
    image: "🌬️",
    color: "from-cyan-400 to-blue-400",
    benefits: ["Lowers blood pressure", "Reduces cortisol", "Improves mood"],
    completions: 31,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Focus Enhancement",
    description: "Sharpen your concentration and mental clarity",
    duration: "12 min",
    category: "Focus",
    difficulty: "Intermediate",
    instructor: "AI Guide Focus",
    image: "🎯",
    color: "from-green-400 to-teal-400",
    benefits: ["Enhances concentration", "Boosts productivity", "Clears mental fog"],
    completions: 15,
    rating: 4.6,
  },
]

const breathingExercises = [
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

const moodData = [
  { date: "Mon", mood: 7, energy: 6, stress: 3 },
  { date: "Tue", mood: 8, energy: 7, stress: 2 },
  { date: "Wed", mood: 6, energy: 5, stress: 5 },
  { date: "Thu", mood: 9, energy: 8, stress: 1 },
  { date: "Fri", mood: 8, energy: 7, stress: 2 },
  { date: "Sat", mood: 9, energy: 9, stress: 1 },
  { date: "Sun", mood: 8, energy: 8, stress: 2 },
]

const aiRecommendations = [
  {
    title: "Stress Relief Session",
    reason: "Your stress levels seem elevated today",
    session: "Deep Breathing for Anxiety",
    duration: "8 min",
    confidence: 92,
  },
  {
    title: "Energy Boost",
    reason: "Based on your sleep data, you might need energizing",
    session: "Morning Activation",
    duration: "6 min",
    confidence: 87,
  },
  {
    title: "Focus Enhancement",
    reason: "You have important tasks scheduled today",
    session: "Concentration Meditation",
    duration: "12 min",
    confidence: 89,
  },
]

export function MeditationContent() {
  // Add state for modals in the component
  const [showAddSessionModal, setShowAddSessionModal] = useState(false)
  const [showEditSessionModal, setShowEditSessionModal] = useState(false)
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false)
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [showMoodMeditationModal, setShowMoodMeditationModal] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSession, setCurrentSession] = useState<number | null>(null)
  const [sessionProgress, setSessionProgress] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState("inhale")
  const [breathingCount, setBreathingCount] = useState(4)
  const [voiceGuidance, setVoiceGuidance] = useState(true)

  // Simulate session progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentSession) {
      interval = setInterval(() => {
        setSessionProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            setCurrentSession(null)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentSession])

  // Breathing exercise animation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingCount((prev) => {
          if (prev <= 1) {
            setBreathingPhase((phase) => {
              if (phase === "inhale") return "hold"
              if (phase === "hold") return "exhale"
              return "inhale"
            })
            return 4
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [breathingActive])

  const startSession = (sessionId: number) => {
    setCurrentSession(sessionId)
    setIsPlaying(true)
    setSessionProgress(0)
  }

  const pauseSession = () => {
    setIsPlaying(false)
  }

  const resetSession = () => {
    setIsPlaying(false)
    setSessionProgress(0)
    setCurrentSession(null)
  }

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

  const handleMoodMeditation = (data: any) => {
    console.log("Creating mood-based meditation:", data)
    setShowMoodMeditationModal(false)
    // Here you would integrate with binaural beat generation API
  }

  const openEditSessionModal = (session: any) => {
    setSelectedSession(session)
    setShowEditSessionModal(true)
  }

  const openDeleteSessionModal = (session: any) => {
    setSelectedSession(session)
    setShowDeleteSessionModal(true)
  }

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
              <p className="text-lg lg:text-2xl font-bold">{meditationStats.totalSessions}</p>
            </div>
            <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Minutes</p>
              <p className="text-lg lg:text-2xl font-bold">{meditationStats.totalMinutes}</p>
            </div>
            <Timer className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Current Streak</p>
              <p className="text-lg lg:text-2xl font-bold">{meditationStats.currentStreak}</p>
            </div>
            <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Avg Rating</p>
              <p className="text-lg lg:text-2xl font-bold">{meditationStats.averageRating}</p>
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

      <Tabs defaultValue="sessions" className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="sessions" className="text-xs lg:text-sm">
            Sessions
          </TabsTrigger>
          <TabsTrigger value="breathing" className="text-xs lg:text-sm">
            Breathing
          </TabsTrigger>
          <TabsTrigger value="ai-coach" className="text-xs lg:text-sm">
            AI Coach
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs lg:text-sm">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="player" className="text-xs lg:text-sm hidden lg:block">
            Player
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
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
                        Completed: {session.completions} times • ⭐ {session.rating}
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

                    {/* Add edit/delete options to session cards by updating the "Start" button section */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={() => startSession(session.id)}
                      >
                        <Play className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        Start
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditSessionModal(session)}>
                        <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openDeleteSessionModal(session)}>
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breathing" className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Breathing Exercises */}
            <div className="space-y-4">
              <h3 className="text-lg lg:text-xl font-semibold">Breathing Exercises</h3>
              {breathingExercises.map((exercise) => (
                <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-sm lg:text-base">{exercise.name}</h4>
                        <p className="text-xs lg:text-sm text-gray-600">{exercise.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Duration: {exercise.duration}</p>
                      </div>
                      <Wind className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-500" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-xs lg:text-sm font-medium">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      onClick={() => setBreathingActive(!breathingActive)}
                    >
                      {breathingActive ? (
                        <Pause className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      ) : (
                        <Play className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      )}
                      {breathingActive ? "Pause" : "Start"} Exercise
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Breathing Visualizer */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Breathing Guide</CardTitle>
                <CardDescription>Follow the visual guide for your breathing exercise</CardDescription>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ${
                        breathingActive && breathingPhase === "inhale"
                          ? "scale-110"
                          : breathingActive && breathingPhase === "exhale"
                            ? "scale-90"
                            : "scale-100"
                      }`}
                      style={{
                        boxShadow: breathingActive ? "0 0 30px rgba(59, 130, 246, 0.5)" : "none",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <p className="text-lg lg:text-xl font-bold capitalize">{breathingPhase}</p>
                        <p className="text-2xl lg:text-3xl font-bold">{breathingCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-sm lg:text-base font-medium">
                      {breathingActive
                        ? `${breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)} for ${breathingCount} seconds`
                        : "Press start to begin"}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" onClick={() => setBreathingActive(!breathingActive)}>
                        {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBreathingActive(false)
                          setBreathingPhase("inhale")
                          setBreathingCount(4)
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-coach" className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions based on your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="p-3 lg:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm lg:text-base">{rec.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {rec.confidence}% match
                      </Badge>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600 mb-2">{rec.reason}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{rec.session}</p>
                        <p className="text-xs text-gray-500">{rec.duration}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Try Now
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mood Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Mood & Wellness Tracking</CardTitle>
                <CardDescription>Track your emotional well-being</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">Mood</p>
                    <p className="text-lg lg:text-2xl font-bold text-green-600">8.2</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">Energy</p>
                    <p className="text-lg lg:text-2xl font-bold text-blue-600">7.4</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600">Stress</p>
                    <p className="text-lg lg:text-2xl font-bold text-red-600">2.3</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Weekly Trend</p>
                  <div className="flex justify-between items-end h-20">
                    {moodData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div
                          className="w-3 lg:w-4 bg-gradient-to-t from-green-400 to-green-600 rounded-t"
                          style={{ height: `${day.mood * 6}px` }}
                        />
                        <span className="text-xs text-gray-500">{day.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Log Today's Mood
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Meditation Progress</CardTitle>
                <CardDescription>Your meditation journey over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Goal Progress</span>
                    <span>5/7 sessions</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg lg:text-xl font-bold text-purple-600">{meditationStats.longestStreak}</p>
                    <p className="text-xs lg:text-sm text-gray-600">Longest Streak</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg lg:text-xl font-bold text-blue-600">
                      {Math.round(meditationStats.totalMinutes / 60)}h
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600">Total Hours</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Favorite Categories</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mindfulness</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-xs text-gray-500">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sleep</span>
                      <div className="flex items-center gap-2">
                        <Progress value={65} className="w-20 h-2" />
                        <span className="text-xs text-gray-500">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Breathing</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20 h-2" />
                        <span className="text-xs text-gray-500">45%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Wellness Insights</CardTitle>
                <CardDescription>AI-powered insights from your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Positive Trend</p>
                        <p className="text-xs text-green-700">Your stress levels have decreased by 30% this month</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Focus Improvement</p>
                        <p className="text-xs text-blue-700">Morning sessions boost your focus by 25% on average</p>
                      </div>
                    </div>
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
                </div>

                <Button className="w-full" variant="outline">
                  View Detailed Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="player" className="space-y-4 lg:space-y-6">
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
                        <span>{sessionProgress}%</span>
                      </div>
                      <Progress value={sessionProgress} className="h-2" />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon" onClick={resetSession}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={isPlaying ? pauseSession : () => setIsPlaying(true)}
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
                      <p className="text-sm text-gray-600">Background Sounds</p>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Waves className="w-3 h-3 mr-1" />
                          Ocean
                        </Button>
                        <Button variant="outline" size="sm">
                          <Wind className="w-3 h-3 mr-1" />
                          Forest
                        </Button>
                        <Button variant="outline" size="sm">
                          Rain
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!currentSession && (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">Select a meditation session to begin</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add a floating action button for adding new sessions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Button
          onClick={() => setShowAddSessionModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
        <Button
          onClick={() => setShowAddWorkoutModal(true)}
          variant="outline"
          className="w-14 h-14 rounded-full shadow-lg"
        >
          💪
        </Button>
      </div>

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
