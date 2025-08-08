"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Edit,
  Trash2,
  History,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add these imports at the top
import { FormModal } from "@/components/forms/form-modal";
import { HabitForm } from "@/components/forms/habit-form";
import { DeleteConfirmation } from "@/components/forms/delete-confirmation";
import { HabitHistoryModal } from "@/components/forms/habit-history-modal";
import { MarkCompleteModal } from "@/components/forms/mark-complete-modal";
import { useToast } from "@/hooks/use-toast";
import { stringify } from "querystring";

// const habits = [
//   {
//     id: 1,
//     name: "Morning Workout",
//     icon: "💪",
//     category: "Fitness",
//     streak: 12,
//     target: 7,
//     frequency: "Daily",
//     completedThisWeek: 5,
//     totalWeeks: 8,
//     weeklyData: [true, true, false, true, true, true, false],
//     monthlyCompletion: 85,
//     bestStreak: 18,
//     description: "30-minute morning exercise routine",
//   }
// ]
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // days in current month
const todayDate = today.getDate();

// Adjust start offset for Monday as first day of the week
const rawStartDay = new Date(currentYear, currentMonth, 1).getDay();
const firstDayOfMonth = (rawStartDay + 6) % 7;

const totalCells = 35;
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitsContent({ email }: { email: string }) {
  // Add state for modals in the component
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [habits, setHabits] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHabits = async () => {
      const res = await fetch(`/api/habits?email=${email}`);
      const data = await res.json();
      if (res.ok) setHabits(data);
      else console.error("Failed to fetch habits", data);
    };
    fetchHabits();
  }, [email]);

  const habitStats = {
    totalHabits: habits.length,
    activeStreaks: habits.filter((h) => h.streak > 0).length,
    longestStreak: Math.max(...habits.map((h) => h.bestStreak)),
    averageCompletion: Math.round(
      habits.reduce((acc, h) => acc + h.monthlyCompletion, 0) / habits.length
    ),
  };
  // Add these handler functions
  const handleAddHabit = async (data: any) => {
    try {
      console.log("Form data received:", data);
      
      // Map form data to the expected API structure
      const habitData = {
        userEmail: email,
        name: data.name,
        description: data.description || "",
        icon: data.icon || "🔥",
        category: data.category,
        streak: 0, // New habits start with 0 streak
        bestStreak: 0, // New habits start with 0 best streak
        target: data.target || 1,
        frequency: data.frequency || "daily",
        completedThisWeek: 0, // New habits start with 0 completed
        totalWeeks: 1, // New habits start with 1 week
        weeklyData: [false, false, false, false, false, false, false], // New habits start with all false
        monthlyCompletion: 0, // New habits start with 0% completion
      };

      console.log("Sending habit data:", habitData);

      const res = await fetch("/api/habits/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData),
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        let errorMessage = "Failed to add habit";
        const responseText = await res.text();
        
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.details || errorMessage;
            console.error("API Error details:", errorData);
          } catch (parseError) {
            errorMessage = responseText || errorMessage;
            console.error("Failed to parse error response:", parseError);
          }
        } else {
          // Handle empty response (likely MongoDB connection issue)
          errorMessage = `Server error (${res.status}): ${res.statusText}. Please check MongoDB connection.`;
        }
        
        console.error("Add habit failed:", errorMessage);
        return;
      }

      const newHabit = await res.json();
      console.log("Created habit:", newHabit);
      setHabits([...habits, newHabit]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    }
  };

  const handleEditHabit = async (data: any) => {
    const res = await fetch(`/api/habits/${selectedHabit._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    if (res.ok) {
      setHabits(habits.map((h) => (h._id === selectedHabit._id ? updated : h)));
      setSelectedHabit(null);
      setShowEditModal(false);
    }
  };

  const handleDeleteHabit = async () => {
    const res = await fetch(`/api/habits/${selectedHabit._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setHabits(habits.filter((h) => h._id !== selectedHabit._id));
      setSelectedHabit(null);
      setShowDeleteModal(false);
    }
  };

  const openEditModal = (habit: any) => {
    setSelectedHabit(habit);
    setShowEditModal(true);
  };

  const openDeleteModal = (habit: any) => {
    setSelectedHabit(habit);
    setShowDeleteModal(true);
  };

  const openHistoryModal = (habit: any) => {
    setSelectedHabit(habit);
    setShowHistoryModal(true);
  };

  const openCompleteModal = (habit: any) => {
    setSelectedHabit(habit);
    setShowCompleteModal(true);
  };

  const handleMarkComplete = async (habitId: string, notes?: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to mark habit as complete",
          variant: "destructive",
        });
        return;
      }

      const updatedHabit = await res.json();
      setHabits(habits.map((h) => (h._id === habitId ? updatedHabit : h)));
      
      toast({
        title: "Success!",
        description: `"${updatedHabit.name}" marked as complete!`,
      });
    } catch (error) {
      console.error("Failed to mark habit as complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark habit as complete",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Habit Tracker</h1>
          <p className="text-slate-400">
            Build consistency and track your daily habits
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-slate-600"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark-card hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Habits</p>
                <p className="text-2xl font-bold text-white">
                  {habitStats.totalHabits}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Streaks</p>
                <p className="text-2xl font-bold text-white">
                  {habitStats.activeStreaks}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Longest Streak</p>
                <p className="text-2xl font-bold text-white">
                  {habitStats.longestStreak}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Completion</p>
                <p className="text-2xl font-bold text-white">
                  {habitStats.averageCompletion}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <Card
                key={habit._id}
                className="dark-card hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <CardTitle className="text-lg text-white">
                          {habit.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {habit.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(habit)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteModal(habit)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{habit.category}</Badge>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-white">
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">
                        This Week ({habit.completedThisWeek}/{habit.target})
                      </span>
                      <span className="text-white">
                        {Math.round(
                          (habit.completedThisWeek / habit.target) * 100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={(habit.completedThisWeek / habit.target) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {habit.weeklyData.map(
                        (completed: boolean, index: number) => (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                              completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 text-slate-400"
                            }`}
                          >
                            {weekDays[index][0]}
                          </div>
                        )
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Monthly</p>
                      <p className="font-medium text-white">
                        {habit.monthlyCompletion}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openHistoryModal(habit)}
                    >
                      <History className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      onClick={() => openCompleteModal(habit)}
                      disabled={habit.isCompletedToday}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {habit.isCompletedToday ? "Completed Today" : "Mark Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="dark-card hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-white">
                Monthly Calendar View
              </CardTitle>
              <CardDescription className="text-slate-400">
                Track your habits across the month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-slate-400 p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: totalCells }, (_, i) => {
                  const dayNumber = i - firstDayOfMonth + 1;
                  const isCurrentMonth =
                    dayNumber > 0 && dayNumber <= daysInMonth;
                  const isToday = isCurrentMonth && dayNumber === todayDate;

                  return (
                    <div
                      key={i}
                      className={`aspect-square border rounded-lg p-1 ${
                        isCurrentMonth
                          ? "border-gray-200"
                          : "border-transparent"
                      } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      {isCurrentMonth && (
                        <>
                          <div className="text-xs text-slate-400 mb-1">
                            {dayNumber}
                          </div>
                          <div className="space-y-1">
                            {habits.slice(0, 3).map((habit) => (
                              <div
                                key={habit._id}
                                className={`w-2 h-2 rounded-full ${
                                  Math.random() > 0.3
                                    ? "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dark-card hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-white">Completion Trends</CardTitle>
                <CardDescription className="text-slate-400">
                  Your habit completion over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habits.map((habit) => (
                    <div key={habit._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{habit.icon}</span>
                          <span className="font-medium text-white">
                            {habit.name}
                          </span>
                        </div>
                        <span className="text-sm text-slate-400">
                          {habit.monthlyCompletion}%
                        </span>
                      </div>
                      <Progress
                        value={habit.monthlyCompletion}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark-card hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-white">Streak Records</CardTitle>
                <CardDescription className="text-slate-400">
                  Your best and current streaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habits.map((habit) => (
                    <div
                      key={habit._id}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{habit.icon}</span>
                        <div>
                          <p className="font-medium text-white">{habit.name}</p>
                          <p className="text-sm text-slate-400">
                            Current: {habit.streak} days
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-600">
                          {habit.bestStreak}
                        </p>
                        <p className="text-xs text-slate-400">Best streak</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Habit"
      >
        <HabitForm
          onSubmit={handleAddHabit}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>

      <FormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Habit"
      >
        <HabitForm
          habit={selectedHabit}
          onSubmit={handleEditHabit}
          onCancel={() => setShowEditModal(false)}
        />
      </FormModal>

      <FormModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Habit"
      >
        <DeleteConfirmation
          title="Delete Habit"
          message="Are you sure you want to delete this habit?"
          itemName={selectedHabit?.name || ""}
          onConfirm={handleDeleteHabit}
          onCancel={() => setShowDeleteModal(false)}
        />
      </FormModal>

      <HabitHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        habitId={selectedHabit?._id || ""}
        habitName={selectedHabit?.name || ""}
      />

      <MarkCompleteModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        habit={selectedHabit}
        onComplete={handleMarkComplete}
      />
    </div>
  );
}
