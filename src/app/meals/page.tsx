'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Utensils, 
  Clock, 
  Flame,
  Plus,
  Calendar,
  Info
} from 'lucide-react';
import Link from 'next/link';

import { auth } from '@/lib/firebase';
import { Button, Card } from '@/components/ui';

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  ingredients: string[];
  instructions?: string[];
}

const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Protein Power Breakfast',
    type: 'breakfast',
    calories: 420,
    protein: 35,
    carbs: 30,
    fat: 18,
    time: '7:00 AM',
    ingredients: ['3 eggs', '1 cup spinach', '1/2 avocado', '2 slices whole grain toast'],
    instructions: ['Scramble eggs with spinach', 'Toast bread', 'Slice avocado and serve']
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    type: 'lunch',
    calories: 380,
    protein: 42,
    carbs: 25,
    fat: 12,
    time: '12:30 PM',
    ingredients: ['6oz grilled chicken', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
    instructions: ['Grill chicken breast', 'Mix vegetables', 'Add dressing and toss']
  },
  {
    id: '3',
    name: 'Post-Workout Shake',
    type: 'snack',
    calories: 250,
    protein: 30,
    carbs: 25,
    fat: 5,
    time: '3:30 PM',
    ingredients: ['1 scoop whey protein', '1 banana', '1 cup almond milk', 'Ice'],
    instructions: ['Blend all ingredients until smooth']
  },
  {
    id: '4',
    name: 'Salmon & Quinoa Bowl',
    type: 'dinner',
    calories: 520,
    protein: 38,
    carbs: 45,
    fat: 22,
    time: '6:30 PM',
    ingredients: ['6oz salmon', '1 cup quinoa', 'Roasted vegetables', 'Lemon'],
    instructions: ['Bake salmon at 400°F for 15 min', 'Cook quinoa', 'Roast vegetables', 'Serve with lemon']
  }
];

export default function MealsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meal plan...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const totalNutrition = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const mealTypeColors = {
    breakfast: 'bg-yellow-100 text-yellow-800',
    lunch: 'bg-green-100 text-green-800',
    dinner: 'bg-blue-100 text-blue-800',
    snack: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Today&apos;s Meal Plan</h1>
              <p className="text-gray-600">
                Personalized nutrition to fuel your fitness journey
              </p>
            </div>
            
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              Add Meal
            </Button>
          </div>
        </motion.div>

        {/* Nutrition Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Nutrition Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Flame className="w-4 h-4 mr-2" />
                  <span className="text-sm">Calories</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalNutrition.calories}</p>
                <p className="text-sm text-gray-500">/ 2,200 target</p>
              </div>
              <div>
                <div className="text-gray-600 mb-1">
                  <span className="text-sm">Protein</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalNutrition.protein}g</p>
                <p className="text-sm text-gray-500">/ 150g target</p>
              </div>
              <div>
                <div className="text-gray-600 mb-1">
                  <span className="text-sm">Carbs</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalNutrition.carbs}g</p>
                <p className="text-sm text-gray-500">/ 220g target</p>
              </div>
              <div>
                <div className="text-gray-600 mb-1">
                  <span className="text-sm">Fat</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalNutrition.fat}g</p>
                <p className="text-sm text-gray-500">/ 75g target</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Meal List */}
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${mealTypeColors[meal.type]}`}>
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                      </span>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{meal.time}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{meal.name}</h3>
                    
                    <div className="flex gap-6 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Calories</span>
                        <p className="font-semibold text-gray-900">{meal.calories}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Protein</span>
                        <p className="font-semibold text-gray-900">{meal.protein}g</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Carbs</span>
                        <p className="font-semibold text-gray-900">{meal.carbs}g</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Fat</span>
                        <p className="font-semibold text-gray-900">{meal.fat}g</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {meal.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button variant="ghost" size="sm">
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add Meal CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
            <Utensils className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Need more meal ideas?
            </h3>
            <p className="text-gray-600 mb-4">
              Chat with your AI coach to get personalized meal recommendations
            </p>
            <Link href="/coaching">
              <Button className="bg-green-600 hover:bg-green-700">
                Get Meal Suggestions
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}