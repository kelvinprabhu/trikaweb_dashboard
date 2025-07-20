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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TrikaVisionModalProps {
  isOpen: boolean
  onClose: () => void
  onSessionComplete: (sessionData: any) => void
  workoutType?: string
}

interface WorkoutLogEntry {
  id: string
  activity: string
  duration: number
  timestamp: Date
  type: "exercise" | "rest"
}

export function TrikaVisionModal({
  isOpen,
  onClose,
  onSessionComplete,
  workoutType = "Push-Up",
}: TrikaVisionModalProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [repCount, setRepCount] = useState(0)
  const [currentFeedback, setCurrentFeedback] = useState("Click start to begin workout")
  const [corrections, setCorrections] = useState<string[]>([])
  const [accuracy, setAccuracy] = useState(85)
  const [pace, setPace] = useState("Good")
  const [countdown, setCountdown] = useState(0)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string>("")
  const [workoutLog, setWorkoutLog] = useState<WorkoutLogEntry[]>([
    {
      id: "1",
      activity: "Push-ups",
      duration: 15,
      timestamp: new Date(Date.now() - 3600000),
      type: "exercise",
    },
    {
      id: "2",
      activity: "Rest",
      duration: 5,
      timestamp: new Date(Date.now() - 3300000),
      type: "rest",
    },
    {
      id: "3",
      activity: "Sit-ups",
      duration: 10,
      timestamp: new Date(Date.now() - 2700000),
      type: "exercise",
    },
    {
      id: "4",
      activity: "Rest",
      duration: 3,
      timestamp: new Date(Date.now() - 2100000),
      type: "rest",
    },
    {
      id: "5",
      activity: "Squats",
      duration: 12,
      timestamp: new Date(Date.now() - 1800000),
      type: "exercise",
    },
  ])

  const videoRef = useRef<HTMLVideoElement>(null)

  // Simulated pose detection points
  const [posePoints, setPosePoints] = useState([
    { x: 45, y: 30, active: true },
    { x: 55, y: 30, active: true },
    { x: 50, y: 40, active: false },
    { x: 40, y: 60, active: true },
    { x: 60, y: 60, active: true },
    { x: 45, y: 80, active: true },
    { x: 55, y: 80, active: true },
  ])

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      initializeCamera()
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isOpen, isMinimized])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            // Start recording after countdown
            setIsRecording(true)
            setCurrentFeedback("Session started! Begin your workout")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [countdown])

  // Simulated real-time feedback
  useEffect(() => {
    if (isRecording) {
      const feedbackMessages = [
        "Keep your back straight",
        "Lower your chest more",
        "Great form! Keep it up",
        "Slow down the movement",
        "Perfect alignment",
        "Engage your core",
        "Full range of motion",
        "Maintain steady breathing",
        "Focus on controlled movement",
        "Excellent posture!",
      ]

      const interval = setInterval(() => {
        const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)]
        setCurrentFeedback(randomFeedback)

        // Simulate rep counting
        if (Math.random() > 0.7) {
          setRepCount((prev) => prev + 1)
        }

        // Add corrections occasionally
        if (Math.random() > 0.8) {
          setCorrections((prev) => [...prev, randomFeedback])
        }

        // Update accuracy
        setAccuracy((prev) => Math.max(70, Math.min(95, prev + (Math.random() - 0.5) * 10)))

        // Update pose points
        setPosePoints((prev) =>
          prev.map((point) => ({
            ...point,
            active: Math.random() > 0.3,
          })),
        )
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isRecording])

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })
      setCameraStream(stream)
      setCameraError("")

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera access failed:", error)
      setCameraError("Camera access denied. Please enable camera permissions and refresh.")
    }
  }

  const startSession = async () => {
    if (!cameraStream) {
      await initializeCamera()
    }

    if (cameraStream) {
      setCountdown(3)
      setCurrentFeedback("Get ready! Starting in...")

      // Add to workout log
      const newLogEntry: WorkoutLogEntry = {
        id: Date.now().toString(),
        activity: workoutType,
        duration: 0,
        timestamp: new Date(),
        type: "exercise",
      }
      setWorkoutLog((prev) => [newLogEntry, ...prev])
    }
  }

  const pauseSession = () => {
    setIsRecording(false)
    setCurrentFeedback("Session paused - Click resume to continue")
  }

  const resumeSession = () => {
    setIsRecording(true)
    setCurrentFeedback("Session resumed! Continue your workout")
  }

  const endSession = () => {
    setIsRecording(false)
    setCountdown(0)

    // Update the current workout log entry with final duration
    setWorkoutLog((prev) =>
      prev.map((entry, index) => (index === 0 ? { ...entry, duration: Math.floor(sessionTime / 60) } : entry)),
    )

    const sessionData = {
      workoutType,
      duration: sessionTime,
      reps: repCount,
      accuracy,
      corrections: corrections.slice(-5),
      pace,
      completedAt: new Date().toISOString(),
    }
    onSessionComplete(sessionData)
  }

  const resetSession = () => {
    setIsRecording(false)
    setCountdown(0)
    setSessionTime(0)
    setRepCount(0)
    setCorrections([])
    setCurrentFeedback("Click start to begin workout")
    setAccuracy(85)
    setPace("Good")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatLogTime = (minutes: number) => {
    if (minutes < 1) return "< 1 min"
    return `${minutes} min${minutes !== 1 ? "s" : ""}`
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
    }
    setIsRecording(false)
    setCountdown(0)
    resetSession()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
      <div
        className={`bg-white transition-all duration-300 ${
          isMinimized ? "absolute top-4 right-4 w-96 h-64 rounded-2xl shadow-2xl" : "w-full h-full"
        } flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">TrikaVision</h2>
              <p className="text-blue-600 font-medium">AI-Powered Form Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMinimize} className="hover:bg-blue-100">
              {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose} className="hover:bg-blue-100">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex-1 flex overflow-hidden">
            {/* Main Camera View */}
            <div className="flex-1 relative bg-gradient-to-br from-slate-900 to-slate-800">
              {/* Camera Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Fallback when no camera */}
              {!cameraStream && !cameraError && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="w-20 h-20 mx-auto mb-6 opacity-60" />
                    <p className="text-xl opacity-80 mb-2">Initializing Camera...</p>
                    <p className="text-sm opacity-50">Please allow camera access</p>
                  </div>
                </div>
              )}

              {/* Camera Error */}
              {cameraError && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
                  <div className="text-center text-white max-w-md p-6">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-60" />
                    <p className="text-lg mb-4">{cameraError}</p>
                    <Button onClick={initializeCamera} className="bg-white text-red-800 hover:bg-gray-100">
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Countdown Overlay */}
              {countdown > 0 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-8xl font-bold mb-4 animate-pulse">{countdown}</div>
                    <p className="text-2xl">Get Ready!</p>
                  </div>
                </div>
              )}

              {/* Pose Detection Overlay */}
              {isRecording && cameraStream && (
                <div className="absolute inset-0">
                  {posePoints.map((point, index) => (
                    <div
                      key={index}
                      className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                        point.active
                          ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                          : "bg-red-400 shadow-lg shadow-red-400/50"
                      } animate-pulse`}
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    />
                  ))}

                  {/* Skeleton Lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    <line x1="45%" y1="30%" x2="55%" y2="30%" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3" />
                    <line x1="50%" y1="30%" x2="50%" y2="40%" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3" />
                    <line x1="50%" y1="40%" x2="40%" y2="60%" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3" />
                    <line x1="50%" y1="40%" x2="60%" y2="60%" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3" />
                    <line x1="40%" y1="60%" x2="45%" y2="80%" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3" />
                    <line x1="60%" y1="60%" x2="55%" y2="80%" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3" />
                  </svg>
                </div>
              )}

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-6 left-6 flex items-center gap-3 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">RECORDING</span>
                </div>
              )}

              {/* Session Timer */}
              {(isRecording || sessionTime > 0) && (
                <div className="absolute top-6 right-6 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="font-mono text-lg font-bold">{formatTime(sessionTime)}</span>
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                {!isRecording && countdown === 0 ? (
                  <Button
                    onClick={startSession}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-4 rounded-full shadow-xl text-lg font-semibold"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start Session
                  </Button>
                ) : isRecording ? (
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={pauseSession}
                      variant="outline"
                      size="lg"
                      className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg border-2 hover:bg-white"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                    <Button
                      onClick={endSession}
                      size="lg"
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full shadow-xl"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      End Session
                    </Button>
                    <Button
                      onClick={resetSession}
                      variant="outline"
                      size="lg"
                      className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg border-2 hover:bg-white"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                ) : sessionTime > 0 ? (
                  <Button
                    onClick={resumeSession}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-full shadow-xl text-lg font-semibold"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Resume
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="w-96 bg-gradient-to-b from-blue-50 to-indigo-50 border-l border-blue-200 flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Workout Info */}
                  <Card className="border-blue-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Target className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">Current Workout</h3>
                      </div>
                      <p className="text-lg font-bold text-gray-900 mb-2">{workoutType}</p>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">AI Guided</Badge>
                        <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                          Live Analysis
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Stats */}
                  <Card className="border-blue-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Live Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <span className="text-2xl font-bold text-blue-600">{formatTime(sessionTime)}</span>
                          <p className="text-xs text-blue-600 font-medium">Duration</p>
                        </div>
                        <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                          <span className="text-2xl font-bold text-indigo-600">{repCount}</span>
                          <p className="text-xs text-indigo-600 font-medium">Reps</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Form Accuracy</span>
                          <span className="font-bold text-blue-600">{accuracy.toFixed(0)}%</span>
                        </div>
                        <Progress value={accuracy} className="h-3 bg-blue-100" />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Pace</span>
                        <Badge
                          variant={pace === "Good" ? "default" : "secondary"}
                          className="bg-blue-100 text-blue-700"
                        >
                          {pace}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Real-time Feedback */}
                  <Card className="border-blue-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <Eye className="w-5 h-5 text-blue-500" />
                        AI Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-800">{currentFeedback}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Form Corrections */}
                  {corrections.length > 0 && (
                    <Card className="border-blue-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <Timer className="w-5 h-5 text-amber-500" />
                          Recent Corrections
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="max-h-32">
                          <div className="space-y-2">
                            {corrections.slice(-5).map((correction, index) => (
                              <div key={index} className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <span className="text-amber-800">{correction}</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {/* Workout Log History */}
                  <Card className="border-blue-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <History className="w-5 h-5 text-blue-500" />
                        Workout Log
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="max-h-64">
                        <div className="space-y-3">
                          {workoutLog.map((entry, index) => (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    entry.type === "exercise" ? "bg-blue-500" : "bg-gray-400"
                                  }`}
                                />
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{entry.activity}</p>
                                  <p className="text-xs text-gray-500">
                                    {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {formatLogTime(entry.duration)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="flex-1 p-6 flex flex-col justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{workoutType}</h3>
                <p className="text-sm text-gray-600">
                  {isRecording ? "Recording..." : countdown > 0 ? `Starting in ${countdown}...` : "Ready to start"}
                </p>
              </div>
              {(isRecording || sessionTime > 0) && (
                <div className="space-y-2">
                  <p className="font-mono text-lg font-bold text-blue-600">{formatTime(sessionTime)}</p>
                  <p className="text-sm text-gray-600">
                    {repCount} reps • {accuracy.toFixed(0)}% accuracy
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
