"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Plus, Edit, Trash2, Play, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormModal } from "@/components/forms/form-modal"
import { ScheduleForm } from "@/components/forms/schedule-form"
import { DeleteConfirmation } from "@/components/forms/delete-confirmation"
import { useToast } from "@/hooks/use-toast"

interface ScheduleItem {
  _id: string
  userEmail: string
  title: string
  description?: string
  type: string
  date: string
  time?: string
  duration?: number
  location?: string
  priority: string
  repeat: string
  customRepeat?: string
  reminder: number
  notes?: string
  isAllDay: boolean
  isPrivate: boolean
  attendees?: string
  equipment?: string
  calories?: number
  status: string
  category?: string
  completedAt?: string
  cancelledAt?: string
  createdAt: string
  updatedAt: string
  isHabit?: boolean
  habitId?: string
  streak?: number
  bestStreak?: number
  isCompletedToday?: boolean
}

export function ScheduleContent({ email }: { email: string }) {
  const [selectedDate, setSelectedDate] = useState("today")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null)
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  // Fetch schedules
  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/schedule?userEmail=${email}&date=${today}`)

      if (response.ok) {
        const data = await response.json()
        setSchedules(data.schedules || [])
      } else {
        const errorText = await response.text()
        console.error("Failed to fetch schedules:", response.status, errorText)
        toast({
          title: "Error",
          description: "Failed to load schedules",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast({
        title: "Error",
        description: "Failed to load schedules",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter schedules (non-habits)
  const regularSchedules = schedules.filter(item => !item.isHabit)

  // Filter habits only
  const habitSchedules = schedules.filter(item => item.isHabit)

  useEffect(() => {
    if (email) {
      fetchSchedules()
    }
  }, [email])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
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
      case "cancelled":
        return <Clock className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const handleAddEvent = async (data: any) => {
    setRefreshing(true)
    try {
      const response = await fetch("/api/schedule/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Activity added successfully",
        })
        setShowAddModal(false)
        fetchSchedules() // Refresh the list
      } else {
        const errorText = await response.text()
        console.error("Add schedule failed:", response.status, errorText)
        toast({
          title: "Error",
          description: "Failed to add activity",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding schedule:", error)
      toast({
        title: "Error",
        description: "Failed to add activity",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleEditEvent = async (data: any) => {
    if (!selectedEvent) return

    setRefreshing(true)
    try {
      const response = await fetch(`/api/schedule/${selectedEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Activity updated successfully",
        })
        setShowEditModal(false)
        setSelectedEvent(null)
        fetchSchedules() // Refresh the list
      } else {
        const errorText = await response.text()
        console.error("Update schedule failed:", response.status, errorText)
        toast({
          title: "Error",
          description: "Failed to update activity",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating schedule:", error)
      toast({
        title: "Error",
        description: "Failed to update activity",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    setRefreshing(true)
    try {
      const response = await fetch(`/api/schedule/${selectedEvent._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Activity deleted successfully",
        })
        setShowDeleteModal(false)
        setSelectedEvent(null)
        fetchSchedules() // Refresh the list
      } else {
        const errorText = await response.text()
        console.error("Delete schedule failed:", response.status, errorText)
        toast({
          title: "Error",
          description: "Failed to delete activity",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting schedule:", error)
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleStatusUpdate = async (scheduleId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/schedule/${scheduleId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Activity marked as ${newStatus}`,
        })
        fetchSchedules() // Refresh the list
      } else {
        const errorText = await response.text()
        console.error("Status update failed:", response.status, errorText)
        toast({
          title: "Error",
          description: "Failed to update activity status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update activity status",
        variant: "destructive",
      })
    }
  }

  const openEditModal = (event: ScheduleItem) => {
    setSelectedEvent(event)
    setShowEditModal(true)
  }

  const openDeleteModal = (event: ScheduleItem) => {
    setSelectedEvent(event)
    setShowDeleteModal(true)
  }

  const formatTime = (time?: string) => {
    if (!time) return ""
    return time
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return ""
    return `${duration} min`
  }

  const getCategoryFromType = (type: string) => {
    const categoryMap: { [key: string]: string } = {
      exercise: "Exercise",
      meditation: "Meditation",
      nutrition: "Nutrition",
      wellness: "Wellness",
      appointment: "Appointment",
      reminder: "Reminder",
      habit: "Habit",
    }
    return categoryMap[type] || type
  }

  const handleHabitComplete = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Habit marked as complete!",
        })
        fetchSchedules() // Refresh the list
      } else {
        const errorText = await response.text()
        console.error("Habit completion failed:", response.status, errorText)
        toast({
          title: "Error",
          description: "Failed to complete habit",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error completing habit:", error)
      toast({
        title: "Error",
        description: "Failed to complete habit",
        variant: "destructive",
      })
    }
  }

  const getHabitStatus = (item: ScheduleItem) => {
    if (!item.isHabit) return item.status

    if (item.isCompletedToday) return "completed"
    return "upcoming"
  }

  const getHabitStatusColor = (item: ScheduleItem) => {
    if (!item.isHabit) return getStatusColor(item.status)

    if (item.isCompletedToday) return "bg-green-100 text-green-800"
    return "bg-purple-100 text-purple-800"
  }

  const getHabitStatusIcon = (item: ScheduleItem) => {
    if (!item.isHabit) return getStatusIcon(item.status)

    if (item.isCompletedToday) return <CheckCircle className="w-4 h-4 text-green-600" />
    return <Clock className="w-4 h-4 text-purple-600" />
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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="habit">Today (Habits)</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          {/* <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger> */}
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Schedule - {new Date().toLocaleDateString()}
              </CardTitle>
              <CardDescription className="text-slate-400">Your planned activities for today</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : regularSchedules.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No activities scheduled for today</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Activity
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {regularSchedules.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        {getHabitStatusIcon(item)}
                        <div className="text-sm font-mono text-gray-600 min-w-[60px]">
                          {formatTime(item.time)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{item.title}</h3>
                          {item.isHabit && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              🏷️ Tagged Habit
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryFromType(item.type)}
                          </Badge>
                          <Badge className={`text-xs ${getHabitStatusColor(item)}`}>{getHabitStatus(item)}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Duration: {formatDuration(item.duration)}</span>
                          {item.calories && <span>Calories: {item.calories}</span>}
                          {item.location && <span>Location: {item.location}</span>}
                          {item.isHabit && item.streak && (
                            <span className="text-purple-600 font-medium">Streak: {item.streak} days</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!item.isHabit && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteModal(item)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {!item.isHabit && item.status === "upcoming" && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-red-500 to-blue-500"
                            onClick={() => handleStatusUpdate(item._id, "active")}
                          >
                            Start
                          </Button>
                        )}
                        {!item.isHabit && item.status === "active" && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleStatusUpdate(item._id, "completed")}
                          >
                            Complete
                          </Button>
                        )}
                        {item.isHabit && !item.isCompletedToday && (
                          <Button
                            size="sm"
                            className="bg-purple-500 hover:bg-purple-600"
                            onClick={() => handleHabitComplete(item.habitId || "")}
                          >
                            Complete Habit
                          </Button>
                        )}
                        {item.isHabit && item.isCompletedToday && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            ✓ Completed Today
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="habit" className="space-y-4">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Habbits Schedule - {new Date().toLocaleDateString()}
              </CardTitle>
              <CardDescription className="text-slate-400">Your planned activities for today</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : habitSchedules.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No habits created yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.href = '/habits'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Go to Habits Page
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {habitSchedules.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        {getHabitStatusIcon(item)}
                        <div className="text-sm font-mono text-gray-600 min-w-[60px]">
                          {formatTime(item.time)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{item.title}</h3>
                          {item.isHabit && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              🏷️ Tagged Habit
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryFromType(item.type)}
                          </Badge>
                          <Badge className={`text-xs ${getHabitStatusColor(item)}`}>{getHabitStatus(item)}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Duration: {formatDuration(item.duration)}</span>
                          {item.calories && <span>Calories: {item.calories}</span>}
                          {item.location && <span>Location: {item.location}</span>}
                          {item.isHabit && item.streak && (
                            <span className="text-purple-600 font-medium">Streak: {item.streak} days</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!item.isHabit && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteModal(item)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {!item.isHabit && item.status === "upcoming" && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-red-500 to-blue-500"
                            onClick={() => handleStatusUpdate(item._id, "active")}
                          >
                            Start
                          </Button>
                        )}
                        {!item.isHabit && item.status === "active" && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleStatusUpdate(item._id, "completed")}
                          >
                            Complete
                          </Button>
                        )}
                        {item.isHabit && !item.isCompletedToday && (
                          <Button
                            size="sm"
                            className="bg-purple-500 hover:bg-purple-600"
                            onClick={() => handleHabitComplete(item.habitId || "")}
                          >
                            Complete Habit
                          </Button>
                        )}
                        {item.isHabit && item.isCompletedToday && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            ✓ Completed Today
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="text-white">This Week's Overview</CardTitle>
              <CardDescription className="text-slate-400">Weekly schedule overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">Weekly view coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Events</CardTitle>
              <CardDescription className="text-slate-400">Future scheduled activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">Upcoming events view coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FormModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Activity">
        <ScheduleForm
          userEmail={email}
          onSubmit={handleAddEvent}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>

      <FormModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Activity">
        <ScheduleForm
          userEmail={email}
          event={selectedEvent}
          onSubmit={handleEditEvent}
          onCancel={() => setShowEditModal(false)}
        />
      </FormModal>

      <FormModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Activity">
        <DeleteConfirmation
          title="Delete Activity"
          message="Are you sure you want to delete this activity?"
          itemName={selectedEvent?.title || ""}
          onConfirm={handleDeleteEvent}
          onCancel={() => setShowDeleteModal(false)}
        />
      </FormModal>
    </div>
  )
}
