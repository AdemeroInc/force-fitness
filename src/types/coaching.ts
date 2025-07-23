export interface CoachPersona {
  id: string;
  name: string;
  specialty: string;
  description: string;
  personality: string;
  avatar: string;
  background: string;
  expertise: string[];
  communicationStyle: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoals: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  medicalConditions: string[];
  isOnHormoneReplacement: boolean;
  hormoneDetails?: string;
  currentDiet: string;
  activityLevel: string;
  availableEquipment: string[];
  workoutPreferences: string[];
  timeAvailability: {
    weekdays: number; // minutes per day
    weekends: number; // minutes per day
  };
  selectedCoach: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  coachId: string;
  content: string;
  role: 'user' | 'coach';
  timestamp: Date;
  messageType: 'text' | 'workout_plan' | 'meal_plan' | 'progress_update';
  metadata?: {
    workoutId?: string;
    mealPlanId?: string;
    progressData?: Record<string, unknown>;
  };
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  coachId: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  targetMuscleGroups: string[];
  exercises: Exercise[];
  restPeriods: number[];
  notes: string;
  createdAt: Date;
  scheduledFor?: Date;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number | string; // can be "AMRAP" or "30 seconds"
  weight?: number;
  restTime: number; // seconds
  instructions: string[];
  targetMuscles: string[];
  equipment: string[];
  videoUrl?: string;
  modifications?: {
    easier: string;
    harder: string;
  };
}

export interface MealPlan {
  id: string;
  userId: string;
  coachId: string;
  title: string;
  description: string;
  targetCalories: number;
  macroBreakdown: {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
  };
  meals: Meal[];
  shoppingList: string[];
  prepTime: number; // minutes
  createdAt: Date;
  scheduledFor: Date;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  servings: number;
  tags: string[];
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface WeeklyProgram {
  id: string;
  userId: string;
  coachId: string;
  weekOf: Date;
  workoutPlans: WorkoutPlan[];
  mealPlans: MealPlan[];
  goals: string[];
  progressMetrics: string[];
  coachNotes: string;
  createdAt: Date;
}