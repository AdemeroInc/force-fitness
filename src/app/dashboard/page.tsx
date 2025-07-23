'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  Target,
  Utensils,
  Dumbbell,
  Award,
  Zap
} from 'lucide-react';

import { auth } from '@/lib/firebase';
import { Button, Card } from '@/components/ui';
import { COACH_PERSONAS } from '@/lib/coaches';
import { isAdmin } from '@/lib/admin';
import Link from 'next/link';

interface DashboardStats {
  workoutsCompleted: number;
  currentStreak: number;
  goalProgress: number;
  caloriesBurned: number;
}

const mockStats: DashboardStats = {
  workoutsCompleted: 24,
  currentStreak: 7,
  goalProgress: 73,
  caloriesBurned: 2847
};

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [selectedCoach] = useState('elite-performance'); // Would come from user profile
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentCoach = COACH_PERSONAS.find(coach => coach.id === selectedCoach);

  const renderWelcomeSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.displayName || user.email?.split('@')[0]}!
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to crush your fitness goals today?
            </p>
            {isAdmin(user) && (
              <Link href="/admin" className="inline-flex items-center mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors">
                Admin Dashboard →
              </Link>
            )}
          </div>
          
          {currentCoach && (
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-4 flex items-center justify-center text-black font-bold text-lg">
                {currentCoach.name.split(' ')[0][0]}
              </div>
              <div>
                <div className="font-semibold">{currentCoach.name}</div>
                <div className="text-blue-200 text-sm">Your AI Coach</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderStatsGrid = () => (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {[
        { 
          icon: Dumbbell, 
          label: 'Workouts', 
          value: mockStats.workoutsCompleted,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        },
        { 
          icon: Zap, 
          label: 'Day Streak', 
          value: mockStats.currentStreak,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        },
        { 
          icon: Target, 
          label: 'Goal Progress', 
          value: `${mockStats.goalProgress}%`,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        },
        { 
          icon: Award, 
          label: 'Calories Burned', 
          value: mockStats.caloriesBurned.toLocaleString(),
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        }
      ].map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${stat.bgColor} border-0`}>
              <div className="flex items-center">
                <div className={`${stat.color} mr-4`}>
                  <Icon size={32} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  const renderQuickActions = () => (
    <div className="grid lg:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center mb-4">
            <MessageCircle className="text-blue-600 mr-3" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Chat with Coach</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Get personalized advice and motivation from your AI coach
          </p>
          <Link href="/coaching" className="block">
            <Button className="w-full">
              Start Conversation
            </Button>
          </Link>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center mb-4">
            <Utensils className="text-green-600 mr-3" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Today's Meals</h3>
          </div>
          <p className="text-gray-600 mb-6">
            View your personalized meal plan and recipes
          </p>
          <Link href="/meals" className="block">
            <Button variant="success" className="w-full">
              View Meal Plan
            </Button>
          </Link>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="h-full bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100">
          <div className="flex items-center mb-4">
            <Calendar className="text-purple-600 mr-3" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Today's Workout</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Your personalized workout plan is ready
          </p>
          <Link href="/workouts" className="block">
            <Button variant="secondary" className="w-full bg-purple-600 hover:bg-purple-700">
              Start Workout
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );

  const renderRecentActivity = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {[
            {
              type: 'workout',
              title: 'Upper Body Strength',
              subtitle: 'Completed 45 min workout',
              time: '2 hours ago',
              icon: Dumbbell,
              color: 'text-blue-600'
            },
            {
              type: 'meal',
              title: 'Protein-Rich Breakfast',
              subtitle: 'Logged 420 calories',
              time: '5 hours ago',
              icon: Utensils,
              color: 'text-green-600'
            },
            {
              type: 'progress',
              title: 'Weight Goal Update',
              subtitle: 'Lost 2 lbs this week',
              time: '1 day ago',
              icon: TrendingUp,
              color: 'text-purple-600'
            }
          ].map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`${activity.color} mr-4`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {activity.title}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {activity.subtitle}
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  {activity.time}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {renderWelcomeSection()}
        {renderStatsGrid()}
        {renderQuickActions()}
        {renderRecentActivity()}
      </div>
    </div>
  );
}