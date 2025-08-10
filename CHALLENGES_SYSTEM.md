# Challenges System Implementation

## Overview

This document describes the challenges system implementation for the Trika AI Fitness Platform, including global challenges and custom user challenges.

## Architecture

### Global Challenges (Static JSON)

- **Location**: Static JSON file `data/global-challenges.json`
- **API**: `app/api/global-challenges/route.js`
- **UI**: `components/pages/challenges-content.tsx` - Global tab

### Custom Challenges (User Database)

- **Location**: User database using `lib/mongodb.js`
- **Model**: `models/CustomChallenge.js`
- **API**: `app/api/custom-challenges/route.js`
- **UI**: `components/pages/challenges-content.tsx` - Custom tab

## Database Models

### Global Challenges Data Structure

```javascript
{
  challenges: [
    {
      _id: String,
      title: String,
      description: String,
      difficulty: String, // "Beginner", "Intermediate", "Advanced"
      durationDays: Number,
      workoutType: String, // "Push-Up", "Squat", "Plank", etc.
      badge: String, // Emoji badge
      color: String, // Tailwind gradient classes
      createdAt: String, // ISO date string
    },
  ];
}
```

### CustomChallenge Model

```javascript
{
  userEmail: String,
  title: String,
  description: String,
  difficulty: String,
  durationDays: Number,
  category: String, // "Strength", "Cardio", "Flexibility", "Mixed"
  badge: String,
  color: String,
  progress: Number, // percentage
  completedDays: Number,
  isCompleted: Boolean,
  startDate: Date,
  workoutSessions: [{
    day: Number,
    workoutType: String,
    sets: Number,
    reps: Number,
    duration: Number, // minutes
    restTime: Number, // seconds
    notes: String
  }],
  logs: [{
    date: Date,
    completed: Boolean,
    notes: String,
    actualSets: Number,
    actualReps: Number,
    actualDuration: Number
  }]
}
```

## API Endpoints

### Global Challenges

- **GET** `/api/global-challenges` - Fetch all global challenges
- **GET** `/api/global-challenges?difficulty=Beginner` - Filter by difficulty
- **GET** `/api/global-challenges?workoutType=Push-Up` - Filter by workout type
- **POST** `/api/global-challenges` - Read-only (returns 405 Method Not Allowed)

### Custom Challenges

- **GET** `/api/custom-challenges?userEmail={email}` - Fetch user's custom challenges
- **POST** `/api/custom-challenges` - Create new custom challenge

## Features

### Global Challenges

- ✅ Admin-created challenges for all users
- ✅ Different difficulty levels
- ✅ Various workout types
- ✅ Duration tracking
- ✅ Visual badges and colors
- ✅ TrikaVision integration

### Custom Challenges

- ✅ User-specific challenges
- ✅ Detailed workout sessions with sets/reps
- ✅ Progress tracking
- ✅ Completion logs
- ✅ Multiple categories
- ✅ Flexible duration and rest times

### UI Features

- ✅ Loading states
- ✅ Empty state handling
- ✅ Progress visualization
- ✅ Difficulty badges
- ✅ Workout type integration
- ✅ Create challenge buttons

## Setup Instructions

### 1. Static Data

The global challenges are stored in `data/global-challenges.json`. You can modify this file to add, remove, or update challenges.

### 2. Demo Global Challenges

The static JSON file already includes 8 demo challenges:

1. **30-Day Push-Up Challenge** - Intermediate, 30 days
2. **Squat Master Challenge** - Beginner, 21 days
3. **Plank Endurance Challenge** - Advanced, 14 days
4. **Burpee Blast Challenge** - Advanced, 7 days
5. **Pull-Up Progression** - Intermediate, 28 days
6. **Mountain Climber Marathon** - Beginner, 10 days
7. **Lunge Challenge** - Beginner, 14 days
8. **Jumping Jack Challenge** - Beginner, 7 days

### 3. Adding New Challenges

To add new challenges, simply edit the `data/global-challenges.json` file:

```json
{
  "challenges": [
    {
      "_id": "9",
      "title": "Your New Challenge",
      "description": "Description of your challenge",
      "difficulty": "Beginner",
      "durationDays": 14,
      "workoutType": "Your Workout Type",
      "badge": "🏆",
      "color": "from-blue-500 to-purple-500",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Usage

### Global Challenges

1. **View Challenges**: Navigate to the "Global Challenges" tab
2. **Start Workout**: Click "Start Workout" to begin a challenge
3. **TrikaVision**: Use "Start with TrikaVision" for AI-powered form analysis
4. **View Details**: Click "View Details" for more information

### Custom Challenges

1. **Create Challenge**: Click "Create Challenge" button
2. **Set Workout Sessions**: Define daily workout routines with sets/reps
3. **Track Progress**: Monitor completion and progress percentage
4. **Continue Challenge**: Resume ongoing challenges

### Weekly Goals

1. **View Goals**: Navigate to the "Weekly Goals" tab
2. **Track Progress**: Monitor cardio, strength, and active days
3. **Visual Progress**: See progress bars and completion percentages

## Data Sources

### Global Challenges (Static JSON)

- Uses `data/global-challenges.json` for global challenges
- No database connection required
- Read-only for all users
- Easy to modify by editing the JSON file

### User Database

- Uses `lib/mongodb.js` for custom challenges
- User-specific data
- Full CRUD operations for users
- Progress tracking and logs

## File Structure

```
├── data/
│   └── global-challenges.json (Static global challenges data)
├── models/
│   └── CustomChallenge.js (Custom challenges model)
├── app/api/
│   ├── global-challenges/route.js (Global challenges API)
│   └── custom-challenges/route.js (Custom challenges API)
├── components/pages/
│   └── challenges-content.tsx (Challenges UI)
├── lib/
│   └── mongodb.js (User database connection)
└── CHALLENGES_SYSTEM.md (This documentation)
```

## Future Enhancements

1. **Challenge Templates**: Pre-built challenge templates
2. **Social Features**: Share challenges with friends
3. **Leaderboards**: Global and friend leaderboards
4. **Achievements**: Badges and rewards system
5. **Challenge Analytics**: Detailed progress analytics
6. **Workout Integration**: Direct integration with workout system
7. **Reminders**: Challenge completion reminders
8. **Export Data**: Export challenge data and progress

## Security Considerations

1. **User Authentication**: Ensure only authenticated users can access custom challenges
2. **Data Privacy**: User challenges are private to each user
3. **Input Validation**: Validate all challenge creation inputs
4. **Rate Limiting**: Implement rate limiting for challenge creation
5. **Admin Access**: Restrict global challenge creation to admins only

## Monitoring and Analytics

1. **Challenge Participation**: Track global challenge participation
2. **Completion Rates**: Monitor challenge completion rates
3. **User Engagement**: Track user interaction with challenges
4. **Performance Metrics**: Monitor API response times
5. **Error Tracking**: Log and monitor challenge-related errors
