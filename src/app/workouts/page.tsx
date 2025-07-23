'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Dumbbell, 
  Clock, 
  Zap,
  Play,
  CheckCircle,
  Target,
  Repeat,
  Timer,
  Plus,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { Button, Card } from '@/components/ui';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  rest: number;
  completed: boolean;
  notes?: string;
}

interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  description: string;
  scheduled?: Date;
}

export default function WorkoutsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const todaysWorkout: Workout = {
    id: '1',
    name: 'Upper Body Strength Day',
    type: 'strength',
    duration: 45,
    difficulty: 'intermediate',
    description: 'Build upper body strength with compound movements and targeted isolation exercises.',
    scheduled: new Date(),
    exercises: [
      {
        id: '1',
        name: 'Bench Press',
        sets: 4,
        reps: 8,
        weight: 135,
        rest: 90,
        completed: false,
        notes: 'Focus on controlled movement'
      },
      {
        id: '2',
        name: 'Pull-ups',
        sets: 3,
        reps: 10,
        rest: 60,
        completed: false,
        notes: 'Use assistance if needed'
      },
      {
        id: '3',
        name: 'Overhead Press',
        sets: 3,
        reps: 10,
        weight: 65,
        rest: 60,
        completed: false
      },
      {
        id: '4',
        name: 'Dumbbell Rows',
        sets: 3,
        reps: 12,
        weight: 50,
        rest: 60,
        completed: false
      }
    ]
  };

  const upcomingWorkouts: Workout[] = [
    {
      id: '2',
      name: 'HIIT Cardio Blast',
      type: 'hiit',
      duration: 30,
      difficulty: 'advanced',
      description: 'High-intensity interval training to boost metabolism and burn calories.',
      scheduled: new Date(Date.now() + 86400000),
      exercises: []
    },
    {
      id: '3',
      name: 'Lower Body Power',
      type: 'strength',
      duration: 50,
      difficulty: 'intermediate',
      description: 'Focus on legs and glutes with heavy compound movements.',
      scheduled: new Date(Date.now() + 172800000),
      exercises: []
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workouts...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const typeColors = {
    strength: 'bg-purple-100 text-purple-800',
    cardio: 'bg-blue-100 text-blue-800',
    flexibility: 'bg-green-100 text-green-800',
    hiit: 'bg-red-100 text-red-800'
  };

  const typeIcons = {
    strength: Dumbbell,
    cardio: Zap,
    flexibility: Target,
    hiit: Timer
  };

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setWorkoutStarted(true);
  };

  if (selectedWorkout && workoutStarted) {
    const completedExercises = selectedWorkout.exercises.filter(ex => ex.completed).length;
    const progress = (completedExercises / selectedWorkout.exercises.length) * 100;

    const toggleExerciseComplete = (exerciseId: string) => {
      setSelectedWorkout(prev => prev ? {
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
        )
      } : null);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button 
              onClick={() => {
                setSelectedWorkout(null);
                setWorkoutStarted(false);
              }}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Workouts
            </button>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedWorkout.name}</h1>
                <p className="text-gray-600">{selectedWorkout.description}</p>
              </div>
              
              <Button 
                onClick={() => setWorkoutStarted(false)}
                variant="outline"
              >
                End Workout
              </Button>
            </div>
          </motion.div>

          {/* Progress */}
          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedExercises} / {selectedWorkout.exercises.length} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </Card>

          {/* Exercise List */}
          <div className="space-y-4">
            {selectedWorkout.exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-all ${
                  exercise.completed ? 'bg-green-50 border-green-200' : ''
                }`}>
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleExerciseComplete(exercise.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                        exercise.completed 
                          ? 'bg-green-600 border-green-600' 
                          : 'border-gray-300 hover:border-purple-600'
                      }`}
                    >
                      {exercise.completed && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.name}</h3>
                      
                      <div className="flex gap-6 mb-2">
                        <div className="flex items-center gap-2">
                          <Repeat className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">
                            {exercise.sets} sets × {exercise.reps} reps
                          </span>
                        </div>
                        {exercise.weight && (
                          <div className="flex items-center gap-2">
                            <Dumbbell className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{exercise.weight} lbs</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{exercise.rest}s rest</span>
                        </div>
                      </div>
                      
                      {exercise.notes && (
                        <p className="text-sm text-gray-600 italic">{exercise.notes}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Completion */}
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Workout Complete! 🎉
                </h3>
                <p className="text-gray-600 mb-4">
                  Great job! You crushed this workout.
                </p>
                <Link href="/progress">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Log Progress
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
              <p className="text-gray-600">Your personalized training program</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-5 h-5 mr-2" />
              Create Workout
            </Button>
          </div>
        </motion.div>

        {/* Today's Workout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today&apos;s Workout</h2>
          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[todaysWorkout.type]}`}>
                    {todaysWorkout.type.charAt(0).toUpperCase() + todaysWorkout.type.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[todaysWorkout.difficulty]}`}>
                    {todaysWorkout.difficulty.charAt(0).toUpperCase() + todaysWorkout.difficulty.slice(1)}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{todaysWorkout.name}</h3>
                <p className="text-gray-600 mb-4">{todaysWorkout.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{todaysWorkout.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{todaysWorkout.exercises.length} exercises</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => startWorkout(todaysWorkout)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Workout
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Workouts */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Workouts</h2>
          <div className="grid gap-4">
            {upcomingWorkouts.map((workout, index) => {
              const TypeIcon = typeIcons[workout.type];
              return (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[workout.type]}`}>
                              {workout.type}
                            </span>
                            <span className="text-sm text-gray-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {workout.duration} min
                            </span>
                            <span className="text-sm text-gray-500">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {workout.scheduled?.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}