'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign,
  MessageCircle,
  Clock,
  AlertTriangle,
  Server,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  Heart,
  Brain,
  Star,
  Shield,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  limit,
  startAfter,
  Timestamp
} from 'firebase/firestore';

// Analytics data interfaces
interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userRetentionRate: number;
  averageSessionDuration: number;
  completedOnboarding: number;
}

interface UsageStatistics {
  totalSessions: number;
  averageSessionLength: number;
  mostUsedFeatures: Array<{ feature: string; usage: number }>;
  pageViews: Array<{ page: string; views: number }>;
  mobileVsDesktop: { mobile: number; desktop: number };
}

interface AICoachingMetrics {
  totalConversations: number;
  averageMessagesPerSession: number;
  mostPopularCoach: string;
  coachUsageBreakdown: Array<{ coach: string; usage: number }>;
  responseTime: number;
  userSatisfactionScore: number;
}

interface PerformanceData {
  averagePageLoadTime: number;
  errorRate: number;
  uptime: number;
  apiResponseTime: number;
  crashRate: number;
}

interface RevenueAnalytics {
  monthlyRevenue: number;
  subscriptionConversions: number;
  churnRate: number;
  lifetimeValue: number;
  revenueGrowth: number;
}

interface SystemHealth {
  firebaseUsage: {
    reads: number;
    writes: number;
    storage: number;
  };
  apiCosts: number;
  serverLoad: number;
  databasePerformance: number;
}

