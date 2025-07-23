# Data Models & Database Schema

## Overview

Force Fitness uses a comprehensive data model designed to support personalized AI coaching, user health tracking, and premium fitness experiences. This document outlines all database schemas, TypeScript interfaces, and data relationships.

## 🗄️ Database Collections Overview

```
Firebase Firestore Collections:
├── users/              # User profiles and account information
├── conversations/      # AI coaching conversations and chat history
├── workoutPlans/      # Generated and custom workout plans
├── mealPlans/         # Nutrition plans and meal recommendations
├── exercises/         # Exercise database with instructions and media
├── progress/          # User progress tracking and analytics
├── achievements/      # Badges, milestones, and accomplishments
├── feedback/          # User feedback and coach ratings
├── subscriptions/     # Payment and subscription management
└── coachPersonas/     # AI coach configuration and personalities
```

## 👤 User Profile Schema

### Primary User Document
```typescript
interface UserProfile {
  // Identity & Authentication
  uid: string;                    // Firebase Auth UID
  email: string;                  // Verified email address
  displayName: string;            // User's chosen display name
  photoURL?: string;              // Profile image URL from Storage
  phoneNumber?: string;           // Optional phone for notifications
  
  // Account Metadata
  createdAt: Timestamp;           // Account creation date
  updatedAt: Timestamp;           // Last profile update
  lastLoginAt: Timestamp;         // Last authentication timestamp
  emailVerified: boolean;         // Email verification status
  
  // Health & Fitness Profile
  healthProfile: HealthProfile;
  
  // User Preferences & Settings
  preferences: UserPreferences;
  
  // Subscription & Billing
  subscription: SubscriptionInfo;
  
  // Usage Statistics
  stats: UserStats;
  
  // Privacy & Security
  privacy: PrivacySettings;
}
```

### Health Profile Schema
```typescript
interface HealthProfile {
  // Basic Measurements
  age: number;                    // Age in years
  height: number;                 // Height in centimeters
  weight: number;                 // Current weight in kilograms
  targetWeight?: number;          // Goal weight if applicable
  bodyFatPercentage?: number;     // Body fat % if known
  
  // Fitness Level & Experience
  fitnessLevel: FitnessLevel;     // beginner | intermediate | advanced | elite
  yearsTraining?: number;         // Years of fitness experience
  sportsBackground: string[];     // Previous sports/activities
  currentActivities: string[];    // Current regular activities
  
  // Health Conditions & Medications
  medicalConditions: string[];    // Existing health conditions
  injuries: InjuryHistory[];      // Past and current injuries
  medications: string[];          // Current medications
  hormoneTreatment: boolean;      // Hormone replacement therapy
  
  // Dietary Information
  allergies: string[];            // Food allergies
  dietaryRestrictions: string[];  // Dietary preferences/restrictions
  nutritionGoals: string[];       // Specific nutrition objectives
  
  // Lifestyle Factors
  sleepHours: number;             // Average sleep per night
  stressLevel: number;            // Self-reported stress (1-10)
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'none' | 'light' | 'moderate' | 'heavy';
  
  // Professional Context (for target audience)
  profession: string;             // Industry/role
  workSchedule: 'regular' | 'irregular' | 'touring' | 'project-based';
  travelFrequency: 'none' | 'occasional' | 'frequent' | 'constant';
  physicalDemands: string[];      // Physical requirements of their work
}

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

interface InjuryHistory {
  bodyPart: string;               // Affected area
  description: string;            // Injury description
  dateOccurred: Timestamp;        // When injury occurred
  recoveryStatus: 'recovered' | 'healing' | 'chronic' | 'reinjured';
  restrictions: string[];         // Current limitations
  treatmentHistory: string[];     // Past treatments
}
```

