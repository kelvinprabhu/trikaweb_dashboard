"use client"

import { useState } from "react"
import { Calendar, Clock, Plus, Edit, Trash2, Play, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormModal } from "@/components/forms/form-modal"
import { ScheduleForm } from "@/components/forms/schedule-form"
import { DeleteConfirmation } from "@/components/forms/delete-confirmation"

const todaySchedule = [
  {
    id: 1,
    time: "07:00",
    activity: "Morning Yoga Flow",
    type: "Exercise",
    duration: "30 min",
    status: "completed",
    category: "Flexibility",
    calories: 120,
    description: "Gentle morning yoga to start the day",
  },
  {
    id: 2,
    time: "08:30",
    activity: "Healthy Breakfast",
    type: "Nutrition",
    duration: "20 min",
    status: "completed",
    category: "Meal",
    calories: 350,
    description: "Oatmeal with berries and nuts",
  },
  {
    id: 3,
    time: "12:00",
    activity: "Mindfulness Check-in",
    type: "Meditation",
    duration: "10 min",
    status: "active",
    category: "Mental Health",
    description: "Brief meditation and breathing exercise",
  },
  {
    id: 4,
    time: "14:00",
    activity: "HIIT Workout",
    type: "Exercise",
    duration: "45 min",
    status: "upcoming",
    category: "Cardio",
    calories: 400,
    description: "High-intensity interval training session",
  },
  {
    id: 5,
    time: "16:30",
    activity: "Protein Smoothie",
    type: "Nutrition",
    duration: "5 min",
    status: "upcoming",
    category: "Snack",
    calories: 250,
    description: "Post-workout recovery smoothie",
  },
  {
    id: 6,
    time: "19:00",
    activity: "Evening Walk",
    type: "Exercise",
    duration: "30 min",
    status: "upcoming",
    category: "Cardio",
    calories: 150,
    description: "Relaxing walk in the neighborhood",
  },
  {
    id: 7,
    time: "21:00",
    activity: "Sleep Preparation",
    type: "Wellness",
    duration: "30 min",
    status: "upcoming",
    category: "Recovery",
    description: "Wind down routine and sleep hygiene",
  },
]

const weeklySchedule = [
  {
    day: "Monday",
    date: "Dec 16",
    activities: [
      { time: "07:00", activity: "Morning Run", type: "Cardio", duration: "45 min" },
      { time: "12:00", activity: "Meditation", type: "Mindfulness", duration: "15 min" },
      { time: "18:00", activity: "Strength Training", type: "Strength", duration: "60 min" },
    ],
  },
  {
    day: "Tuesday",
    date: "Dec 17",
    activities: [
      { time: "07:30", activity: "Yoga", type: "Flexibility", duration: "30 min" },
      { time: "12:00", activity: "Breathing Exercise", type: "Mindfulness", duration: "10 min" },
      { time: "17:00", activity: "Swimming", type: "Cardio", duration: "45 min" },
    ],
  },
  {
    day: "Wednesday",
    date: "Dec 18",
    activities: [
      { time: "07:00", activity: "HIIT Workout", type: "Cardio", duration: "30 min" },
      { time: "12:00", activity: "Mindful Eating", type: "Nutrition", duration: "30 min" },
      { time: "19:00", activity: "Pilates", type: "Core", duration: "45 min" },
    ],
  },
  {
    day: "Thursday",
    date: "Dec 19",
    activities: [
      { time: "07:30", activity: "Morning Walk", type: "Cardio", duration: "30 min" },
      { time: "12:00", activity: "Meditation", type: "Mindfulness", duration: "20 min" },
      { time: "18:00", activity: "Weight Training", type: "Strength", duration: "60 min" },
    ],
  },
  {
    day: "Friday",
    date: "Dec 20",
    activities: [
      { time: "07:00", activity: "Yoga Flow", type: "Flexibility", duration: "45 min" },
      { time: "12:00", activity: "Gratitude Practice", type: "Mindfulness", duration: "10 min" },
      { time: "17:30", activity: "Dance Workout", type: "Cardio", duration: "40 min" },
    ],
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Personal Training Session",
    date: "Tomorrow",
    time: "10:00 AM",
    duration: "60 min",
    trainer: "Sarah Johnson",
    location: "Gym Studio A",
    type: "Strength Training",
  },
  {
    id: 2,
    title: "Nutrition Consultation",
    date: "Dec 20",
    time: "2:00 PM",
    duration: "45 min",
    trainer: "Dr. Mike Chen",
    location: "Virtual Meeting",
    type: "Consultation",
  },
  {
    id: 3,
    title: "Group Yoga Class",
    date: "Dec 22",
    time: "9:00 AM",
    duration: "75 min",
    trainer: "Emma Wilson",
    location: "Studio B",
    type: "Flexibility",
  },
]

export function ScheduleContent() {
  const [selectedDate, setSelectedDate] = useState("today")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "active":
        return <Play className="w-4 h-4 text-blue-600" />
      case "upcoming":
        return <Clock className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const handleAddEvent = (data: any) => {
    console.log("Adding event:", data)
    setShowAddModal(false)
    // Add API call here
  }

  const handleEditEvent = (data: any) => {
    console.log("Editing event:", data)
    setShowEditModal(false)
    setSelectedEvent(null)
    // Add API call here
  }

  const handleDeleteEvent = () => {
    console.log("Deleting event:", selectedEvent)
    setShowDeleteModal(false)
    setSelectedEvent(null)
    // Add API call here
  }

  const openEditModal = (event: any) => {
    setSelectedEvent(event)
    setShowEditModal(true)
  }

  const openDeleteModal = (event: any) => {
    setSelectedEvent(event)
    setShowDeleteModal(true)
  }

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Schedule</h1>
          <p className="text-slate-400">Plan and track your fitness activities</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-slate-600" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Schedule - December 16, 2024
              </CardTitle>
              <CardDescription className="text-slate-400">Your planned activities for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div className="text-sm font-mono text-gray-600 min-w-[60px]">{item.time}</div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white">{item.activity}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Duration: {item.duration}</span>
                        {item.calories && <span>Calories: {item.calories}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteModal(item)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {item.status === "upcoming" && (
                        <Button size="sm" className="bg-gradient-to-r from-red-500 to-blue-500">
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {weeklySchedule.map((day, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow dark-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{day.day}</CardTitle>
                  <CardDescription className="text-slate-400">{day.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-mono text-gray-600 min-w-[50px]">{activity.time}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-white">{activity.activity}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{activity.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow dark-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{event.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {event.date} at {event.time}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium text-white">{event.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-medium text-white">{event.location}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Trainer/Instructor</p>
                    <p className="font-medium text-white">{event.trainer}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Reschedule
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-red-500 to-blue-500">
                      Join Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <FormModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Activity">
        <ScheduleForm onSubmit={handleAddEvent} onCancel={() => setShowAddModal(false)} />
      </FormModal>

      <FormModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Activity">
        <ScheduleForm event={selectedEvent} onSubmit={handleEditEvent} onCancel={() => setShowEditModal(false)} />
      </FormModal>

      <FormModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Activity">
        <DeleteConfirmation
          title="Delete Activity"
          message="Are you sure you want to delete this activity?"
          itemName={selectedEvent?.activity || selectedEvent?.title || ""}
          onConfirm={handleDeleteEvent}
          onCancel={() => setShowDeleteModal(false)}
        />
      </FormModal>
    </div>
  )
}
