import { useEffect, useRef, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

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

export default function BreathingComponent() {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)
  const [phase, setPhase] = useState<Phase>("inhale")
  const [count, setCount] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)

  const phaseOrderRef = useRef<Phase[]>([])
  const phaseIndexRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const buildPhaseOrder = (pattern: Pattern): Phase[] => {
    // Respect the intended sequence order: inhale → hold → exhale → pause
    const order: Phase[] = []
    if (pattern.inhale) order.push("inhale")
    if (pattern.hold) order.push("hold")
    if (pattern.exhale) order.push("exhale")
    if (pattern.pause) order.push("pause")
    return order
  }
  
  const startExercise = (exercise: Exercise) => {
    const order = buildPhaseOrder(exercise.pattern)
    phaseOrderRef.current = order
    phaseIndexRef.current = 0
  
    if (order.length === 0) {
      console.error('No valid phases found in exercise pattern')
      return
    }
  
    const firstPhase = order[0]
    setPhase(firstPhase)
    setCount(exercise.pattern[firstPhase] || 1)
    // Parse duration properly (e.g., "5 min" -> 300 seconds)
    const durationMatch = exercise.duration.match(/(\d+)/)
    const minutes = durationMatch ? parseInt(durationMatch[1]) : 5
    setRemainingTime(minutes * 60)
    speak(firstPhase)
    setActiveExercise(exercise)
  }

  const stopExercise = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setActiveExercise(null)
    setPhase("inhale")
    setCount(0)
    setRemainingTime(0)
  }

  const resetExercise = () => {
    if (activeExercise) startExercise(activeExercise)
  }

  useEffect(() => {
    if (!activeExercise) return
    if (timerRef.current) clearInterval(timerRef.current)
  
    timerRef.current = setInterval(() => {
      // Decrement remaining time for the entire exercise
      setRemainingTime(prev => {
        if (prev <= 1) {
          stopExercise()
          return 0
        }
        return prev - 1
      })
  
      // Decrement count for current phase
      setCount(prev => {
        if (prev <= 1) {
          // Move to next phase
          phaseIndexRef.current = (phaseIndexRef.current + 1) % phaseOrderRef.current.length
          const nextPhase = phaseOrderRef.current[phaseIndexRef.current]
          setPhase(nextPhase)
          speak(nextPhase)
          // Return the duration for the next phase
          return activeExercise.pattern[nextPhase] || 1
        }
        return prev - 1
      })
    }, 1000)
  
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeExercise])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Exercise List */}
      <div className="space-y-4">
        {breathingExercises.map(exercise => {
          const isRunning = activeExercise?.id === exercise.id
          return (
            <div key={exercise.id} className="p-4 border rounded">
              <h4 className="font-semibold">{exercise.name}</h4>
              <p className="text-sm">{exercise.description}</p>
              <p className="text-xs text-gray-500">Duration: {exercise.duration}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {exercise.benefits.map((b, i) => (
                  <span key={i} className="px-2 py-1 border rounded text-xs">{b}</span>
                ))}
              </div>
              <button
                className="mt-3 px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => (isRunning ? stopExercise() : startExercise(exercise))}
              >
                {isRunning ? "Pause" : "Start"}
              </button>
            </div>
          )
        })}
      </div>

      {/* Visualizer */}
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
                  activeExercise && phase === "inhale"
                    ? "scale-110"
                    : activeExercise && phase === "exhale"
                    ? "scale-90"
                    : "scale-100"
                }`}
                style={{
                  boxShadow: activeExercise ? "0 0 30px rgba(59, 130, 246, 0.5)" : "none",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-lg lg:text-xl font-bold capitalize">{phase}</p>
                  <p className="text-2xl lg:text-3xl font-bold">{activeExercise ? count : "--"}</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm lg:text-base font-medium">
                {activeExercise
                  ? `${phase.charAt(0).toUpperCase() + phase.slice(1)} for ${count} seconds`
                  : "Select an exercise to begin"}
              </p>
              {activeExercise && (
                <p className="text-xs text-gray-500">
                  Remaining: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
                </p>
              )}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (activeExercise ? stopExercise() : null)}
                  disabled={!activeExercise}
                >
                  {activeExercise ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetExercise}
                  disabled={!activeExercise}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