### User Preferences Schema
```typescript
interface UserPreferences {
  // AI Coach Selection
  selectedCoach: CoachType;       // Primary coach preference
  coachHistory: CoachType[];      // Previously used coaches
  communicationStyle: 'direct' | 'supportive' | 'analytical' | 'motivational';
  
  // Workout Preferences
  workoutDays: DayOfWeek[];       // Preferred training days
  preferredWorkoutTime: string;   // Preferred time (HH:MM format)
  workoutDuration: number;        // Preferred session length (minutes)
  workoutIntensity: 'low' | 'moderate' | 'high' | 'varied';
  
  // Equipment & Location
  availableEquipment: string[];   // Equipment accessible to user
  homeGymSetup: boolean;          // Has dedicated home gym space
  gymMembership: boolean;         // Has commercial gym access
  outdoorPreference: boolean;     // Enjoys outdoor activities
  
  // Goals & Motivation
  primaryGoals: FitnessGoal[];    // Main fitness objectives
  secondaryGoals: FitnessGoal[];  // Additional objectives
  motivationFactors: string[];    // What drives them
  accountabilityLevel: 'low' | 'medium' | 'high';
  
  // Notifications & Communication
  notificationsEnabled: boolean;
  workoutReminders: boolean;
  progressUpdates: boolean;
  coachMessages: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  
  // Privacy & Sharing
  profileVisibility: 'private' | 'friends' | 'public';
  shareProgress: boolean;
  shareWorkouts: boolean;
  allowCoachSharing: boolean;     // Share data with coach for testimonials
  
  // App Experience
  units: 'metric' | 'imperial';   // Measurement units
  language: string;               // Preferred language
  theme: 'dark' | 'light' | 'auto';
  accessibility: AccessibilitySettings;
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type FitnessGoal = 
  | 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility'
  | 'performance' | 'health' | 'aesthetic' | 'functional' | 'sport_specific';

interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}
```

### Subscription Schema
```typescript
interface SubscriptionInfo {
  // Plan Details
  plan: SubscriptionPlan;         // Current subscription tier
  status: SubscriptionStatus;     // Current status
  
  // Dates
  startDate: Timestamp;           // Subscription start
  endDate: Timestamp;             // Current period end
  trialEndDate?: Timestamp;       // Free trial end (if applicable)
  canceledAt?: Timestamp;         // Cancellation date
  
  // Billing Integration
  stripeCustomerId?: string;      // Stripe customer ID
  stripeSubscriptionId?: string;  // Stripe subscription ID
  paymentMethodId?: string;       // Default payment method
  
  // Plan Features
  features: SubscriptionFeatures;
  
  // Usage Tracking
  usage: UsageTracking;
}

type SubscriptionPlan = 'free' | 'premium' | 'elite' | 'enterprise';

type SubscriptionStatus = 
  | 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';

interface SubscriptionFeatures {
  aiCoaching: boolean;            // Access to AI coaches
  unlimitedWorkouts: boolean;     // No workout plan limits
  nutritionPlanning: boolean;     // Meal planning features
  progressAnalytics: boolean;     // Advanced analytics
  prioritySupport: boolean;       // Enhanced customer support
  customBranding: boolean;        // White-label features (enterprise)
  apiAccess: boolean;             // API access for integrations
}

interface UsageTracking {
  coachingMessages: number;       // Messages sent this period
  workoutPlansGenerated: number;  // Plans created this period
  mealPlansGenerated: number;     // Meal plans created this period
  storageUsed: number;            // Storage usage in MB
  lastResetDate: Timestamp;       // When usage counters were reset
}
```

### User Statistics Schema
```typescript
interface UserStats {
  // Engagement Metrics
  totalLogins: number;            // Total app logins
  currentStreak: number;          // Current consecutive active days
  longestStreak: number;          // Best streak achieved
  totalActiveMinutes: number;     // Total time spent in app
  
  // Workout Statistics
  totalWorkouts: number;          // Completed workouts
  totalWorkoutMinutes: number;    // Total workout time
  favoriteWorkoutTypes: string[]; // Most frequent workout types
  averageWorkoutDuration: number; // Average session length
  
  // AI Coaching Statistics
  totalCoachingMessages: number;  // Messages exchanged with coaches
  favoriteCoach: CoachType;       // Most used coach
  coachSatisfactionRating: number; // Average rating given to coaches
  
  // Progress Metrics
  weightChange: number;           // Total weight change since start
  strengthGains: ProgressMetric[];// Strength improvements
  enduranceGains: ProgressMetric[];// Cardio improvements
  flexibilityGains: ProgressMetric[];// Mobility improvements
  
  // Social & Community
  friendsCount: number;           // Connected friends
  workoutsShared: number;         // Workouts shared publicly
  achievementsUnlocked: number;   // Total badges/achievements
  
  // Timestamps
  firstWorkoutDate?: Timestamp;   // First completed workout
  lastWorkoutDate?: Timestamp;    // Most recent workout
  lastCoachingDate?: Timestamp;   // Last AI coach interaction
}

interface ProgressMetric {
  exercise: string;               // Exercise name
  initialValue: number;           // Starting performance
  currentValue: number;           // Current performance
  unit: string;                   // Measurement unit
  dateFirstRecorded: Timestamp;   // First measurement
  dateLastUpdated: Timestamp;     // Most recent measurement
  improvementPercentage: number;  // Calculated improvement
}
```

