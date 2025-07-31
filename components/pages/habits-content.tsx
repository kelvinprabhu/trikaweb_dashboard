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

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitsContent({ email }: { email: string }) {
  // Add state for modals in the component
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [habits, setHabits] = useState<any[]>([]);

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
  const res = await fetch("/api/habits/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, userEmail: email }),
  })
  const newHabit = await res.json()
  if (res.ok) {
    setHabits([...habits, newHabit])
    setShowAddModal(false)
  }
}


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
                key={habit.id}
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
                    <Button variant="outline" size="sm" className="flex-1">
                      View History
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-slate-600"
                    >
                      Mark Complete
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
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNumber = i - 6 + 1;
                  const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
                  const isToday = dayNumber === 15; // Mock today

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
                                key={habit.id}
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
                    <div key={habit.id} className="space-y-2">
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
                      key={habit.id}
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
    </div>
  );
}
