"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  Camera,
  Play,
  Pause,
  Square,
  Eye,
  Activity,
  Timer,
  Target,
  Minimize2,
  Maximize2,
  History,
  RotateCcw,
  ArrowLeft,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Settings,
  CheckCircle,
  Clock,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Types
interface Exercise {
  name: string
  durationMinutes: number
  completed: boolean
  breaksTaken: number
  postureGuidance: string
}

interface WorkoutSession {
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
  breaks: Array<{ timestamp: Date; durationSeconds: number }>
  voiceGuidanceUsed: boolean
  aiMotivationPhrases: string[]
  notes: string
}

// Comprehensive Exercise library with MET values for calorie calculation
const EXERCISE_LIBRARY = {
  cardio: [
    { name: "Jumping Jacks", met: 8.0, guidance: "Keep your core engaged and land softly on your feet", category: "cardio" },
    { name: "High Knees", met: 8.5, guidance: "Drive your knees up high and pump your arms", category: "cardio" },
    { name: "Burpees", met: 8.0, guidance: "Keep your back straight in plank position", category: "cardio" },
    { name: "Mountain Climbers", met: 8.0, guidance: "Keep your hips level and core tight", category: "cardio" },
    { name: "Running in Place", met: 8.0, guidance: "Lift your knees and stay light on your feet", category: "cardio" },
    { name: "Jump Rope", met: 12.3, guidance: "Keep your elbows close to your body and jump on the balls of your feet", category: "cardio" },
    { name: "Dancing", met: 7.3, guidance: "Move to the rhythm and let your body flow naturally", category: "cardio" },
    { name: "Step-ups", met: 9.0, guidance: "Step up with full foot contact and control the descent", category: "cardio" }
  ],
  strength: [
    { name: "Push-ups", met: 3.8, guidance: "Keep your back straight and core engaged", category: "strength" },
    { name: "Squats", met: 5.0, guidance: "Keep your chest up and knees behind your toes", category: "strength" },
    { name: "Lunges", met: 4.0, guidance: "Step forward and lower your back knee toward the ground", category: "strength" },
    { name: "Plank", met: 3.8, guidance: "Keep your body in a straight line from head to heels", category: "strength" },
    { name: "Crunches", met: 3.8, guidance: "Keep your lower back pressed to the floor", category: "strength" },
    { name: "Pull-ups", met: 8.0, guidance: "Pull your chest to the bar with controlled movement", category: "strength" },
    { name: "Dips", met: 5.0, guidance: "Lower your body until your arms are at 90 degrees", category: "strength" },
    { name: "Wall Sit", met: 4.0, guidance: "Keep your back flat against the wall and thighs parallel to floor", category: "strength" },
    { name: "Pike Push-ups", met: 4.5, guidance: "Form an inverted V and push up focusing on shoulders", category: "strength" },
    { name: "Single-leg Glute Bridge", met: 3.5, guidance: "Squeeze glutes and keep hips level", category: "strength" }
  ],
  flexibility: [
    { name: "Stretching", met: 2.3, guidance: "Hold each stretch for 15-30 seconds", category: "flexibility" },
    { name: "Yoga Flow", met: 3.0, guidance: "Focus on your breathing and smooth transitions", category: "flexibility" },
    { name: "Dynamic Stretching", met: 3.5, guidance: "Move through your full range of motion", category: "flexibility" },
    { name: "Pilates", met: 3.7, guidance: "Focus on core engagement and precise movements", category: "flexibility" }
  ],
  bodyweight: [
    { name: "Bear Crawl", met: 7.0, guidance: "Keep your core tight and move opposite hand and foot together", category: "bodyweight" },
    { name: "Crab Walk", met: 5.0, guidance: "Keep hips up and move in controlled steps", category: "bodyweight" },
    { name: "Inchworm", met: 4.5, guidance: "Walk hands out to plank, then walk feet to hands", category: "bodyweight" },
    { name: "Superman", met: 2.5, guidance: "Lift chest and legs simultaneously, hold briefly", category: "bodyweight" },
    { name: "Dead Bug", met: 2.8, guidance: "Keep lower back pressed to floor while moving limbs", category: "bodyweight" },
    { name: "Bird Dog", met: 2.5, guidance: "Extend opposite arm and leg while keeping core stable", category: "bodyweight" }
  ],
  endurance: [
    { name: "Tabata Squats", met: 9.8, guidance: "20 seconds all-out, 10 seconds rest", category: "endurance" },
    { name: "Sprint Intervals", met: 15.3, guidance: "Maximum effort for short bursts", category: "endurance" },
    { name: "Circuit Training", met: 8.0, guidance: "Move quickly between exercises with minimal rest", category: "endurance" },
    { name: "Stair Climbing", met: 8.8, guidance: "Use full foot on each step, pump your arms", category: "endurance" },
    { name: "Shadow Boxing", met: 7.8, guidance: "Keep moving, throw combinations with proper form", category: "endurance" }
  ],
  core: [
    { name: "Russian Twists", met: 3.8, guidance: "Rotate from your core, not just your arms", category: "core" },
    { name: "Bicycle Crunches", met: 4.0, guidance: "Bring elbow to opposite knee with control", category: "core" },
    { name: "Mountain Climber Twists", met: 8.5, guidance: "Bring knee to opposite elbow in plank position", category: "core" },
    { name: "Hollow Body Hold", met: 3.5, guidance: "Press lower back to floor and hold position", category: "core" },
    { name: "V-ups", met: 4.2, guidance: "Reach hands to feet while keeping legs straight", category: "core" },
    { name: "Side Plank", met: 3.8, guidance: "Keep body in straight line from head to feet", category: "core" }
  ]
}

