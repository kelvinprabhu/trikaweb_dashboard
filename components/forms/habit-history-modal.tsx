"use client";

import { useState, useEffect } from "react";
import { X, Calendar, TrendingUp, Award, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HabitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitId: string;
  habitName: string;
}

interface HistoryEntry {
  date: string;
  completed: boolean;
  notes?: string;
  timestamp: string;
}

interface HistoryData {
  habit: {
    id: string;
    name: string;
    icon: string;
    category: string;
    streak: number;
    bestStreak: number;
  };
  history: Record<string, HistoryEntry[]>;
  statistics: {
    totalCompletions: number;
    completionRate: number;
    daysTracked: number;
    currentStreak: number;
    bestStreak: number;
  };
}

export function HabitHistoryModal({
  isOpen,
  onClose,
  habitId,
  habitName,
}: HabitHistoryModalProps) {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(30);

  useEffect(() => {
    if (isOpen && habitId) {
      fetchHistory();
    }
  }, [isOpen, habitId, selectedDays]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/habits/${habitId}/history?days=${selectedDays}`);
      console.log("History response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("History data received:", data);
        setHistoryData(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch history:", response.status, errorText);
        
        // Try to parse error as JSON
        try {
          const errorData = JSON.parse(errorText);
          console.error("Error details:", errorData);
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "text-green-500";
    if (streak >= 3) return "text-yellow-500";
    return "text-blue-500";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Habit History</h2>
              <p className="text-gray-600">{habitName}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : historyData ? (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Current Streak</p>
                          <p className={`text-2xl font-bold ${getStreakColor(historyData.statistics.currentStreak)}`}>
                            {historyData.statistics.currentStreak}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Best Streak</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {historyData.statistics.bestStreak}
                          </p>
                        </div>
                        <Award className="w-8 h-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Completion Rate</p>
                          <p className="text-2xl font-bold text-green-600">
                            {historyData.statistics.completionRate}%
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Completions</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {historyData.statistics.totalCompletions}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Time Range:</span>
                  <div className="flex gap-2">
                    {[7, 30, 90].map((days) => (
                      <Button
                        key={days}
                        variant={selectedDays === days ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDays(days)}
                      >
                        {days} days
                      </Button>
                    ))}
                  </div>
                </div>

                {/* History Tabs */}
                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="calendar" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Completion Calendar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-80">
                          <div className="grid grid-cols-7 gap-1 p-4">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                                {day}
                              </div>
                            ))}
                            {Array.from({ length: 35 }, (_, i) => {
                              const date = new Date();
                              date.setDate(date.getDate() - (34 - i));
                              const dateKey = date.toISOString().split('T')[0];
                              const hasCompletion = historyData.history[dateKey]?.some(entry => entry.completed);
                              const isToday = i === 34;

                              return (
                                <div
                                  key={i}
                                  className={`aspect-square border rounded p-1 ${
                                    hasCompletion
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-200"
                                  } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                                >
                                  <div className="text-xs text-gray-600">
                                    {date.getDate()}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="list" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Completions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-80">
                          <div className="space-y-3 p-4">
                            {Object.entries(historyData.history)
                              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                              .map(([date, entries]) => (
                                <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {formatDate(date)}
                                      </p>
                                      {entries[0]?.notes && (
                                        <p className="text-sm text-gray-600">
                                          {entries[0].notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    Completed
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No history data available</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
