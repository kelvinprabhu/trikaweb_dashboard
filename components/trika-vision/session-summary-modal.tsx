"use client"

import { X, Trophy, Target, Clock, TrendingUp, Star, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SessionSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  sessionData: any
}

export function SessionSummaryModal({ isOpen, onClose, sessionData }: SessionSummaryModalProps) {
  if (!isOpen || !sessionData) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600"
    if (accuracy >= 80) return "text-blue-600"
    if (accuracy >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 90) return { text: "Excellent", color: "bg-green-100 text-green-800 border-green-200" }
    if (accuracy >= 80) return { text: "Good", color: "bg-blue-100 text-blue-800 border-blue-200" }
    if (accuracy >= 70) return { text: "Fair", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    return { text: "Needs Work", color: "bg-red-100 text-red-800 border-red-200" }
  }

  const accuracyBadge = getAccuracyBadge(sessionData.accuracy)

  const getPerformanceMessage = () => {
    if (sessionData.accuracy >= 90) return "Outstanding performance! Your form was excellent throughout the session."
    if (sessionData.accuracy >= 80)
      return "Great job! Your form was consistently good with room for minor improvements."
    if (sessionData.accuracy >= 70) return "Good effort! Focus on the corrections below to improve your form."
    return "Keep practicing! Review the feedback to enhance your technique in future sessions."
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Workout Complete!</h2>
              <p className="text-green-600 font-medium">Great job on your {sessionData.workoutType} session</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-green-100">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Performance Message */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <p className="text-gray-700 text-lg leading-relaxed font-medium">{getPerformanceMessage()}</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-green-200 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-green-600 mb-1">{formatTime(sessionData.duration)}</p>
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-blue-600 mb-1">{sessionData.reps}</p>
                  <p className="text-sm font-medium text-gray-600">Reps</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 shadow-sm">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <p className={`text-2xl font-bold mb-1 ${getAccuracyColor(sessionData.accuracy)}`}>
                    {sessionData.accuracy.toFixed(0)}%
                  </p>
                  <p className="text-sm font-medium text-gray-600">Accuracy</p>
                </CardContent>
              </Card>

              <Card className="border-indigo-200 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-indigo-600 mb-1">{sessionData.pace}</p>
                  <p className="text-sm font-medium text-gray-600">Pace</p>
                </CardContent>
              </Card>
            </div>

            {/* Form Analysis */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Form Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Overall Form Score</span>
                  <div className="flex items-center gap-4">
                    <Progress value={sessionData.accuracy} className="w-32 h-3" />
                    <Badge className={accuracyBadge.color}>{accuracyBadge.text}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Exercise Type</span>
                    <Badge variant="outline" className="font-medium">
                      {sessionData.workoutType}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Completed At</span>
                    <span className="text-gray-600 text-sm">
                      {new Date(sessionData.completedAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {sessionData.accuracy >= 85 && (
                  <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">
                      Excellent form maintained throughout the session! Keep up the great work!
                    </span>
                  </div>
                )}

                {sessionData.accuracy < 75 && (
                  <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">
                      Focus on the corrections below to improve your form in future sessions.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Corrections */}
            {sessionData.corrections && sessionData.corrections.length > 0 && (
              <Card className="border-amber-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                    Areas for Improvement ({sessionData.corrections.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-48">
                    <div className="space-y-3">
                      {sessionData.corrections.map((correction: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200"
                        >
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm text-amber-800 font-medium">{correction}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            <Card className="border-green-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Trophy className="w-6 h-6 text-green-500" />
                  Session Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">Session Completed</p>
                      <p className="text-xs text-green-600">Finished your workout successfully</p>
                    </div>
                  </div>

                  {sessionData.reps >= 10 && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Target className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-800">Rep Master</p>
                        <p className="text-xs text-blue-600">Completed {sessionData.reps} reps</p>
                      </div>
                    </div>
                  )}

                  {sessionData.accuracy >= 85 && (
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <Star className="w-6 h-6 text-purple-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-purple-800">Form Expert</p>
                        <p className="text-xs text-purple-600">High accuracy score achieved</p>
                      </div>
                    </div>
                  )}

                  {sessionData.duration >= 300 && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="w-6 h-6 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-orange-800">Endurance Champion</p>
                        <p className="text-xs text-orange-600">5+ minute session completed</p>
                      </div>
                    </div>
                  )}

                  {sessionData.reps >= 25 && (
                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <TrendingUp className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-indigo-800">Rep Champion</p>
                        <p className="text-xs text-indigo-600">25+ reps achieved</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-600 font-medium">Keep up the great work! 💪</div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
              View Dashboard
            </Button>
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6"
            >
              Start New Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
