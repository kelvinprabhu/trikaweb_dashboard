"use client";

import { useState } from "react";
import { X, CheckCircle, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface MarkCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: any;
  onComplete: (habitId: string, notes?: string) => void;
}

export function MarkCompleteModal({
  isOpen,
  onClose,
  habit,
  onComplete,
}: MarkCompleteModalProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete(habit._id, notes);
      setNotes("");
      onClose();
    } catch (error) {
      console.error("Failed to mark habit as complete:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mark Complete</h2>
              <p className="text-gray-600">{habit.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Habit Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{habit.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                  <p className="text-sm text-gray-600">{habit.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-lg font-bold text-blue-600">{habit.streak}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Best Streak</p>
                  <p className="text-lg font-bold text-yellow-600">{habit.bestStreak}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did it go? Any notes about today's completion..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Completion Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Completion Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Streak</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {habit.streak + 1} days
                </Badge>
              </div>
              {notes && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notes</span>
                  <span className="text-sm text-gray-900 max-w-xs truncate">
                    {notes}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Completing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
