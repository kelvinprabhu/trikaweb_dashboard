"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X, Camera as CameraIcon, Play, Pause, Square, Eye, Activity,
  Timer, Target, Minimize2, Maximize2, History, RotateCcw, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkoutWebSocket } from "./useWorkoutWebSocket";

interface TrikaVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (sessionData: any) => void;
  workoutType?: string;
}

interface WorkoutLogEntry {
  id: string;
  activity: string;
  duration: number;
  timestamp: Date;
  type: "exercise" | "rest";
  confidence: number;
}

export function TrikaVisionModal({
  isOpen,
  onClose,
  onSessionComplete,
  workoutType = "General Workout",
}: TrikaVisionModalProps) {
  // State management - Only camera and UI states, everything else from WebSocket
  const [isRecording, setIsRecording] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [workoutLog, setWorkoutLog] = useState<WorkoutLogEntry[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const router = useRouter();

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WebSocket hook - This provides ALL workout data
  const wsUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "ws://127.0.0.1:8000/ws/posture/";
  const {
    socket,
    isConnected,
    error,
    isModelLoaded,
    supportedExercises,
    currentExercise,
    exerciseConfidence,
    feedback,
    angle,
    reps,
    landmarksDetected,
    formColor,
    sessionTime: wsSessionTime,
    frameCount,
    sessionSummary,
    resetSession,
    getSessionSummary,
    sendMessage,
    testConnection,
  } = useWorkoutWebSocket(wsUrl, videoRef, (data) => {
    // Debug callback to log all WebSocket messages
    console.log('📨 WebSocket message received:', data.type, data.payload);
  }, isOpen);

  // Calculate session duration from WebSocket session time or local tracking
  const sessionDuration = wsSessionTime || (sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000) : 0);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      initializeCamera();
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, isMinimized]);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            setIsRecording(true);
            setSessionStartTime(new Date());
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Track exercise changes and add to workout log
  useEffect(() => {
    if (currentExercise && isRecording && exerciseConfidence > 0.5) {
      // Check if this is a new exercise or significant confidence change
      const lastLogEntry = workoutLog[0];
      const shouldCreateNewEntry = !lastLogEntry ||
        lastLogEntry.activity !== currentExercise ||
        (Date.now() - lastLogEntry.timestamp.getTime()) > 30000; // 30 seconds gap

      if (shouldCreateNewEntry) {
        const newLogEntry: WorkoutLogEntry = {
          id: `${Date.now()}-${currentExercise}`,
          activity: currentExercise,
          duration: Math.floor(sessionDuration / 60),
          timestamp: new Date(),
          type: "exercise",
          confidence: exerciseConfidence
        };
        setWorkoutLog((prev) => [newLogEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
      }
    }
  }, [currentExercise, exerciseConfidence, isRecording, sessionDuration]);

  const initializeCamera = async () => {
    try {
      // Stop any existing stream first
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: "user",
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setCameraError("");

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;

        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(err => {
              console.error('Error playing video:', err);
              setCameraError('Failed to start camera. Please ensure no other application is using the camera.');
              resolve(null);
            });
          };
        });
      }

      // Notify WebSocket that camera is ready
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendMessage('camera_ready', {
          width: videoRef.current?.videoWidth || 1280,
          height: videoRef.current?.videoHeight || 720,
          frameRate: 30
        });
      }
    } catch (error) {
      console.error("Camera access failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to access camera';
      setCameraError(`Camera error: ${errorMessage}. Please check permissions and try again.`);
    }
  };

  const startSession = async () => {
    if (!cameraStream) {
      await initializeCamera();
    }

    if (cameraStream) {
      setCountdown(3);
      setSessionStartTime(new Date());

      if (socket && socket.readyState === WebSocket.OPEN) {
        sendMessage('start_workout', {
          workoutType: currentExercise || workoutType,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const pauseSession = () => {
    setIsRecording(false);
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendMessage('pause_workout', {
        timestamp: new Date().toISOString(),
        sessionDuration
      });
    }
  };

  const resumeSession = () => {
    setIsRecording(true);
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendMessage('resume_workout', {
        timestamp: new Date().toISOString()
      });
    }
  };

  const endSession = () => {
    setIsRecording(false);
    setCountdown(0);
    setSessionEnded(true);

    // Create session data from WebSocket state
    const sessionData = {
      workoutType,
      duration: sessionDuration,
      exercises: currentExercise ? [currentExercise] : [],
      totalReps: reps,
      averageConfidence: exerciseConfidence,
      feedback: feedback,
      sessionSummary: sessionSummary,
      timestamp: new Date(),
      workoutLog: workoutLog.slice(0, 5), // Include recent exercises
    };

    onSessionComplete(sessionData);

    if (socket && socket.readyState === WebSocket.OPEN) {
      sendMessage('end_workout', sessionData);
    }

    // Get final session summary
    setTimeout(() => {
      getSessionSummary();
    }, 1000);
  };

  const viewDashboard = () => {
    // Close the modal first
    onClose();
    // Navigate to dashboard (root path)
    router.push('/');
  };

  const resetWorkoutSession = () => {
    setIsRecording(false);
    setCountdown(0);
    setWorkoutLog([]);
    setSessionStartTime(null);
    resetSession(); // WebSocket reset
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatLogTime = (minutes: number) => {
    if (minutes < 1) return "< 1 min";
    return `${minutes} min${minutes !== 1 ? "s" : ""}`;
  };

  const getFormColorStyle = () => {
    if (!formColor) return "rgb(255, 255, 255)";
    if (Array.isArray(formColor)) {
      return `rgb(${formColor[0]}, ${formColor[1]}, ${formColor[2]})`;
    }
    return `rgb(${formColor.r}, ${formColor.g}, ${formColor.b})`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-700 border-green-200";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getCurrentFeedback = () => {
    if (!isConnected) return "Connecting to AI trainer...";
    if (!isModelLoaded) return "Loading AI model...";
    if (!landmarksDetected && isRecording) return "Please ensure you're visible in the camera";
    if (countdown > 0) return `Get ready! Starting in ${countdown}...`;
    if (!isRecording && sessionDuration === 0) return "Click start to begin your AI-guided workout";
    if (!isRecording) return "Session paused - Click resume to continue";
    return feedback || "Analyzing your movement...";
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setCountdown(0);
    resetSession();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
      <div
        className={`bg-white transition-all duration-300 ${isMinimized ? "absolute top-4 right-4 w-96 h-64 rounded-2xl shadow-2xl" : "w-full h-full"
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
              {isMinimized ? <Maximize2 className="w-5 h-5 text-blue-500" /> : <Minimize2 className="w-5 h-5 text-blue-500" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose} className="hover:bg-blue-100">
              <X className="w-6 h-6 text-blue-500" />
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

              {/* Canvas for drawing (optional overlay) */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                width={1280}
                height={720}
                style={{
                  border: landmarksDetected ? `3px solid ${getFormColorStyle()}` : 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />

              {/* Fallback when no camera */}
              {!cameraStream && !cameraError && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <CameraIcon className="w-20 h-20 mx-auto mb-6 opacity-60" />
                    <p className="text-xl opacity-80 mb-2">Initializing Camera...</p>
                    <p className="text-sm opacity-50">Please allow camera access</p>
                  </div>
                </div>
              )}

              {/* Camera Error */}
              {cameraError && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
                  <div className="text-center text-white max-w-md p-6">
                    <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-60" />
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

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-6 left-6 flex items-center gap-3 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">RECORDING</span>
                </div>
              )}

              {/* Connection Status */}
              <div
                className={`absolute top-6 left-32 flex items-center gap-2 px-3 py-1 rounded-full ${isConnected && isModelLoaded
                    ? 'bg-green-500'
                    : error
                      ? 'bg-red-500'
                      : isConnected
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                  } text-white transition-colors duration-300`}
                title={
                  error
                    ? `Error: ${error}`
                    : isConnected && isModelLoaded
                      ? `AI Model Ready - ${supportedExercises} exercises supported`
                      : isConnected
                        ? 'Connected, loading AI model...'
                        : 'Connecting to server...'
                }
              >
                <div className={`w-2 h-2 rounded-full ${isConnected && isModelLoaded ? 'bg-white' : 'bg-white/70'
                  } ${!isConnected || !isModelLoaded ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-semibold">
                  {error ? 'CONNECTION ERROR' :
                    isConnected && isModelLoaded ? 'AI READY' :
                      isConnected ? 'LOADING AI...' : 'CONNECTING...'}
                </span>
                {error && (
                  <div className="ml-2 flex gap-1">
                    <button
                      onClick={async () => {
                        console.log('🧪 Testing WebSocket connection...', { isConnected, isModelLoaded, supportedExercises });
                        const result = await testConnection();
                        console.log('Test result:', result);
                      }}
                      className="text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-0.5"
                      title="Test connection"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-0.5"
                      title="Reload page"
                    >
                      Reload
                    </button>
                  </div>
                )}
              </div>

              {/* Session Timer */}
              {(isRecording || sessionDuration > 0) && (
                <div className="absolute top-6 right-6 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="font-mono text-lg font-bold">{formatTime(sessionDuration)}</span>
                </div>
              )}

              {/* Current Exercise Display */}
              {currentExercise && isRecording && (
                <div className="absolute top-20 right-6 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                  <p className="text-sm font-medium">{currentExercise}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs">Confidence:</span>
                    <span className="text-xs font-bold">{Math.round(exerciseConfidence * 100)}%</span>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                {!isRecording && countdown === 0 ? (
                  <Button
                    onClick={startSession}
                    size="lg"
                    disabled={!isConnected || !isModelLoaded}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-4 rounded-full shadow-xl text-lg font-semibold disabled:opacity-50"
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
                      onClick={resetWorkoutSession}
                      variant="outline"
                      size="lg"
                      className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg border-2 hover:bg-white"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                ) : sessionDuration > 0 && !sessionEnded ? (
                  <Button
                    onClick={resumeSession}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-full shadow-xl text-lg font-semibold"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Resume
                  </Button>
                ) : sessionEnded ? (
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={viewDashboard}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-4 rounded-full shadow-xl text-lg font-semibold"
                    >
                      <Home className="w-6 h-6 mr-3" />
                      View Dashboard
                    </Button>
                    <Button
                      onClick={resetWorkoutSession}
                      variant="outline"
                      size="lg"
                      className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg border-2 hover:bg-white"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      New Session
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Stats Panel - All data from WebSocket */}
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
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        {currentExercise || workoutType}
                      </p>
                      <div className="flex gap-2">
                        <Badge className={getConfidenceColor(exerciseConfidence)}>
                          {currentExercise ? 'Detected' : 'Standby'}
                        </Badge>
                        <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                          Live Analysis
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Stats - All from WebSocket */}
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
                          <span className="text-2xl font-bold text-blue-600">
                            {formatTime(sessionDuration)}
                          </span>
                          <p className="text-xs text-blue-600 font-medium">Duration</p>
                        </div>
                        <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                          <span className="text-2xl font-bold text-indigo-600">{reps}</span>
                          <p className="text-xs text-indigo-600 font-medium">Reps</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Exercise Confidence</span>
                          <span className="font-bold text-blue-600">
                            {Math.round(exerciseConfidence * 100)}%
                          </span>
                        </div>
                        <Progress value={exerciseConfidence * 100} className="h-3 bg-blue-100" />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Landmarks</span>
                        <Badge className={landmarksDetected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {landmarksDetected ? 'Detected' : 'Not Found'}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Frames Processed</span>
                        <Badge className="bg-purple-100 text-purple-700">
                          {frameCount}
                        </Badge>
                      </div>

                      {angle > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Joint Angle</span>
                          <Badge className="bg-orange-100 text-orange-700">
                            {Math.round(angle)}°
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Real-time Feedback - Direct from WebSocket */}
                  <Card className="border-blue-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <Eye className="w-5 h-5 text-blue-500" />
                        AI Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="border border-blue-200 rounded-lg p-4 transition-colors duration-300"
                        style={{
                          backgroundColor: landmarksDetected ? '#f0f9ff' : '#fef3c7',
                          borderColor: landmarksDetected ? '#bfdbfe' : '#fed7aa'
                        }}
                      >
                        <p className="text-sm font-medium text-blue-800">
                          {getCurrentFeedback()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Workout Log History - Based on exercise detection */}
                  <Card className="border-blue-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <History className="w-5 h-5 text-blue-500" />
                        Detected Exercises
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="max-h-64">
                        {workoutLog.length > 0 ? (
                          <div className="space-y-3">
                            {workoutLog.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${entry.confidence > 0.8
                                        ? 'bg-green-500'
                                        : entry.confidence > 0.6
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                      }`}
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">{entry.activity}</p>
                                    <p className="text-xs text-gray-500">
                                      {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(entry.confidence * 100)}%
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No exercises detected yet</p>
                            <p className="text-xs mt-1">Start your workout to see real-time detection</p>
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Minimized View - Using WebSocket data */}
        {isMinimized && (
          <div className="flex-1 p-6 flex flex-col justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {currentExercise || workoutType}
                </h3>
                <p className="text-sm text-gray-600">
                  {isRecording
                    ? "Recording..."
                    : countdown > 0
                      ? `Starting in ${countdown}...`
                      : isConnected
                        ? "Ready to start"
                        : "Connecting..."}
                </p>
              </div>
              {(isRecording || sessionDuration > 0) && (
                <div className="space-y-2">
                  <p className="font-mono text-lg font-bold text-blue-600">
                    {formatTime(sessionDuration)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reps} reps • {Math.round(exerciseConfidence * 100)}% confidence
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}