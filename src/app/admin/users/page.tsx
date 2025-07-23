'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Mail,
  Calendar,
  MapPin,
  Activity,
  Crown,
  RefreshCw,
  MoreHorizontal,
  Shield,
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
  updateDoc, 
  deleteDoc, 
  doc,
  limit,
  startAfter,
  DocumentSnapshot 
} from 'firebase/firestore';

interface UserData {
  id: string;
  email: string;
  userId: string;
  selectedCoach?: string;
  age?: number;
  gender?: string;
  fitnessLevel?: string;
  primaryGoals?: string[];
  onboardingCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  lastLoginAt?: Date;
  totalSessions?: number;
  profileCompleteness?: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newThisMonth: number;
  completedOnboarding: number;
}

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newThisMonth: 0,
    completedOnboarding: 0
  });
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCoach, setFilterCoach] = useState<string>('all');
  const [viewingUser, setViewingUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const USERS_PER_PAGE = 25;

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = '/dashboard';
    }
  }, [isAdmin, loading]);

  // Load users on mount
  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  // Apply filters when search or filter changes
  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, filterStatus, filterCoach]);

  // Load users from Firebase
  const loadUsers = async (loadMore = false) => {
    try {
      setLoading(true);
      
      let usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(USERS_PER_PAGE)
      );

      if (loadMore && lastDoc) {
        usersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(USERS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(usersQuery);
      const usersData: UserData[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        usersData.push({
          id: doc.id,
          email: data.email || '',
          userId: data.userId || doc.id,
          selectedCoach: data.selectedCoach,
          age: data.age,
          gender: data.gender,
          fitnessLevel: data.fitnessLevel,
          primaryGoals: data.primaryGoals || [],
          onboardingCompletedAt: data.onboardingCompletedAt?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          isActive: data.isActive !== false, // Default to true if not set
          lastLoginAt: data.lastLoginAt?.toDate(),
          totalSessions: data.totalSessions || 0,
          profileCompleteness: calculateProfileCompleteness(data)
        });
      });

      if (loadMore) {
        setUsers(prev => [...prev, ...usersData]);
      } else {
        setUsers(usersData);
      }

      // Set last document for pagination
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible || null);

      // Calculate stats
      calculateUserStats(loadMore ? [...users, ...usersData] : usersData);

    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate profile completeness percentage
  const calculateProfileCompleteness = (userData: any): number => {
    const fields = [
      'email', 'selectedCoach', 'age', 'gender', 'fitnessLevel',
      'primaryGoals', 'currentDiet', 'activityLevel'
    ];
    
    const completedFields = fields.filter(field => {
      const value = userData[field];
      return value !== undefined && value !== null && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;

    return Math.round((completedFields / fields.length) * 100);
  };

  // Calculate user statistics
  const calculateUserStats = (usersData: UserData[]) => {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const stats: UserStats = {
      totalUsers: usersData.length,
      activeUsers: usersData.filter(u => u.isActive).length,
      newThisMonth: usersData.filter(u => u.createdAt > monthAgo).length,
      completedOnboarding: usersData.filter(u => u.onboardingCompletedAt).length
    };

    setStats(stats);
  };

  // Apply search and filters
  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.userId.toLowerCase().includes(query) ||
        user.selectedCoach?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => 
        filterStatus === 'active' ? user.isActive : !user.isActive
      );
    }

    // Coach filter
    if (filterCoach !== 'all') {
      filtered = filtered.filter(user => user.selectedCoach === filterCoach);
    }

    setFilteredUsers(filtered);
  };

  // Toggle user active status
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: !currentStatus,
        updatedAt: new Date()
      });

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Export users to CSV
  const exportUsers = () => {
    const csvContent = [
      // Header
      ['Email', 'Coach', 'Age', 'Gender', 'Fitness Level', 'Goals', 'Created', 'Status'].join(','),
      // Data rows
      ...filteredUsers.map(user => [
        user.email,
        user.selectedCoach || '',
        user.age || '',
        user.gender || '',
        user.fitnessLevel || '',
        user.primaryGoals?.join('; ') || '',
        user.createdAt.toLocaleDateString(),
        user.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `force-fitness-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // User row component
  const UserRow = ({ user, index }: { user: UserData; index: number }) => (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedUsers.has(user.id)}
            onChange={() => {
              const newSelected = new Set(selectedUsers);
              if (newSelected.has(user.id)) {
                newSelected.delete(user.id);
              } else {
                newSelected.add(user.id);
              }
              setSelectedUsers(newSelected);
            }}
            className="w-4 h-4 text-blue-600 rounded border-gray-300"
          />
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.email}</div>
            <div className="text-sm text-gray-500">ID: {user.userId.slice(0, 8)}...</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {user.selectedCoach ? (
          <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
            {user.selectedCoach}
          </span>
        ) : (
          <span className="text-gray-400">No coach</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.age || 'N/A'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            (user.profileCompleteness ?? 0) > 80 ? 'bg-green-400' :
            (user.profileCompleteness ?? 0) > 50 ? 'bg-yellow-400' : 'bg-red-400'
          }`} />
          {user.profileCompleteness ?? 0}%
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          user.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.createdAt.toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setViewingUser(user);
              setShowUserModal(true);
            }}
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          
          <button
            onClick={() => toggleUserStatus(user.id, user.isActive ?? true)}
            className={`p-1 rounded ${
              user.isActive 
                ? 'text-red-600 hover:text-red-900' 
                : 'text-green-600 hover:text-green-900'
            }`}
            title={user.isActive ? 'Deactivate' : 'Activate'}
          >
            {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
          
          <button
            onClick={() => deleteUser(user.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );

  // User detail modal
  const UserDetailModal = () => {
    if (!viewingUser) return null;

    return (
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowUserModal(false)}
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
                  <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Email:</span> {viewingUser.email}</div>
                      <div><span className="font-medium">Age:</span> {viewingUser.age || 'Not provided'}</div>
                      <div><span className="font-medium">Gender:</span> {viewingUser.gender || 'Not provided'}</div>
                      <div><span className="font-medium">Fitness Level:</span> {viewingUser.fitnessLevel || 'Not provided'}</div>
                      <div><span className="font-medium">Selected Coach:</span> {viewingUser.selectedCoach || 'None'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Status:</span> {viewingUser.isActive ? 'Active' : 'Inactive'}</div>
                      <div><span className="font-medium">Created:</span> {viewingUser.createdAt.toLocaleDateString()}</div>
                      <div><span className="font-medium">Updated:</span> {viewingUser.updatedAt.toLocaleDateString()}</div>
                      <div><span className="font-medium">Onboarding:</span> {viewingUser.onboardingCompletedAt ? 'Completed' : 'Incomplete'}</div>
                      <div><span className="font-medium">Profile:</span> {viewingUser.profileCompleteness}% complete</div>
                    </div>
                  </div>
                </div>

                {viewingUser.primaryGoals && viewingUser.primaryGoals.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Goals</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingUser.primaryGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

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
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor all Force Fitness users
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => loadUsers()}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportUsers}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Activity, color: 'blue' },
          { label: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'green' },
          { label: 'New This Month', value: stats.newThisMonth, icon: Calendar, color: 'purple' },
          { label: 'Completed Onboarding', value: stats.completedOnboarding, icon: Crown, color: 'yellow' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filterCoach}
              onChange={(e) => setFilterCoach(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Coaches</option>
              <option value="marcus">Marcus</option>
              <option value="serena">Serena</option>
              <option value="alex">Alex</option>
              <option value="riley">Riley</option>
            </select>

            <div className="text-sm text-gray-500 flex items-center">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredUsers.length}
                      onChange={() => {
                        if (selectedUsers.size === filteredUsers.length) {
                          setSelectedUsers(new Set());
                        } else {
                          setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <UserRow key={user.id} user={user} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {users.length >= USERS_PER_PAGE && (
        <div className="mt-6 text-center">
          <button
            onClick={() => loadUsers(true)}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MoreHorizontal className="w-4 h-4 mr-2" />
            )}
            Load More Users
          </button>
        </div>
      )}

      {/* User Detail Modal */}
      <UserDetailModal />
    </div>
  );
}