## 💬 Conversation Schema

### Conversation Document
```typescript
interface Conversation {
  // Identification
  id: string;                     // Unique conversation ID
  userId: string;                 // Owner of the conversation
  coachId: CoachType;             // AI coach involved
  
  // Conversation Details
  title: string;                  // Conversation title/topic
  messages: ChatMessage[];        // All messages in conversation
  
  // Timestamps
  createdAt: Timestamp;           // Conversation started
  updatedAt: Timestamp;           // Last message added
  
  // Metadata
  metadata: ConversationMetadata;
  
  // State Management
  status: ConversationStatus;
  isArchived: boolean;
  isPinned: boolean;
  isLocked: boolean;              // Premium feature lock
  
  // Context & AI State
  context: ConversationContext;
}

interface ChatMessage {
  // Message Identity
  id: string;                     // Unique message ID
  role: MessageRole;              // Who sent the message
  
  // Content
  content: string;                // Message text content
  type: MessageType;              // Type of message
  
  // Timing
  timestamp: Timestamp;           // When message was sent
  
  // Rich Content
  attachments?: MessageAttachment[];
  metadata?: MessageMetadata;
  
  // Message State
  isEdited: boolean;
  editedAt?: Timestamp;
  isDeleted: boolean;
  deletedAt?: Timestamp;
  
  // AI Context
  aiContext?: AIMessageContext;
}

type MessageRole = 'user' | 'coach' | 'system';

type MessageType = 
  | 'text' | 'workout_plan' | 'meal_plan' | 'progress_update' 
  | 'achievement' | 'system_notification' | 'media';

interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'workout' | 'meal_plan';
  url: string;                    // Storage URL
  filename: string;
  size: number;                   // File size in bytes
  mimeType: string;
  thumbnail?: string;             // Thumbnail URL for media
}

interface ConversationMetadata {
  totalMessages: number;
  userMessages: number;
  coachMessages: number;
  lastActivity: Timestamp;
  
  // Topic Analysis
  topics: string[];               // Main topics discussed
  keywords: string[];             // Key terms mentioned
  
  // Sentiment & Quality
  overallSentiment: 'positive' | 'neutral' | 'negative';
  userSatisfaction?: number;      // 1-5 rating if provided
  
  // Coaching Effectiveness
  goalsDiscussed: string[];
  recommendationsMade: number;
  followUpItems: string[];
}

type ConversationStatus = 'active' | 'completed' | 'archived' | 'on_hold';

interface ConversationContext {
  // User Context at Start
  userGoals: string[];
  userChallenges: string[];
  userPreferences: string[];
  
  // Ongoing Context
  currentProgram?: string;        // Active workout/meal plan
  recentProgress?: string[];      // Recent achievements/updates
  upcomingEvents?: string[];      // Relevant schedule items
  
  // AI Context
  coachingStrategy: string;       // Current coaching approach
  personalityAdjustments: string[];// Coach behavior modifications
  nextSteps: string[];            // Planned follow-up actions
}
```

## 🏋️ Workout Plan Schema

