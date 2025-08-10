"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Target,
  Clock,
  Zap,
  Users,
  ArrowLeft,
  Filter,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Exercise library (same as in standard-mode)
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
  ],
  flexibility: [
    { name: "Stretching", met: 2.3, guidance: "Hold each stretch for 15-30 seconds", category: "flexibility" },
    { name: "Yoga Flow", met: 3.0, guidance: "Focus on your breathing and smooth transitions", category: "flexibility" },
    { name: "Dynamic Stretching", met: 3.5, guidance: "Move through your full range of motion", category: "flexibility" },
    { name: "Pilates", met: 3.7, guidance: "Focus on core engagement and precise movements", category: "flexibility" }
  ]
}

interface WorkoutTemplate {
  id: string
  name: string
  category: string
  description: string
  exercises: Array<{name: string, duration: number, category: string}>
  estimatedDuration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

// Default workout templates
const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: '1',
    name: 'Quick HIIT Cardio',
    category: 'cardio',
    description: 'High-intensity interval training for maximum calorie burn',
    exercises: [
      { name: 'Jumping Jacks', duration: 1, category: 'cardio' },
      { name: 'Burpees', duration: 1, category: 'cardio' },
      { name: 'High Knees', duration: 1, category: 'cardio' },
      { name: 'Mountain Climbers', duration: 1, category: 'cardio' }
    ],
    estimatedDuration: 15,
    difficulty: 'intermediate',
    tags: ['hiit', 'cardio', 'fat-burn']
  },
  {
    id: '2',
    name: 'Bodyweight Strength',
    category: 'strength',
    description: 'Build strength using only your body weight',
    exercises: [
      { name: 'Push-ups', duration: 2, category: 'strength' },
      { name: 'Squats', duration: 2, category: 'strength' },
      { name: 'Lunges', duration: 2, category: 'strength' },
      { name: 'Plank', duration: 1, category: 'strength' }
    ],
    estimatedDuration: 20,
    difficulty: 'beginner',
    tags: ['bodyweight', 'strength', 'beginner']
  },
  {
    id: '3',
    name: 'Core Crusher',
    category: 'core',
    description: 'Intense core workout for a strong midsection',
    exercises: [
      { name: 'Russian Twists', duration: 1.5, category: 'core' },
      { name: 'Bicycle Crunches', duration: 1.5, category: 'core' },
      { name: 'V-ups', duration: 1, category: 'core' },
      { name: 'Side Plank', duration: 1, category: 'core' }
    ],
    estimatedDuration: 12,
    difficulty: 'advanced',
    tags: ['core', 'abs', 'advanced']
  }
]

export default function WorkoutTemplatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(DEFAULT_TEMPLATES)
  const [isCreating, setIsCreating] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  // New template form state
  const [newTemplate, setNewTemplate] = useState<Partial<WorkoutTemplate>>({
    name: '',
    category: 'cardio',
    description: '',
    exercises: [],
    difficulty: 'beginner',
    tags: []
  })

  const getAllExercises = () => {
    const allExercises: Array<{name: string, met: number, guidance: string, category: string}> = []
    Object.values(EXERCISE_LIBRARY).forEach(categoryExercises => {
      allExercises.push(...categoryExercises)
    })
    return allExercises.sort((a, b) => a.name.localeCompare(b.name))
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || template.difficulty === difficultyFilter
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const addExerciseToTemplate = () => {
    setNewTemplate(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), { name: '', duration: 2, category: 'cardio' }]
    }))
  }

  const removeExerciseFromTemplate = (index: number) => {
    setNewTemplate(prev => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index) || []
    }))
  }

  const updateTemplateExercise = (index: number, field: 'name' | 'duration', value: string | number) => {
    setNewTemplate(prev => {
      const exercises = [...(prev.exercises || [])]
      exercises[index] = { ...exercises[index], [field]: value }
      return { ...prev, exercises }
    })
  }

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.exercises?.length) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and at least one exercise",
        variant: "destructive"
      })
      return
    }

    const template: WorkoutTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name!,
      category: newTemplate.category!,
      description: newTemplate.description!,
      exercises: newTemplate.exercises!,
      estimatedDuration: newTemplate.exercises!.reduce((sum, ex) => sum + ex.duration, 0),
      difficulty: newTemplate.difficulty!,
      tags: newTemplate.tags!
    }

    setTemplates(prev => [...prev, template])
    setIsCreating(false)
    setNewTemplate({
      name: '',
      category: 'cardio',
      description: '',
      exercises: [],
      difficulty: 'beginner',
      tags: []
    })

    toast({
      title: "Template Created",
      description: "Your workout template has been saved successfully!"
    })
  }

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id))
    toast({
      title: "Template Deleted",
      description: "The workout template has been removed."
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cardio': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'strength': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'flexibility': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'bodyweight': return 'bg-green-100 text-green-800 border-green-200'
      case 'endurance': return 'bg-red-100 text-red-800 border-red-200'
      case 'core': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Workout Templates</h1>
              <p className="text-gray-600">Manage and create custom workout templates</p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="bodyweight">Bodyweight</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="core">Core</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {template.estimatedDuration}m
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {template.exercises.length} exercises
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500">EXERCISES</p>
                    <div className="text-sm text-gray-600">
                      {template.exercises.map((ex, i) => (
                        <span key={i}>
                          {ex.name}
                          {i < template.exercises.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create/Edit Template Modal */}
        {(isCreating || editingTemplate) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {isCreating ? 'Create New Template' : 'Edit Template'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingTemplate(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <ScrollArea className="max-h-[calc(90vh-120px)]">
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter template name"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={newTemplate.category}
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="flexibility">Flexibility</SelectItem>
                          <SelectItem value="bodyweight">Bodyweight</SelectItem>
                          <SelectItem value="endurance">Endurance</SelectItem>
                          <SelectItem value="core">Core</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this workout template"
                    />
                  </div>

                  <div>
                    <Label>Difficulty</Label>
                    <Select
                      value={newTemplate.difficulty}
                      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                        setNewTemplate(prev => ({ ...prev, difficulty: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Exercises</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addExerciseToTemplate}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Exercise
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {newTemplate.exercises?.map((exercise, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Select
                            value={exercise.name}
                            onValueChange={(value) => updateTemplateExercise(index, 'name', value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select exercise" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {Object.entries(EXERCISE_LIBRARY).map(([category, exercises]) => (
                                <div key={category}>
                                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                    {category}
                                  </div>
                                  {exercises.map((ex) => (
                                    <SelectItem key={ex.name} value={ex.name}>
                                      {ex.name}
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={exercise.duration}
                            onChange={(e) => updateTemplateExercise(index, 'duration', parseFloat(e.target.value) || 0)}
                            className="w-20"
                            min="0.5"
                            step="0.5"
                          />
                          <span className="text-sm text-gray-500">min</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExerciseFromTemplate(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={saveTemplate}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Template
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
                        setEditingTemplate(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
