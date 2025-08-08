"use client"
import {useEffect,useState} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Clock, Users, Flame, Star, Play, Eye, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export function ChallengesContent({email}:{email:string}) {
  const router = useRouter()
const [challenges, setChallenges] = useState([]);

// useEffect(() => {
//   fetch('/api/global-challenges')
//     .then(res => res.json())
//     .then(data => setChallenges(data));
//   console.warn(challenges)
// }, []);
  const handleTrikaVisionStart = (workoutType: string) => {
    router.push(`/trika-vision?workout=${encodeURIComponent(workoutType)}`)
  }

  // const global_challenges = [
  //   {
  //     id: 1,
  //     title: "30-Day Push-Up Challenge",
  //     description: "Build upper body strength with progressive push-up training",
  //     difficulty: "Intermediate",
  //     duration: "30 days",
  //     participants: 1247,
  //     progress: 67,
  //     daysLeft: 10,
  //     workoutType: "Push-Up",
  //     badge: "💪",
  //     color: "from-orange-500 to-red-500",
  //   },
  //   {
  //     id: 2,
  //     title: "Squat Master Challenge",
  //     description: "Perfect your squat form and build leg strength",
  //     difficulty: "Beginner",
  //     duration: "21 days",
  //     participants: 892,
  //     progress: 43,
  //     daysLeft: 12,
  //     workoutType: "Squat",
  //     badge: "🦵",
  //     color: "from-blue-500 to-purple-500",
  //   },
  //   {
  //     id: 3,
  //     title: "Plank Endurance Challenge",
  //     description: "Build core strength with progressive plank holds",
  //     difficulty: "Advanced",
  //     duration: "14 days",
  //     participants: 634,
  //     progress: 85,
  //     daysLeft: 2,
  //     workoutType: "Plank",
  //     badge: "🔥",
  //     color: "from-green-500 to-teal-500",
  //   },
  // ]

  const weeklyGoals = [
    {
      title: "Cardio Minutes",
      current: 180,
      target: 300,
      unit: "min",
    },
    {
      title: "Strength Sessions",
      current: 3,
      target: 5,
      unit: "sessions",
    },
    {
      title: "Active Days",
      current: 5,
      target: 7,
      unit: "days",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Challenges</h1>
          <p className="text-gray-600 text-sm lg:text-base">Push your limits and achieve your fitness goals</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Trophy className="w-4 h-4 mr-2" />
          View Leaderboard
        </Button>
      </div>
      <Tabs defaultValue="custom" className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-2">
          {/* <TabsTrigger value="global" className="text-xs lg:text-sm">
            Global Challenges
          </TabsTrigger> */}
          <TabsTrigger value="custom" className="text-xs lg:text-sm">
            Personal Challenges
          </TabsTrigger>
          <TabsTrigger value="goals" className="text-xs lg:text-sm">
            Weekly Goals
          </TabsTrigger>

        </TabsList>

        {/* <TabsContent value="global" className="space-y-4 lg:space-y-6"> */}
                {/* Active Challenges */}
      {/* <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white-900 lg:text-base">Active Global Challenges</h2>
        <div className="grid gap-6">
          {global_challenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
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
                      {challenge.duration}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {challenge.participants.toLocaleString()} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{challenge.progress}% complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{challenge.daysLeft} days left</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
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
                      <DropdownMenuItem onClick={() => handleTrikaVisionStart(challenge.workoutType)}>
                        <Eye className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">Start with TrikaVision</div>
                          <div className="text-xs text-gray-500">AI-powered form analysis</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
      </div> */}
        {/* </TabsContent> */}

        <TabsContent value="custom" className="space-y-4 lg:space-y-6">
      {/* personal Challenges */}
      {/* <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white-900 lg:text-base">Personal global_challenges</h2>
        <div className="grid gap-6">
          {global_challenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
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
                      {challenge.duration}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {challenge.participants.toLocaleString()} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{challenge.progress}% complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{challenge.daysLeft} days left</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
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
                      <DropdownMenuItem onClick={() => handleTrikaVisionStart(challenge.workoutType)}>
                        <Eye className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">Start with TrikaVision</div>
                          <div className="text-xs text-gray-500">AI-powered form analysis</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Play className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">Standard Workout</div>
                          <div className="text-xs text-gray-500">Traditional workout mode</div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4 lg:space-y-6">
              {/* Weekly Goals */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white-900">Weekly Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weeklyGoals.map((goal, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{goal.current}</span>
                    <span className="text-sm text-gray-600">
                      / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} />
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {Math.round((goal.current / goal.target) * 100)}% complete
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
        </TabsContent>


      </Tabs>

      


    </div>
  )
}