### Workout Plan Document
```typescript
interface WorkoutPlan {
  // Identification
  id: string;                     // Unique plan ID
  userId: string;                 // Plan owner
  coachId: CoachType;             // Creating coach
  
  // Plan Details
  title: string;                  // Plan name
  description: string;            // Plan overview
  category: WorkoutCategory;      // Plan type
  
  // Structure
  exercises: Exercise[];          // Exercises in the plan
  estimatedDuration: number;      // Expected duration (minutes)
  difficulty: DifficultyLevel;    // Plan difficulty
  
  // Scheduling
  scheduledDate?: Timestamp;      // When plan is scheduled
  completedAt?: Timestamp;        // When plan was completed
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Customization
  isTemplate: boolean;            // Can be reused
  isCustom: boolean;              // User-modified plan
  originalPlanId?: string;        // If modified from template
  
  // Progress Tracking
  completion: WorkoutCompletion;
  
  // AI Context
  generationContext: AIGenerationContext;
}

type WorkoutCategory = 
  | 'strength' | 'cardio' | 'flexibility' | 'sports_specific' 
  | 'recovery' | 'mobility' | 'hiit' | 'endurance' | 'hybrid';

type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'expert';

interface Exercise {
  // Exercise Identity
  id: string;                     // Exercise ID
  name: string;                   // Exercise name
  category: string;               // Exercise category
  
  // Instructions
  instructions: string[];         // Step-by-step instructions
  tips: string[];                 // Form tips and cues
  
  // Media
  demonstrationVideo?: string;    // Video URL
  images: string[];               // Instruction images
  
  // Equipment
  equipment: string[];            // Required equipment
  alternativeEquipment?: string[];// Equipment alternatives
  
  // Targeting
  primaryMuscles: string[];       // Primary muscle groups
  secondaryMuscles: string[];     // Secondary muscle groups
  movementPattern: string;        // Movement classification
  
  // Programming
  sets: ExerciseSet[];            // Set and rep scheme
  restPeriod: number;             // Rest between sets (seconds)
  
  // Modifications
  progressions: string[];         // Harder variations
  regressions: string[];          // Easier variations
  modifications: string[];        // Injury modifications
  
  // Performance Data
  lastPerformed?: Timestamp;
  personalBest?: PersonalBest;
  notes?: string;                 // User notes
}

interface ExerciseSet {
  setNumber: number;
  reps?: number;                  // Target repetitions
  weight?: number;                // Weight in kg
  duration?: number;              // Duration in seconds
  distance?: number;              // Distance in meters
  restAfter: number;              // Rest after this set
  
  // Completed Values
  actualReps?: number;
  actualWeight?: number;
  actualDuration?: number;
  actualDistance?: number;
  rpe?: number;                   // Rate of Perceived Exertion (1-10)
  
  // Status
  completed: boolean;
}

interface WorkoutCompletion {
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  totalDuration?: number;         // Actual workout duration
  
  // Performance Summary
  totalVolume?: number;           // Total weight moved
  averageIntensity?: number;      // Average RPE
  caloriesBurned?: number;        // Estimated calories
  heartRateData?: HeartRateData;
  
  // User Feedback
  rating?: number;                // Workout rating (1-5)
  feedback?: string;              // User comments
  perceivedDifficulty?: number;   // How hard it felt (1-10)
  energyBefore?: number;          // Energy level before (1-10)
  energyAfter?: number;           // Energy level after (1-10)
}
```

## 🍽️ Meal Plan Schema