export default function AdminAnalyticsPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'usage' | 'ai' | 'performance' | 'revenue' | 'system'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Analytics data state
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    userRetentionRate: 0,
    averageSessionDuration: 0,
    completedOnboarding: 0
  });
  
  const [usageStats, setUsageStats] = useState<UsageStatistics>({
    totalSessions: 0,
    averageSessionLength: 0,
    mostUsedFeatures: [],
    pageViews: [],
    mobileVsDesktop: { mobile: 0, desktop: 0 }
  });
  
  const [aiMetrics, setAiMetrics] = useState<AICoachingMetrics>({
    totalConversations: 0,
    averageMessagesPerSession: 0,
    mostPopularCoach: '',
    coachUsageBreakdown: [],
    responseTime: 0,
    userSatisfactionScore: 0
  });
  
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    averagePageLoadTime: 0,
    errorRate: 0,
    uptime: 0,
    apiResponseTime: 0,
    crashRate: 0
  });
  
  const [revenueData, setRevenueData] = useState<RevenueAnalytics>({
    monthlyRevenue: 0,
    subscriptionConversions: 0,
    churnRate: 0,
    lifetimeValue: 0,
    revenueGrowth: 0
  });
  
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    firebaseUsage: { reads: 0, writes: 0, storage: 0 },
    apiCosts: 0,
    serverLoad: 0,
    databasePerformance: 0
  });

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = '/dashboard';
    }
  }, [isAdmin, loading]);

  // Load analytics data on mount
  useEffect(() => {
    if (isAdmin) {
      loadAnalyticsData();
    }
  }, [isAdmin, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load mock analytics data (in production, this would query Firebase)
      await loadUserMetrics();
      await loadUsageStatistics();
      await loadAICoachingMetrics();
      await loadPerformanceData();
      await loadRevenueAnalytics();
      await loadSystemHealth();
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data loading functions (in production, these would query Firebase)
  const loadUserMetrics = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUserMetrics({
      totalUsers: 1247,
      activeUsers: 892,
      newUsersThisMonth: 156,
      userRetentionRate: 78.5,
      averageSessionDuration: 24.3,
      completedOnboarding: 1089
    });
  };

  const loadUsageStatistics = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setUsageStats({
      totalSessions: 15432,
      averageSessionLength: 18.7,
      mostUsedFeatures: [
        { feature: 'AI Coaching', usage: 4521 },
        { feature: 'Workout Tracking', usage: 3892 },
        { feature: 'Progress Analytics', usage: 2756 },
        { feature: 'Goal Setting', usage: 2143 },
        { feature: 'Profile Management', usage: 1834 }
      ],
      pageViews: [
        { page: '/dashboard', views: 12543 },
        { page: '/coaching', views: 8921 },
        { page: '/workouts', views: 6754 },
        { page: '/progress', views: 5432 },
        { page: '/goals', views: 4321 }
      ],
      mobileVsDesktop: { mobile: 8234, desktop: 7198 }
    });
  };

  const loadAICoachingMetrics = async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    setAiMetrics({
      totalConversations: 3456,
      averageMessagesPerSession: 12.4,
      mostPopularCoach: 'Marcus "The Elite" Thompson',
      coachUsageBreakdown: [
        { coach: 'Marcus', usage: 1234 },
        { coach: 'Serena', usage: 987 },
        { coach: 'Alex', usage: 765 },
        { coach: 'Riley', usage: 470 }
      ],
      responseTime: 1.2,
      userSatisfactionScore: 4.7
    });
  };

  const loadPerformanceData = async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setPerformanceData({
      averagePageLoadTime: 1.8,
      errorRate: 0.12,
      uptime: 99.97,
      apiResponseTime: 245,
      crashRate: 0.003
    });
  };

  const loadRevenueAnalytics = async () => {
    await new Promise(resolve => setTimeout(resolve, 550));
    
    setRevenueData({
      monthlyRevenue: 48750,
      subscriptionConversions: 18.7,
      churnRate: 3.2,
      lifetimeValue: 186.50,
      revenueGrowth: 23.5
    });
  };

  const loadSystemHealth = async () => {
    await new Promise(resolve => setTimeout(resolve, 650));
    
    setSystemHealth({
      firebaseUsage: {
        reads: 145820,
        writes: 32451,
        storage: 2.8
      },
      apiCosts: 234.67,
      serverLoad: 45.2,
      databasePerformance: 98.5
    });
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const exportData = () => {
    const exportData = {
      userMetrics,
      usageStats,
      aiMetrics,
      performanceData,
      revenueData,
      systemHealth,
      exportedAt: new Date().toISOString(),
      dateRange
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `force-fitness-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    window.URL.revokeObjectURL(url);
  };

  // Stats Card Component
  const StatsCard = ({ title, value, change, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {change && (
            <p className={`text-sm mt-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  // Overview Dashboard
  const OverviewDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={userMetrics.totalUsers.toLocaleString()}
          change="+12.5%"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={userMetrics.activeUsers.toLocaleString()}
          change="+8.3%"
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${revenueData.monthlyRevenue.toLocaleString()}`}
          change="+23.5%"
          icon={DollarSign}
          color="yellow"
        />
        <StatsCard
          title="AI Conversations"
          value={aiMetrics.totalConversations.toLocaleString()}
          change="+15.2%"
          icon={MessageCircle}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            User Growth
          </h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">User growth trend chart</p>
              <p className="text-sm text-gray-400">Interactive line chart</p>
            </div>
          </div>
        </div>

        {/* Feature Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
            Feature Usage
          </h3>
          <div className="space-y-3">
            {usageStats.mostUsedFeatures.map((feature, index) => {
              const percentage = (feature.usage / usageStats.mostUsedFeatures[0].usage) * 100;
              return (
                <div key={feature.feature}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{feature.feature}</span>
                    <span className="text-gray-900 font-medium">{feature.usage.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2 text-green-600" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Uptime</span>
              <span className="text-green-600 font-semibold">{performanceData.uptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Error Rate</span>
              <span className="text-gray-900 font-semibold">{performanceData.errorRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Time</span>
              <span className="text-gray-900 font-semibold">{performanceData.apiResponseTime}ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Response Time</span>
              <span className="text-purple-600 font-semibold">{aiMetrics.responseTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Satisfaction Score</span>
              <span className="text-purple-600 font-semibold">{aiMetrics.userSatisfactionScore}/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Messages/Session</span>
              <span className="text-gray-900 font-semibold">{aiMetrics.averageMessagesPerSession}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Firebase Usage
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reads</span>
              <span className="text-blue-600 font-semibold">{systemHealth.firebaseUsage.reads.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Writes</span>
              <span className="text-blue-600 font-semibold">{systemHealth.firebaseUsage.writes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Storage</span>
              <span className="text-gray-900 font-semibold">{systemHealth.firebaseUsage.storage}GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive insights into Force Fitness performance and usage
            </p>
          </div>
          <div className="flex space-x-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'usage', label: 'Usage', icon: Activity },
            { id: 'ai', label: 'AI Coaching', icon: Brain },
            { id: 'performance', label: 'Performance', icon: Zap },
            { id: 'revenue', label: 'Revenue', icon: DollarSign },
            { id: 'system', label: 'System', icon: Server }
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
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading analytics data...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewDashboard />}
            {/* Additional tab content would be implemented here */}
            {activeTab !== 'overview' && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics
                </h3>
                <p className="text-gray-500">
                  Detailed {activeTab} analytics dashboard would be implemented here with interactive charts and data tables.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}