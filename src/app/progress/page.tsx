'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  Camera, 
  Download,
  Plus,
  Minus,
  Activity,
  Scale,
  Ruler,
  Heart,
  Zap,
  Trophy,
  ChevronRight,
  Upload,
  BarChart3,
  PieChart,
  LineChart,
  Clock
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  limit
} from 'firebase/firestore';

// Types for progress tracking
interface BodyMetrics {
  id: string;
  userId: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  recordedAt: Date;
  notes?: string;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  weeklyAverage: number;
  lastWorkout?: Date;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  category: string;
  achieved: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'goals' | 'achievements'>('overview');
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetrics[]>([]);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    weeklyAverage: 0
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [newMetrics, setNewMetrics] = useState({
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    notes: ''
  });

  // Load progress data on mount
  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load body metrics (last 30 entries)
      const metricsQuery = query(
        collection(db, 'bodyMetrics'),
        where('userId', '==', user.uid),
        orderBy('recordedAt', 'desc'),
        limit(30)
      );
      const metricsSnapshot = await getDocs(metricsQuery);
      const metricsData: BodyMetrics[] = [];
      metricsSnapshot.forEach(doc => {
        const data = doc.data();
        metricsData.push({
          id: doc.id,
          userId: data.userId,
          weight: data.weight,
          bodyFat: data.bodyFat,
          muscleMass: data.muscleMass,
          chest: data.chest,
          waist: data.waist,
          hips: data.hips,
          arms: data.arms,
          thighs: data.thighs,
          recordedAt: data.recordedAt?.toDate() || new Date(),
          notes: data.notes
        });
      });
      setBodyMetrics(metricsData);

      // Load mock workout stats (would integrate with actual workout data)
      setWorkoutStats({
        totalWorkouts: 47,
        totalMinutes: 2340,
        currentStreak: 5,
        longestStreak: 12,
        weeklyAverage: 4.2,
        lastWorkout: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      });

      // Load mock goals
      setGoals([
        {
          id: '1',
          title: 'Lose 15 pounds',
          target: 15,
          current: 8,
          unit: 'lbs',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          category: 'Weight Loss',
          achieved: false
        },
        {
          id: '2',
          title: 'Complete 100 workouts',
          target: 100,
          current: 47,
          unit: 'workouts',
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          category: 'Fitness',
          achieved: false
        },
        {
          id: '3',
          title: 'Build muscle mass',
          target: 5,
          current: 2.3,
          unit: 'lbs',
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          category: 'Strength',
          achieved: false
        }
      ]);