### Meal Plan Document
```typescript
interface MealPlan {
  // Identification
  id: string;
  userId: string;
  coachId: CoachType;
  
  // Plan Details
  title: string;
  description: string;
  planType: MealPlanType;
  
  // Duration & Structure
  startDate: Timestamp;
  endDate: Timestamp;
  meals: DailyMeals[];            // Meals for each day
  
  // Nutritional Targets
  nutritionTargets: NutritionTargets;
  
  // Customization
  dietaryRestrictions: string[];
  allergies: string[];
  preferences: string[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Progress
  adherence: MealPlanAdherence;
  
  // AI Context
  generationContext: AIGenerationContext;
}

type MealPlanType = 
  | 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance' 
  | 'recovery' | 'pre_competition' | 'travel' | 'budget';

interface DailyMeals {
  date: string;                   // YYYY-MM-DD format
  meals: Meal[];
  dailyNutrition: NutritionSummary;
  waterTarget: number;            // Liters
  supplementation?: Supplement[];
}

interface Meal {
  // Meal Identity
  id: string;
  name: string;
  type: MealType;
  
  // Timing
  scheduledTime: string;          // HH:MM format
  
  // Recipes & Ingredients
  recipes: Recipe[];
  
  // Nutrition
  nutrition: NutritionSummary;
  
  // Preparation
  prepTime: number;               // Minutes
  cookTime: number;               // Minutes
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Completion Tracking
  consumed: boolean;
  consumedAt?: Timestamp;
  rating?: number;                // 1-5 stars
  notes?: string;
}

type MealType = 
  | 'breakfast' | 'lunch' | 'dinner' | 'snack' 
  | 'pre_workout' | 'post_workout' | 'late_night';

interface Recipe {
  id: string;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  
  // Media
  image?: string;
  video?: string;
  
  // Nutritional Information
  nutritionPerServing: NutritionSummary;
  
  // Recipe Metadata
  cuisine: string;
  author: string;
  source?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalTime: number;              // Minutes
}

interface Ingredient {
  name: string;
  amount: number;
  unit: string;                   // 'grams', 'cups', 'pieces', etc.
  category: string;               // 'protein', 'vegetable', 'grain', etc.
  optional: boolean;
  substitutions?: string[];       // Alternative ingredients
}
```

## 📊 Progress Tracking Schema

### Progress Document
```typescript
interface ProgressEntry {
  // Identification
  id: string;
  userId: string;
  
  // Entry Details
  date: Timestamp;
  type: ProgressType;
  
  // Measurements
  measurements: ProgressMeasurements;
  
  // Context
  notes?: string;
  mood?: number;                  // 1-10 scale
  energyLevel?: number;           // 1-10 scale
  sleepHours?: number;
  stressLevel?: number;           // 1-10 scale
  
  // Media
  photos?: ProgressPhoto[];
  
  // Metadata
  createdAt: Timestamp;
  source: 'manual' | 'automated' | 'imported';
}

type ProgressType = 
  | 'weight' | 'body_composition' | 'measurements' | 'performance' 
  | 'photo' | 'milestone' | 'assessment';

interface ProgressMeasurements {
  // Weight & Composition
  weight?: number;                // kg
  bodyFatPercentage?: number;
  muscleMass?: number;            // kg
  waterPercentage?: number;
  
  // Body Measurements (cm)
  chest?: number;
  waist?: number;
  hips?: number;
  neck?: number;
  bicep?: number;
  thigh?: number;
  
  // Performance Metrics
  performanceMetrics?: PerformanceMetric[];
  
  // Health Metrics
  restingHeartRate?: number;      // BPM
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  vo2Max?: number;
}

interface ProgressPhoto {
  id: string;
  url: string;                    // Storage URL
  angle: PhotoAngle;
  lighting: string;
  timestamp: Timestamp;
  isPublic: boolean;
  tags: string[];
}

type PhotoAngle = 'front' | 'side' | 'back' | 'flex' | 'custom';
```

## 🏆 Achievement Schema

### Achievement Document
```typescript
interface Achievement {
  // Achievement Identity
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  
  // Visual Representation
  icon: string;                   // Icon identifier
  badge: string;                  // Badge image URL
  color: string;                  // Primary color
  
  // Requirements
  criteria: AchievementCriteria;
  
  // Rarity & Value
  rarity: AchievementRarity;
  points: number;                 // Point value
  
  // Metadata
  createdAt: Timestamp;
  isActive: boolean;
}

interface UserAchievement {
  // User & Achievement
  userId: string;
  achievementId: string;
  
  // Completion Details
  unlockedAt: Timestamp;
  progress: AchievementProgress;
  
  // Context
  triggerWorkout?: string;        // Workout that triggered it
  triggerMetric?: string;         // Metric that triggered it
  coachId?: CoachType;            // Coach who congratulated
  
  // Sharing
  isShared: boolean;
  sharedAt?: Timestamp;
}

type AchievementCategory = 
  | 'consistency' | 'strength' | 'endurance' | 'flexibility' 
  | 'weight_loss' | 'muscle_gain' | 'social' | 'coaching' | 'milestones';

type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface AchievementCriteria {
  type: 'count' | 'streak' | 'total' | 'percentage' | 'comparison';
  metric: string;                 // What to measure
  target: number;                 // Target value
  timeframe?: number;             // Days to complete (if applicable)
  conditions?: string[];          // Additional conditions
}

interface AchievementProgress {
  current: number;                // Current progress
  target: number;                 // Target value
  percentage: number;             // Completion percentage
  isCompleted: boolean;
}
```