// Workout type calorie multipliers
const WORKOUT_TYPE_MULTIPLIERS = {
  cardio: 1.2,
  strength: 0.9,
  flexibility: 0.7,
  bodyweight: 1.0,
  endurance: 1.4,
  core: 0.8,
  mixed: 1.0
}

const MOTIVATION_PHRASES = [
  "Push harder!", "Almost done!", "You've got this!", "Keep going!", "Stay strong!",
  "Feel the burn!", "One more rep!", "Don't give up!", "You're crushing it!", "Power through!"
]

export default function StandardModePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // URL Parameters
  const sessionType = searchParams.get('sessionType') as "Global" | "Custom" | "Regular" || "Regular"
  const workoutType = searchParams.get('workout')
  const duration = searchParams.get('duration')
  const exercisesParam = searchParams.get('exercises')
  const title = searchParams.get('title') || "Workout Session"

  // State Management
  const [currentPhase, setCurrentPhase] = useState<'setup' | 'workout' | 'rest' | 'completed'>('setup')
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [restTimeRemaining, setRestTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [caloriesBurned, setCaloriesBurned] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)

  // Setup State
  const [restDuration, setRestDuration] = useState(30)
  const [intervalType, setIntervalType] = useState<"Fixed" | "Reps">("Fixed")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [customExercises, setCustomExercises] = useState<Array<{ name: string, duration: number }>>([])

  // Session Data
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null)
  const [breaks, setBreaks] = useState<Array<{ timestamp: Date; durationSeconds: number }>>([])
  const [motivationPhrasesUsed, setMotivationPhrasesUsed] = useState<string[]>([])

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const restTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize exercises based on session type
  useEffect(() => {
    if (sessionType === "Global" && workoutType && duration) {
      const durationNum = parseInt(duration)
      const exerciseList = EXERCISE_LIBRARY[workoutType as keyof typeof EXERCISE_LIBRARY] || EXERCISE_LIBRARY.cardio
      const exerciseDuration = durationNum / exerciseList.length

      const sessionExercises: Exercise[] = exerciseList.map(ex => ({
        name: ex.name,
        durationMinutes: exerciseDuration,
        completed: false,
        breaksTaken: 0,
        postureGuidance: ex.guidance
      }))

      setExercises(sessionExercises)
    } else if (sessionType === "Custom" && exercisesParam) {
      const exerciseNames = exercisesParam.split(',')
      const sessionExercises: Exercise[] = exerciseNames.map(name => ({
        name: name.trim(),
        durationMinutes: 2, // Default duration, can be customized
        completed: false,
        breaksTaken: 0,
        postureGuidance: "Focus on proper form and breathing"
      }))

      setExercises(sessionExercises)
    }
  }, [sessionType, workoutType, duration, exercisesParam])

  // Voice synthesis
  const speak = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined') return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  // Get user weight from profile or use default (70kg)
  const [userWeight, setUserWeight] = useState(70)

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.weight) {
            setUserWeight(data.weight)
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    fetchUserProfile()
  }, [])

  // Calculate calories burned with workout type consideration
  const calculateCalories = (exerciseName: string, durationMinutes: number, workoutCategory?: string) => {
    // Default values
    let met = 5.0 // Default MET value for light activity
    let category = workoutCategory || 'mixed'
    let exerciseData = null

    // Find exercise data including MET value and category
    for (const [cat, exercises] of Object.entries(EXERCISE_LIBRARY)) {
      const found = exercises.find(ex => ex.name === exerciseName)
      if (found) {
        exerciseData = found
        category = cat
        break
      }
    }

    // Use exercise-specific MET if available, otherwise use default
    met = exerciseData?.met || met
    
    // Get multiplier for this workout type
    const multiplier = WORKOUT_TYPE_MULTIPLIERS[category as keyof typeof WORKOUT_TYPE_MULTIPLIERS] || 1.0
    
    // Standard calorie calculation formula: (MET * 3.5 * weight in kg * duration in hours) / 200
    const hours = durationMinutes / 60
    const baseCalories = (met * 3.5 * userWeight * hours) / 200
    
    // Apply workout type multiplier and round to nearest integer
    const adjustedCalories = Math.round(baseCalories * multiplier * 100) / 100 // Round to 2 decimal places
    
    return adjustedCalories > 0 ? adjustedCalories : 0
  }

  // Calculate total calories for all completed exercises
  const calculateTotalCalories = (exercises: Exercise[]) => {
    return exercises.reduce((total, exercise) => {
      if (exercise.completed) {
        return total + calculateCalories(exercise.name, exercise.durationMinutes)
      }
      return total
    }, 0)
  }

  // Get all exercises as flat array for dropdown
  const getAllExercises = () => {
    const allExercises: Array<{name: string, met: number, guidance: string, category: string}> = []
    Object.values(EXERCISE_LIBRARY).forEach(categoryExercises => {
      allExercises.push(...categoryExercises)
    })
    return allExercises.sort((a, b) => a.name.localeCompare(b.name))
  }

  // Timer functions
  const startExerciseTimer = () => {
    const exercise = exercises[currentExerciseIndex]
    if (!exercise) return

    setTimeRemaining(exercise.durationMinutes * 60)
    setCurrentPhase('workout')

    speak(`Starting ${exercise.name}`)

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          completeExercise()
          return 0
        }

        // Voice cues
        if (prev === Math.floor(exercise.durationMinutes * 30)) {
          speak("Halfway there!")
          speak(exercise.postureGuidance)
        } else if (prev === 5) {
          speak("5 seconds left")
        } else if (prev === 1) {
          speak("Stop and rest")
        }

        return prev - 1
      })
    }, 1000)
  }

  const completeExercise = () => {
    const updatedExercises = [...exercises]
    updatedExercises[currentExerciseIndex].completed = true
    setExercises(updatedExercises)

    // Calculate calories for this exercise
    const calories = calculateCalories(
      exercises[currentExerciseIndex].name,
      exercises[currentExerciseIndex].durationMinutes
    )
    setCaloriesBurned(prev => prev + calories)

    // Add motivation
    const randomPhrase = MOTIVATION_PHRASES[Math.floor(Math.random() * MOTIVATION_PHRASES.length)]
    setMotivationPhrasesUsed(prev => [...prev, randomPhrase])
    speak(randomPhrase)

    // Check if workout is complete
    if (currentExerciseIndex >= exercises.length - 1) {
      completeWorkout()
    } else {
      startRestTimer()
    }
  }

  const startRestTimer = () => {
    setCurrentPhase('rest')
    setRestTimeRemaining(restDuration)

    speak(`Rest for ${restDuration} seconds`)

    restTimerRef.current = setInterval(() => {
      setRestTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current!)
          setCurrentExerciseIndex(prevIndex => prevIndex + 1)
          return 0
        }

        if (prev === 5) {
          speak("5 seconds left")
        } else if (prev === 1) {
          speak("Get ready for the next exercise")
        }

        return prev - 1
      })
    }, 1000)
  }

  const completeWorkout = () => {
    setCurrentPhase('completed')
    speak("Workout completed! Great job!")

    // Recalculate total calories for all completed exercises
    const totalCalories = calculateTotalCalories(exercises)
    setCaloriesBurned(totalCalories)

    // Save session to database
    saveWorkoutSession()
  }

  const saveWorkoutSession = async () => {
    if (!sessionStartTime) return

    // Calculate actual duration in minutes
    const endTime = new Date()
    const durationMinutes = Math.round((endTime.getTime() - sessionStartTime.getTime()) / (1000 * 60))

    const session: WorkoutSession = {
      userEmail: "user@example.com", // TODO: Replace with actual user email from auth context
      sessionType,
      title: title || `${workoutType || 'Custom'} Workout`,
      workoutType: workoutType || 'mixed',
      totalDurationMinutes: durationMinutes,
      startTime: sessionStartTime,
      endTime,
      caloriesBurned: calculateTotalCalories(exercises),
      restDurationSeconds: restDuration,
      intervalType,
      exercises: exercises.map(ex => ({
        ...ex,
        caloriesBurned: calculateCalories(ex.name, ex.durationMinutes)
      })),
      breaks,
      voiceGuidanceUsed: isVoiceEnabled,
      aiMotivationPhrases: motivationPhrasesUsed,
      notes: `Completed ${exercises.filter(e => e.completed).length} of ${exercises.length} exercises`
    }

    try {
      // API call to save session
      const response = await fetch('/api/workout-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      })

      if (response.ok) {
        toast({
          title: "Workout Saved",
          description: "Your workout session has been logged successfully!"
        })
      }
    } catch (error) {
      console.error('Error saving workout session:', error)
      toast({
        title: "Save Error",
        description: "Failed to save workout session. Please try again.",
        variant: "destructive"
      })
    }
  }

  const pauseWorkout = () => {
    setIsPaused(true)
    if (timerRef.current) clearInterval(timerRef.current)
    if (restTimerRef.current) clearInterval(restTimerRef.current)
    speak("Workout paused")
  }

  const resumeWorkout = () => {
    setIsPaused(false)
    if (currentPhase === 'workout') {
      resumeExerciseTimer()
    } else if (currentPhase === 'rest') {
      resumeRestTimer()
    }
    speak("Resuming workout")
  }

  const resumeExerciseTimer = () => {
    const exercise = exercises[currentExerciseIndex]
    if (!exercise) return

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          completeExercise()
          return 0
        }
        
        // Voice cues
        if (prev === Math.floor(exercise.durationMinutes * 30)) {
          speak("Halfway there!")
          speak(exercise.postureGuidance)
        } else if (prev === 5) {
          speak("5 seconds left")
        } else if (prev === 1) {
          speak("Stop and rest")
        }
        
        return prev - 1
      })
    }, 1000)
  }

  const resumeRestTimer = () => {
    restTimerRef.current = setInterval(() => {
      setRestTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current!)
          setCurrentExerciseIndex(prevIndex => prevIndex + 1)
          return 0
        }
        
        if (prev === 5) {
          speak("5 seconds left")
        } else if (prev === 1) {
          speak("Get ready for the next exercise")
        }
        
        return prev - 1
      })
    }, 1000)
  }

  const takeBreak = () => {
    const breakStart = new Date()
    pauseWorkout()

    // Log break (simplified - would typically have a break duration dialog)
    setTimeout(() => {
      const breakEnd = new Date()
      const breakDuration = (breakEnd.getTime() - breakStart.getTime()) / 1000
      setBreaks(prev => [...prev, { timestamp: breakStart, durationSeconds: breakDuration }])

      // Update exercise break count
      const updatedExercises = [...exercises]
      updatedExercises[currentExerciseIndex].breaksTaken += 1
      setExercises(updatedExercises)

      resumeWorkout()
    }, 30000) // 30 second break
  }

  const startWorkout = () => {
    setSessionStartTime(new Date())
    setCurrentExerciseIndex(0)
    startExerciseTimer()
  }

  const addCustomExercise = () => {
    setCustomExercises(prev => [...prev, { name: "", duration: 2 }])
  }

  const updateCustomExercise = (index: number, field: 'name' | 'duration', value: string | number) => {
    const updated = [...customExercises]
    updated[index] = { ...updated[index], [field]: value }
    setCustomExercises(updated)
  }

  const removeCustomExercise = (index: number) => {
    setCustomExercises(prev => prev.filter((_, i) => i !== index))
  }

  const finalizeCustomExercises = () => {
    const allExercises = getAllExercises()
    const sessionExercises: Exercise[] = customExercises
      .filter(ex => ex.name.trim())
      .map(ex => {
        const exerciseData = allExercises.find(e => e.name === ex.name)
        return {
          name: ex.name,
          durationMinutes: ex.duration,
          completed: false,
          breaksTaken: 0,
          postureGuidance: exerciseData?.guidance || "Focus on proper form and breathing"
        }
      })

    setExercises(sessionExercises)
  }

  // Auto-start next exercise after rest
  useEffect(() => {
    if (currentPhase === 'rest' && restTimeRemaining === 0 && currentExerciseIndex < exercises.length) {
      startExerciseTimer()
    }
  }, [restTimeRemaining, currentPhase, currentExerciseIndex])

  // Render setup phase
  if (currentPhase === 'setup') {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 space-y-6 max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Pre-Session Setup</h1>
            <div />
          </div>

          {/* Session Details */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-blue-500">Session Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-blue-500">
                <div>
                  <Label>Session Type</Label>
                  <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                    {sessionType}
                  </Badge>
                </div>
                <div>
                  <Label>Title</Label>
                  <p className="text-sm text-gray-600">{title}</p>
                </div>
                {workoutType && (
                  <div>
                    <Label>Workout Type</Label>
                    <Badge variant="outline" className="ml-2 border-blue-300">
                      {workoutType}
                    </Badge>
                  </div>
                )}
                {duration && (
                  <div>
                    <Label>Duration</Label>
                    <p className="text-sm text-gray-600">{duration} minutes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Exercises List */}
          {(sessionType === "Global" || sessionType === "Custom") && exercises.length > 0 && (
            <Card className="border border-blue-100">
              <CardHeader>
                <CardTitle>Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b last:border-b-0 border-blue-100"
                    >
                      <span>{exercise.name}</span>
                      <Badge variant="outline" className="border-blue-300">
                        {exercise.durationMinutes.toFixed(1)} min
                      </Badge>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Custom Exercise Builder */}
          {sessionType === "Regular" && (
            <Card className="border border-blue-100">
              <CardHeader>
                <CardTitle>Build Your Workout</CardTitle>
                <p className="text-sm text-gray-600">Choose from our comprehensive exercise library</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customExercises.map((exercise, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Select
                        value={exercise.name}
                        onValueChange={(value) => updateCustomExercise(index, 'name', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select exercise" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {Object.entries(EXERCISE_LIBRARY).map(([category, exercises]) => (
                            <div key={category}>
                              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                {category}
                              </div>
                              {exercises.map((ex) => (
                                <SelectItem key={ex.name} value={ex.name}>
                                  <div className="flex items-center gap-2">
                                    <span>{ex.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {ex.met} MET
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Duration (min)"
                        value={exercise.duration}
                        onChange={(e) =>
                          updateCustomExercise(index, 'duration', parseInt(e.target.value) || 0)
                        }
                        className="w-32"
                        min="0.5"
                        max="60"
                        step="0.5"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCustomExercise(index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addCustomExercise}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                  {customExercises.length > 0 && (
                    <Button
                      onClick={finalizeCustomExercises}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      Confirm Exercises ({customExercises.filter(ex => ex.name.trim()).length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workout Settings */}
          <Card className="border-2 border-blue-200 text-blue-500 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle>Workout Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rest-duration">Rest Duration (seconds)</Label>
                  <Input
                    id="rest-duration"
                    type="number"
                    value={restDuration}
                    onChange={(e) => setRestDuration(parseInt(e.target.value) || 30)}
                    min="10"
                    max="300"
                  />
                </div>
                <div>
                  <Label htmlFor="interval-type">Interval Type</Label>
                  <Select
                    value={intervalType}
                    onValueChange={(value: "Fixed" | "Reps") => setIntervalType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fixed">Fixed Time</SelectItem>
                      <SelectItem value="Reps">Reps-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className="flex items-center gap-2"
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Voice Guidance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={startWorkout}
              disabled={exercises.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          </div>
          </div>
        </div>
      </div>
    )
  }

  // Render workout phase
  if (currentPhase === 'workout' || currentPhase === 'rest') {
    const currentExercise = exercises[currentExerciseIndex]
    const totalProgress =
      ((currentExerciseIndex + (currentPhase === 'workout' ? 1 : 0)) / exercises.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {currentExerciseIndex + 1} / {exercises.length}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className="flex items-center gap-2"
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Voice
              </Button>
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              {currentPhase === 'workout' ? 'Exercise' : 'Rest'}
            </h1>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">{caloriesBurned} cal</span>
            </div>
          </div>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Session Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Overall</span>
                <span className="text-sm font-medium">{Math.round(totalProgress)}%</span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Main Timer Card */}
          <Card className="shadow-lg border border-indigo-200">
            <CardContent className="pt-6 text-center space-y-4">
              {currentPhase === 'workout' ? (
                <>
                  <h2 className="text-3xl font-bold text-gray-800">{currentExercise?.name}</h2>
                  <div className="text-6xl font-extrabold text-indigo-600 tracking-wider">
                    {Math.floor(timeRemaining / 60)}:
                    {(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-gray-600">{currentExercise?.postureGuidance}</p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-800">Rest Time</h2>
                  <div className="text-6xl font-extrabold text-purple-600 tracking-wider">
                    {Math.floor(restTimeRemaining / 60)}:
                    {(restTimeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-gray-600">
                    Next: {exercises[currentExerciseIndex + 1]?.name || 'Workout Complete'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={isPaused ? resumeWorkout : pauseWorkout}
              variant={isPaused ? 'default' : 'outline'}
              size="lg"
              className="h-16"
            >
              {isPaused ? <Play className="w-6 h-6 mr-2" /> : <Pause className="w-6 h-6 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={takeBreak}
              variant="outline"
              size="lg"
              className="h-16"
              disabled={isPaused}
            >
              <Clock className="w-6 h-6 mr-2" />
              Take Break
            </Button>
          </div>

          {/* Emergency Stop */}
          <Button
            onClick={() => setCurrentPhase('completed')}
            variant="destructive"
            className="w-full"
          >
            <Square className="w-4 h-4 mr-2" />
            End Workout
          </Button>
        </div>
      </div>
    )
  }


  // Render completion phase
  if (currentPhase === 'completed') {
    const totalDuration = exercises.reduce((sum, ex) => sum + ex.durationMinutes, 0)
    const completedExercises = exercises.filter(ex => ex.completed).length

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Workout Complete!</h1>
            <p className="text-gray-600">Great job on finishing your session</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="pt-6 text-center">
                <Timer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalDuration.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="pt-6 text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{caloriesBurned}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="pt-6 text-center">
                <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{completedExercises}</div>
                <div className="text-sm text-gray-600">Exercises</div>
              </CardContent>
            </Card>
          </div>

          {/* Exercise Summary */}
          <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle>Exercise Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                {exercises.map((exercise, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0 border-blue-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${exercise.completed ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>{exercise.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{exercise.durationMinutes.toFixed(1)} min</div>
                      {exercise.breaksTaken > 0 && (
                        <div className="text-xs text-gray-500">{exercise.breaksTaken} breaks</div>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Motivation Summary */}
          {motivationPhrasesUsed.length > 0 && (
            <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle>Motivation Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {motivationPhrasesUsed.map((phrase, index) => (
                    <Badge key={index} variant="outline" className="border-purple-300 text-purple-700">
                      {phrase}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Workout
            </Button>
          </div>
        </div>
      </div>
    )
  }


  // Default fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
        <p className="text-gray-600">Preparing your workout session</p>
      </div>
    </div>

  )
}
