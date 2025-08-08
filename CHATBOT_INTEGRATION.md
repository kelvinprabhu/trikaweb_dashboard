# Chatbot Integration with Django API

## Overview

This document describes the chatbot integration that connects the Next.js frontend with a Django backend API for AI-powered fitness assistance.

## Architecture

### Frontend (Next.js)

- **Location**: `components/pages/chatbot-content.tsx`
- **API Routes**:
  - `app/api/chatbot/route.js` - Main chatbot API
  - `app/api/chatbot/[sessionId]/route.js` - Conversation management

### Backend (Django)

- **API Endpoint**: `http://127.0.0.1:8000/trikabot/chat`
- **Request Format**: JSON with userEmail and Query
- **Response Format**: JSON with message field

## Database Model

### Conversation Model (`models/Conversation.js`)

```javascript
{
  userEmail: String,           // User's email address
  sessionId: String,           // Unique session identifier
  title: String,              // Conversation title
  messages: [MessageSchema],   // Array of messages
  status: String,             // active, archived, deleted
  totalMessages: Number,       // Message count
  lastActivity: Date,         // Last activity timestamp
  tags: [String],             // Conversation tags
  summary: String,            // Conversation summary
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

### Message Schema

```javascript
{
  role: String,               // "user" or "assistant"
  content: String,            // Message content
  timestamp: Date,            // Message timestamp
  metadata: Map               // Additional metadata
}
```

## API Endpoints

### 1. Send Message

- **POST** `/api/chatbot`
- **Request**:
  ```json
  {
    "userEmail": "user@example.com",
    "query": "Hello, bot!",
    "sessionId": "optional-session-id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "sessionId": "generated-session-id",
    "response": "Hey user@example.com, bot will be integrated soon.",
    "conversationId": "conversation-object-id"
  }
  ```

### 2. Get Conversation History

- **GET** `/api/chatbot?userEmail=user@example.com`
- **Response**:
  ```json
  {
    "conversations": [
      {
        "sessionId": "session-id",
        "title": "Conversation Title",
        "totalMessages": 10,
        "lastActivity": "2024-01-01T00:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
  ```

### 3. Load Specific Conversation

- **GET** `/api/chatbot/[sessionId]?userEmail=user@example.com`
- **Response**:
  ```json
  {
    "conversation": {
      "sessionId": "session-id",
      "title": "Conversation Title",
      "messages": [
        {
          "id": 1,
          "type": "user",
          "content": "Hello",
          "timestamp": "2024-01-01T00:00:00Z"
        }
      ],
      "totalMessages": 10,
      "lastActivity": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
  ```

### 4. Delete Conversation

- **DELETE** `/api/chatbot/[sessionId]?userEmail=user@example.com`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Conversation deleted successfully"
  }
  ```

## Django API Integration

### Request Format

```json
{
  "userEmail": "kelvin@example.com",
  "Query": "Hello, bot!"
}
```

### Response Format

```json
{
  "message": "Hey kelvin@example.com, bot will be integrated soon."
}
```

## Features

### 1. Real-time Chat

- Send messages to Django API
- Receive responses and display them
- Handle errors gracefully

### 2. Conversation Management

- Create new conversations
- Load previous conversations
- View conversation history
- Delete conversations

### 3. Session Management

- Automatic session ID generation
- Persistent conversations across sessions
- User-specific conversation storage

### 4. UI Features

- Message history with timestamps
- Loading states
- Error handling
- Quick action buttons
- Voice input toggle (placeholder)

## Setup Instructions

### 1. Environment Variables

Make sure your Django API is running on `http://127.0.0.1:8000`

### 2. Database Setup

The Conversation model will be automatically created when the API is first called.

### 3. Dependencies

```bash
npm install uuid --legacy-peer-deps
```

## Usage

### Starting a New Conversation

1. Click the "New Chat" button in the conversation history panel
2. Or simply start typing a message

### Loading Previous Conversations

1. Click the history icon in the header
2. Select a conversation from the list
3. Messages will be loaded automatically

### Sending Messages

1. Type your message in the input field
2. Press Enter or click the send button
3. The message will be sent to Django API
4. Response will be displayed in the chat

## Error Handling

### Django API Unavailable

- Shows error message to user
- Logs error to console
- Continues to function with fallback responses

### Database Errors

- Graceful error handling
- User-friendly error messages
- Automatic retry mechanisms

## Future Enhancements

1. **Message Persistence**: Save messages to database
2. **Conversation Search**: Search through conversation history
3. **Message Reactions**: Add reactions to messages
4. **File Attachments**: Support for images and documents
5. **Voice Messages**: Record and send voice messages
6. **Typing Indicators**: Show when bot is typing
7. **Message Threading**: Reply to specific messages
8. **Conversation Export**: Export conversations as PDF/JSON

## Security Considerations

1. **User Authentication**: Ensure only authenticated users can access conversations
2. **Data Privacy**: Encrypt sensitive conversation data
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Input Validation**: Validate all user inputs
5. **SQL Injection**: Use parameterized queries

## Monitoring and Analytics

1. **Conversation Metrics**: Track conversation length, response times
2. **User Engagement**: Monitor user interaction patterns
3. **Error Tracking**: Log and monitor API errors
4. **Performance Metrics**: Track API response times