## 🔄 Data Relationships

### User-Centric Relationships
```typescript
// User has many relationships
interface UserRelationships {
  conversations: Conversation[];      // All coaching conversations
  workoutPlans: WorkoutPlan[];       // Generated and custom plans
  mealPlans: MealPlan[];             // Nutrition plans
  progressEntries: ProgressEntry[];  // Progress tracking
  achievements: UserAchievement[];   // Unlocked achievements
  
  // Computed relationships
  activeConversation?: Conversation;  // Current active chat
  currentWorkoutPlan?: WorkoutPlan;  // Today's workout
  currentMealPlan?: MealPlan;        // Active meal plan
  recentProgress?: ProgressEntry[];   // Last 30 days
}
```

### AI Coach Relationships
```typescript
interface CoachRelationships {
  users: string[];                   // Users coached by this persona
  conversations: Conversation[];     // All conversations
  workoutPlans: WorkoutPlan[];      // Plans generated
  mealPlans: MealPlan[];            // Meal plans created
  
  // Performance metrics
  averageRating: number;             // User satisfaction
  totalInteractions: number;         // Total messages/plans
  retentionRate: number;             // User retention %
}
```

## 📱 Client-Side Data Management

### State Management Types
```typescript
// Redux/Zustand store types
interface AppState {
  // Authentication
  auth: AuthState;
  
  // User Data
  user: UserState;
  
  // Coaching
  coaching: CoachingState;
  
  // Workouts
  workouts: WorkoutState;
  
  // Nutrition
  nutrition: NutritionState;
  
  // Progress
  progress: ProgressState;
  
  // UI State
  ui: UIState;
}

interface AuthState {
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Cached data
  stats: UserStats | null;
  achievements: UserAchievement[];
  preferences: UserPreferences | null;
}

interface CoachingState {
  selectedCoach: CoachType;
  activeConversation: Conversation | null;
  conversations: Conversation[];
  isTyping: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}
```

## 🔧 Data Validation & Types

### Validation Schemas (Zod)
```typescript
import { z } from 'zod';

// User profile validation
export const UserProfileSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  photoURL: z.string().url().optional(),
  
  healthProfile: z.object({
    age: z.number().min(13).max(120),
    height: z.number().min(100).max(250),
    weight: z.number().min(30).max(300),
    fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced', 'elite']),
    medicalConditions: z.array(z.string()).max(20),
    hormoneTreatment: z.boolean(),
    allergies: z.array(z.string()).max(50),
    dietaryRestrictions: z.array(z.string()).max(20)
  }),
  
  preferences: z.object({
    selectedCoach: z.enum(['marcus', 'serena', 'alex', 'riley']),
    workoutDays: z.array(z.enum([
      'monday', 'tuesday', 'wednesday', 'thursday', 
      'friday', 'saturday', 'sunday'
    ])).max(7),
    preferredWorkoutTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    workoutDuration: z.number().min(15).max(180),
    availableEquipment: z.array(z.string()).max(50),
    primaryGoals: z.array(z.string()).min(1).max(5)
  })
});

// Workout plan validation
export const WorkoutPlanSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum([
    'strength', 'cardio', 'flexibility', 'sports_specific',
    'recovery', 'mobility', 'hiit', 'endurance', 'hybrid'
  ]),
  estimatedDuration: z.number().min(10).max(300),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'expert']),
  exercises: z.array(z.object({
    name: z.string().min(1),
    sets: z.array(z.object({
      reps: z.number().min(1).max(100).optional(),
      weight: z.number().min(0).max(1000).optional(),
      duration: z.number().min(1).max(3600).optional(),
      restAfter: z.number().min(0).max(600)
    })).min(1).max(10)
  })).min(1).max(50)
});
```

---

This comprehensive data model provides the foundation for all Force Fitness features while maintaining data integrity, performance, and scalability. The schemas support the premium user experience while enabling powerful AI coaching and progress tracking capabilities.