      // Load mock achievements
      setAchievements([
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first workout',
          icon: '🎯',
          unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          rarity: 'common'
        },
        {
          id: '2',
          title: 'Streak Master',
          description: 'Maintain a 7-day workout streak',
          icon: '🔥',
          unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          rarity: 'rare'
        },
        {
          id: '3',
          title: 'Consistency Champion',
          description: 'Complete 25 workouts',
          icon: '👑',
          unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          rarity: 'epic'
        }
      ]);

    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save new body metrics
  const saveMetrics = async () => {
    if (!user) return;
    
    try {
      const metricsData = {
        userId: user.uid,
        weight: parseFloat(newMetrics.weight) || 0,
        bodyFat: parseFloat(newMetrics.bodyFat) || undefined,
        chest: parseFloat(newMetrics.chest) || undefined,
        waist: parseFloat(newMetrics.waist) || undefined,
        hips: parseFloat(newMetrics.hips) || undefined,
        arms: parseFloat(newMetrics.arms) || undefined,
        thighs: parseFloat(newMetrics.thighs) || undefined,
        notes: newMetrics.notes || undefined,
        recordedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'bodyMetrics'), metricsData);
      
      // Reset form and reload data
      setNewMetrics({
        weight: '',
        bodyFat: '',
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: '',
        notes: ''
      });
      setShowMetricsForm(false);
      loadProgressData();
      
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  };

  // Progress Overview Component
  const ProgressOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Workouts', 
            value: workoutStats.totalWorkouts, 
            icon: Activity, 
            color: 'blue',
            change: '+12 this month'
          },
          { 
            label: 'Current Streak', 
            value: `${workoutStats.currentStreak} days`, 
            icon: Zap, 
            color: 'yellow',
            change: 'Personal best!'
          },
          { 
            label: 'Total Minutes', 
            value: `${Math.round(workoutStats.totalMinutes / 60)}h`, 
            icon: Clock, 
            color: 'green',
            change: '+240 min this week'
          },
          { 
            label: 'Goals Achieved', 
            value: goals.filter(g => g.achieved).length + '/3', 
            icon: Trophy, 
            color: 'purple',
            change: 'On track!'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Scale className="w-5 h-5 mr-2 text-blue-600" />
            Weight Progress
          </h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Weight tracking chart</p>
              <p className="text-sm text-gray-400">Add measurements to see progress</p>
            </div>
          </div>
        </div>

        {/* Workout Frequency */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
            Weekly Activity
          </h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Workout frequency chart</p>
              <p className="text-sm text-gray-400">Track your consistency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-600" />
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.slice(0, 3).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                achievement.rarity === 'legendary' ? 'border-yellow-400 bg-yellow-50' :
                achievement.rarity === 'epic' ? 'border-purple-400 bg-purple-50' :
                achievement.rarity === 'rare' ? 'border-blue-400 bg-blue-50' :
                'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {achievement.unlockedAt.toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Body Metrics Component
  const BodyMetricsSection = () => (
    <div className="space-y-6">
      {/* Add Metrics Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Body Metrics</h2>
        <button
          onClick={() => setShowMetricsForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Metrics
        </button>
      </div>

      {/* Metrics Form Modal */}
      <AnimatePresence>
        {showMetricsForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowMetricsForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Add Body Metrics</h3>
                  <button
                    onClick={() => setShowMetricsForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={newMetrics.weight}
                      onChange={(e) => setNewMetrics({...newMetrics, weight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter weight"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body Fat %
                    </label>
                    <input
                      type="number"
                      value={newMetrics.bodyFat}
                      onChange={(e) => setNewMetrics({...newMetrics, bodyFat: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter body fat %"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chest (inches)
                    </label>
                    <input
                      type="number"
                      value={newMetrics.chest}
                      onChange={(e) => setNewMetrics({...newMetrics, chest: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter chest measurement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waist (inches)
                    </label>
                    <input
                      type="number"
                      value={newMetrics.waist}
                      onChange={(e) => setNewMetrics({...newMetrics, waist: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter waist measurement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hips (inches)
                    </label>
                    <input
                      type="number"
                      value={newMetrics.hips}
                      onChange={(e) => setNewMetrics({...newMetrics, hips: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter hips measurement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arms (inches)
                    </label>
                    <input
                      type="number"
                      value={newMetrics.arms}
                      onChange={(e) => setNewMetrics({...newMetrics, arms: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter arms measurement"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newMetrics.notes}
                    onChange={(e) => setNewMetrics({...newMetrics, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add any notes about these measurements..."
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowMetricsForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveMetrics}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save Metrics
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics History */}
      <div className="bg-white rounded-lg shadow">
        {bodyMetrics.length === 0 ? (
          <div className="p-8 text-center">
            <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No metrics recorded yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your body measurements to see progress over time.</p>
            <button
              onClick={() => setShowMetricsForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Measurement
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Body Fat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bodyMetrics.map((metric, index) => (
                  <motion.tr
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.recordedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.weight} lbs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.bodyFat ? `${metric.bodyFat}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.chest ? `${metric.chest}"` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.waist ? `${metric.waist}"` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {metric.notes || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Goals Section Component
  const GoalsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Fitness Goals</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          const timeLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-500">{goal.category}</p>
                </div>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{goal.current} {goal.unit}</span>
                  <span>{goal.target} {goal.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{Math.round(progress)}% complete</span>
                  <span>{timeLeft > 0 ? `${timeLeft} days left` : 'Overdue'}</span>
                </div>
              </div>
              
              {goal.achieved ? (
                <div className="flex items-center text-green-600 text-sm">
                  <Trophy className="w-4 h-4 mr-1" />
                  Goal Achieved!
                </div>
              ) : (
                <div className="flex items-center text-gray-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {goal.target - goal.current} {goal.unit} to go
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Achievements Section Component
  const AchievementsSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border-2 ${
              achievement.rarity === 'legendary' ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100' :
              achievement.rarity === 'epic' ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100' :
              achievement.rarity === 'rare' ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100' :
              'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{achievement.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                achievement.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Unlocked {achievement.unlockedAt.toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
        <p className="text-gray-600">Monitor your fitness journey and celebrate your achievements</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'metrics', label: 'Body Metrics', icon: Scale },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <ProgressOverview />}
          {activeTab === 'metrics' && <BodyMetricsSection />}
          {activeTab === 'goals' && <GoalsSection />}
          {activeTab === 'achievements' && <AchievementsSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}