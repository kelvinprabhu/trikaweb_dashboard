"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Target,
  Calendar,
  TrendingUp,
  Clock,
  Flame,
  Eye,
  Zap,
  Brain,
  Heart,
  Trophy,
  Play,
} from "lucide-react"
import { TrikaVisionModal } from "@/components/trika-vision/trika-vision-modal"
import { SessionSummaryModal } from "@/components/trika-vision/session-summary-modal"

export function DashboardContent() {
  const [showTrikaVision, setShowTrikaVision] = useState(false)
  const [showSessionSummary, setShowSessionSummary] = useState(false)
  const [sessionData, setSessionData] = useState(null)

  const handleSessionComplete = (data: any) => {
    setSessionData(data)
    setShowSessionSummary(true)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
            <p className="text-blue-100 mb-4">Ready to crush your fitness goals today?</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Flame className="w-4 h-4 mr-1" />7 day streak
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Trophy className="w-4 h-4 mr-1" />
                Level 12
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">2,847</div>
            <div className="text-blue-200">calories burned this week</div>
          </div>
        </div>
      </div>

      {/* TrikaVision Feature Card */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">TrikaVision</CardTitle>
                <CardDescription>AI-Powered Form Analysis & Real-time Feedback</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Brain className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg border border-orange-100">
              <Eye className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Pose Detection</h4>
              <p className="text-sm text-gray-600">Real-time form analysis</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-orange-100">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Live Feedback</h4>
              <p className="text-sm text-gray-600">Instant corrections</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-orange-100">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
              <p className="text-sm text-gray-600">Detailed analytics</p>
            </div>
          </div>
          <Button
            onClick={() => setShowTrikaVision(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 text-lg font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Workout with TrikaVision
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,547</div>
            <p className="text-xs text-gray-600">steps taken</p>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">423</div>
            <p className="text-xs text-gray-600">kcal today</p>
            <Progress value={84} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-gray-600">minutes active</p>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72</div>
            <p className="text-xs text-gray-600">bpm average</p>
            <Badge variant="outline" className="mt-2 text-xs">
              Resting
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Today's Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Steps Goal</span>
                <span>8,547 / 10,000</span>
              </div>
              <Progress value={85} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Calories Goal</span>
                <span>423 / 500</span>
              </div>
              <Progress value={84} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Minutes</span>
                <span>47 / 60</span>
              </div>
              <Progress value={78} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Morning Run</p>
                    <p className="text-sm text-gray-600">3.2 km • 22 min</p>
                  </div>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Strength Training</p>
                    <p className="text-sm text-gray-600">Upper body • 45 min</p>
                  </div>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Meditation</p>
                    <p className="text-sm text-gray-600">Mindfulness • 15 min</p>
                  </div>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <TrikaVisionModal
        isOpen={showTrikaVision}
        onClose={() => setShowTrikaVision(false)}
        onSessionComplete={handleSessionComplete}
      />

      <SessionSummaryModal
        isOpen={showSessionSummary}
        onClose={() => setShowSessionSummary(false)}
        sessionData={sessionData}
      />
    </div>
  )
}
