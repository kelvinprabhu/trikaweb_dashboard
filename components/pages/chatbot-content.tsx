"use client"

import { useState } from "react"
import { Send, Bot, User, Mic, MicOff, Settings, History, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import ServerStatusBadge from "@/components/server-status-badge";
interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface Conversation {
  sessionId: string
  title: string
  totalMessages: number
  lastActivity: Date
  createdAt: Date
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "bot",
    content:
      "Hello! I'm your AI fitness assistant. I can help you with workout plans, nutrition advice, form corrections, and answer any fitness-related questions. How can I assist you today?",
    timestamp: new Date(),
    suggestions: ["Create a workout plan", "Nutrition advice", "Form check tips", "Track my progress"],
  },
]

const quickActions = [
  { label: "Plan my week", icon: "📅" },
  { label: "Suggest a workout", icon: "💪" },
  { label: "Meal recommendations", icon: "🥗" },
  { label: "Check my progress", icon: "📊" },
  { label: "Motivation boost", icon: "🔥" },
  { label: "Recovery tips", icon: "😴" },
]

export function ChatbotContent({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showConversationHistory, setShowConversationHistory] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          query: currentInput,
          sessionId: sessionId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update session ID if it's a new conversation
        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId)
        }

        const botResponse: Message = {
          id: messages.length + 2,
          type: "bot",
          content: data.response,
          timestamp: new Date(),
          suggestions: generateSuggestions(currentInput),
        }
        setMessages((prev) => [...prev, botResponse])
      } else {
        const errorData = await response.json()
        console.error("Chatbot API error:", errorData)
        
        const errorResponse: Message = {
          id: messages.length + 2,
          type: "bot",
          content: "I'm sorry, I'm having trouble connecting to my services right now. Please try again later.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorResponse])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      
      const errorResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: "I'm sorry, there was an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("workout") || lowerInput.includes("exercise")) {
      return "I'd be happy to help you with a workout! Based on your fitness level and goals, I can create a personalized routine. What type of workout are you interested in today? Strength training, cardio, flexibility, or a full-body session?"
    }

    if (lowerInput.includes("nutrition") || lowerInput.includes("diet") || lowerInput.includes("food")) {
      return "Great question about nutrition! Proper nutrition is key to achieving your fitness goals. Are you looking for meal planning advice, macronutrient guidance, or specific dietary recommendations? I can help you create a balanced eating plan that supports your training."
    }

    if (lowerInput.includes("form") || lowerInput.includes("technique")) {
      return "Form is crucial for effective and safe workouts! I can provide detailed guidance on proper exercise technique. Which exercise would you like me to help you with? Remember, our TrikaVision feature can also provide real-time form corrections during your workouts."
    }

    if (lowerInput.includes("progress") || lowerInput.includes("track")) {
      return "Tracking progress is essential for staying motivated! I can help you analyze your workout data, set realistic goals, and identify areas for improvement. Would you like me to review your recent activities or help you set new targets?"
    }

    if (lowerInput.includes("motivation") || lowerInput.includes("tired") || lowerInput.includes("lazy")) {
      return "I understand that staying motivated can be challenging! Remember why you started your fitness journey. Every small step counts, and consistency beats perfection. Would you like me to suggest a quick, energizing workout or share some motivational tips?"
    }

    return "That's an interesting question! I'm here to help with all aspects of your fitness journey. Could you provide more details about what you'd like to know? I can assist with workouts, nutrition, recovery, goal setting, and much more."
  }

  const generateSuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("workout")) {
      return ["Show me beginner exercises", "Create a 30-min routine", "Upper body focus", "Cardio options"]
    }

    if (lowerInput.includes("nutrition")) {
      return ["Meal prep ideas", "Protein requirements", "Pre-workout snacks", "Hydration tips"]
    }

    return ["Tell me more", "Show examples", "Create a plan", "Track this goal"]
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input functionality would be implemented here
  }

  const fetchConversationHistory = async () => {
    try {
      const response = await fetch(`/api/chatbot?userEmail=${email}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error("Error fetching conversation history:", error)
    }
  }

  const startNewConversation = () => {
    setMessages(initialMessages)
    setSessionId("")
    setShowConversationHistory(false)
  }

  const loadConversation = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chatbot/${sessionId}?userEmail=${email}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.conversation.messages)
        setSessionId(sessionId)
        setShowConversationHistory(false)
      }
    } catch (error) {
      console.error("Error loading conversation:", error)
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Fitness Assistant</h1>
            <p className="text-sm text-slate-400">Your personal trainer and nutrition coach</p>
          </div>
        </div>
        <div className="flex items-center gap-10">

        <ServerStatusBadge />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400"
            onClick={() => {
              setShowConversationHistory(!showConversationHistory)
              if (!showConversationHistory) {
                fetchConversationHistory()
              }
            }}
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
              variant="outline"
              size="sm"
              onClick={startNewConversation}
              className="text-xs border-slate-700 hover:bg-slate-800"
            >
              <Plus className="w-3 h-3 mr-1" />
              New Chat
            </Button>
        </div>
      </div>

      {/* Conversation History Panel */}
      {showConversationHistory && (
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Conversation History</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={startNewConversation}
              className="text-xs border-slate-700 hover:bg-slate-800"
            >
              <Plus className="w-3 h-3 mr-1" />
              New Chat
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-500">No previous conversations</p>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.sessionId}
                  className="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer"
                  onClick={() => loadConversation(conversation.sessionId)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate">{conversation.title}</p>
                    <p className="text-xs text-slate-500">
                      {conversation.totalMessages} messages • {new Date(conversation.lastActivity).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.label)}
              className="text-xs border-slate-700 hover:bg-slate-800"
            >
              <span className="mr-1">{action.icon}</span>
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "bot" && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                <Card className={`${message.type === "user" ? "bg-blue-600 border-blue-500" : "dark-card"}`}>
                  <CardContent className="p-3">
                    <p className={`text-sm ${message.type === "user" ? "text-white" : "text-slate-200"}`}>
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${message.type === "user" ? "text-blue-100" : "text-slate-500"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>

                {message.suggestions && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs text-slate-400 hover:text-white hover:bg-slate-800 h-6 px-2"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="dark-card">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about fitness, nutrition, or wellness..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="dark-input pr-12"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoiceInput}
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 ${
                isListening ? "text-red-400" : "text-slate-400"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
