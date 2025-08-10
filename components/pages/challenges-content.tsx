"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Clock, Users, Flame, Star, Play, Eye, ChevronDown, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrikaVisionModal } from "@/components/trika-vision/trika-vision-modal"
import { SessionSummaryModal } from "@/components/trika-vision/session-summary-modal"
interface GlobalChallenge {
  _id: string
  title: string
  description: string
  difficulty: string
  durationDays: number
  durationMinutes: number
  workoutType: string
  badge: string
  color: string
  createdAt: string
}

interface CustomChallenge {
  _id: string
  title: string
  description: string
  difficulty: string
  fitnessLevel: string
  durationDays: number
  category: string
  type: string
  goalTags: string[]
  workout: string
  exercises: Array<{
    exercise: string
    durationMinutes: number
    reason: string
  }>
  aiRecommendationReason: string
  status: string
  badge: string
  color: string
  progress: number
  completedDays: number
  isCompleted: boolean
  startDate: string
  workoutSessions: Array<{
    day: number
    workoutType: string
    sets: number
    reps: number
    duration?: number
    restTime?: number
    notes?: string
  }>
}

export function ChallengesContent({ email }: { email: string }) {
  const router = useRouter()
  const [globalChallenges, setGlobalChallenges] = useState<GlobalChallenge[]>([])
  const [customChallenges, setCustomChallenges] = useState<CustomChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingChallenge, setGeneratingChallenge] = useState(false)
  const [showModeSelection, setShowModeSelection] = useState(false)
  const [showTrikaVision, setShowTrikaVision] = useState(false)
  const [showSessionSummary, setShowSessionSummary] = useState(false)
  const [sessionData, setSessionData] = useState(null)

  // Fetch global challenges
  const fetchGlobalChallenges = async () => {
    try {
      const response = await fetch('/api/global-challenges')
      if (response.ok) {
        const data = await response.json()
        setGlobalChallenges(data.challenges || [])
      }
    } catch (error) {
      console.error('Error fetching global challenges:', error)
    }
  }
  const handleSessionComplete = (data: any) => {
    setSessionData(data)
    setShowSessionSummary(true)
  }
  // Fetch custom challenges
  const fetchCustomChallenges = async () => {
    try {
      const response = await fetch(`/api/custom-challenges?userEmail=${email}`)
      if (response.ok) {
        const data = await response.json()
        setCustomChallenges(data.challenges || [])
      }
    } catch (error) {
      console.error('Error fetching custom challenges:', error)
    }
  }

  // Generate AI Challenge
  const generateAIChallenge = async (mode: 'TrikaVision' | 'Regular') => {
    setGeneratingChallenge(true)
    setShowModeSelection(false)

    try {
      const response = await fetch('/api/custom-challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generateAIChallenge: true,
          userEmail: email,
          preferredMode: mode
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('AI Challenge generated:', data)
        // Refresh custom challenges to show the new one
        await fetchCustomChallenges()
      } else {
        const errorData = await response.json()
        console.error('Error generating AI challenge:', errorData)
        alert('Failed to generate AI challenge. Please try again.')
      }
    } catch (error) {
      console.error('Error generating AI challenge:', error)
      alert('Failed to generate AI challenge. Please try again.')
    } finally {
      setGeneratingChallenge(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchGlobalChallenges(), fetchCustomChallenges()])
      setLoading(false)
    }
    fetchData()
  }, [email])

  const handleStandardStart = (
    sessionType: string,
    exercises: Array<string>,
    title: string
  ) => {
    router.push(
      `/standard-mode?exercises=${encodeURIComponent(exercises.join(","))}&title=${encodeURIComponent(title)}&sessionType=${encodeURIComponent(sessionType)}`
    );
  };

  const handleStandardStartGlobal = (
    sessionType: string,
    workoutType: string,
    duration: string,
    title: string
  ) => {
    router.push(
      `/standard-mode?workout=${encodeURIComponent(workoutType)}&duration=${encodeURIComponent(duration)}&title=${encodeURIComponent(title)}&sessionType=${encodeURIComponent(sessionType)}`
    )
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading challenges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Challenges</h1>
          <p className="text-gray-600 text-sm lg:text-base">Push your limits and achieve your fitness goals</p>
        </div>
        {/* <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Trophy className="w-4 h-4 mr-2" />
          View Leaderboard
        </Button> */}
      </div>

      <Tabs defaultValue="global" className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-2">
          <TabsTrigger value="global" className="text-xs lg:text-sm">
            Global Challenges
          </TabsTrigger>
          <TabsTrigger value="custom" className="text-xs lg:text-sm">
            Personal Challenges
          </TabsTrigger>

        </TabsList>

        <TabsContent value="global" className="space-y-4 lg:space-y-6">
          {/* Active Global Challenges */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white-900 lg:text-base">Active Global Challenges</h2>
            {globalChallenges.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No global challenges available</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {globalChallenges.map((challenge: GlobalChallenge) => (
                  <Card key={challenge._id} className="overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${challenge.color}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{challenge.badge}</div>
                          <div>
                            <CardTitle className="text-xl">{challenge.title}</CardTitle>
                            <CardDescription className="mt-1">{challenge.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{challenge.difficulty}</Badge>
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            {challenge.durationDays} days
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {challenge.workoutType} Challenge
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{challenge.durationMinutes} mins</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                              <Play className="w-4 h-4 mr-2" />
                              Start Workout
                              <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem onClick={() => setShowTrikaVision(true)}>
                              <Eye className="w-4 h-4 mr-2 text-blue-500" />
                              <div>
                                <div className="font-medium">Start with TrikaVision</div>
                                <div className="text-xs text-gray-500">AI-powered form analysis</div>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStandardStartGlobal("global", challenge.workoutType || "", challenge.durationMinutes?.toString() || "", challenge.title)}>
                              <Play className="w-4 h-4 mr-2 text-blue-500" />
                              <div>
                                <div className="font-medium">Standard Workout</div>
                                <div className="text-xs text-gray-500">Traditional workout mode</div>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 lg:space-y-6">
          {/* Personal Challenges */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white-900 lg:text-base">Personal Challenges</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    disabled={generatingChallenge}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {generatingChallenge ? "Generating..." : "Load Challenge"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => generateAIChallenge('TrikaVision')}>
                    <Eye className="w-4 h-4 mr-2 text-purple-500" />
                    <div>
                      <div className="font-medium">TrikaVision Challenge</div>
                      <div className="text-xs text-gray-500">AI-powered form analysis</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateAIChallenge('Regular')}>
                    <Play className="w-4 h-4 mr-2 text-green-500" />
                    <div>
                      <div className="font-medium">Regular Challenge</div>
                      <div className="text-xs text-gray-500">Traditional workout mode</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {customChallenges.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No personal challenges yet</p>
                {!showModeSelection ? (
                  <Button
                    onClick={() => setShowModeSelection(true)}
                    className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    disabled={generatingChallenge}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {generatingChallenge ? "Generating..." : "Load To Get Your First Challenge"}
                  </Button>
                ) : (
                  <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-600 mb-4">Choose your challenge mode:</p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => generateAIChallenge('TrikaVision')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        disabled={generatingChallenge}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        TrikaVision Mode
                      </Button>
                      <Button
                        onClick={() => generateAIChallenge('Regular')}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        disabled={generatingChallenge}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Regular Mode
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowModeSelection(false)}
                      className="mt-2"
                      disabled={generatingChallenge}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                {customChallenges.map((challenge: CustomChallenge) => (
                  <Card key={challenge._id} className="overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${challenge.color}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{challenge.badge}</div>
                          <div>
                            <CardTitle className="text-xl">{challenge.title}</CardTitle>
                            <CardDescription className="mt-1">{challenge.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{challenge.difficulty}</Badge>
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            {challenge.durationDays} days
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {challenge.category} Challenge
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{challenge.completedDays}/{challenge.durationDays} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{challenge.progress}% complete</span>
                        </div>
                      </div>

                      {/* AI-generated challenge details */}
                      {challenge.exercises && challenge.exercises.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-white-800">Exercises:</h4>
                          <div className="space-y-2">
                            {challenge.exercises.map((exercise, idx) => (
                              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{exercise.exercise}</p>
                                    <p className="text-sm text-gray-600 mt-1">{exercise.reason}</p>
                                  </div>
                                  <Badge variant="outline" className="ml-2 text-gray-500">
                                    {exercise.durationMinutes} min
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Recommendation */}
                      {challenge.aiRecommendationReason && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>AI Recommendation:</strong> {challenge.aiRecommendationReason}
                          </p>
                        </div>
                      )}

                      {/* Goal Tags */}
                      {challenge.goalTags && challenge.goalTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {challenge.goalTags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>

                      <div className="flex gap-3">
                        {challenge.category === 'TrikaVision' || challenge.category === 'Regular' ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                <Play className="w-4 h-4 mr-2" />
                                Continue Challenge
                                <ChevronDown className="w-4 h-4 ml-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                              {challenge.category === 'TrikaVision' && (
                                <DropdownMenuItem onClick={() => setShowTrikaVision(true)}>
                                  <Eye className="w-4 h-4 mr-2 text-purple-500" />
                                  <div>
                                    <div className="font-medium">Start with TrikaVision</div>
                                    <div className="text-xs text-gray-500">AI-powered form analysis</div>
                                  </div>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() =>
                                handleStandardStart(
                                  "Custom",
                                  challenge.exercises?.map(e => `${e.exercise}:${e.durationMinutes}`) || [],
                                  challenge.title || ""
                                )
                              }
                              >
                                <Play className="w-4 h-4 mr-2 text-green-500" />
                                <div>
                                  <div className="font-medium">Standard Workout</div>
                                  <div className="text-xs text-gray-500">Traditional workout mode</div>
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                            <Play className="w-4 h-4 mr-2" />
                            Continue Challenge
                          </Button>
                        )}
                        {/* <Button variant="outline">View Details</Button> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>


      </Tabs>
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
