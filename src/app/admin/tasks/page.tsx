'use client';

import { useState, useEffect } from 'react';
import { Plus, Filter, Search, Bot, User, Zap, Code, Bug, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/admin/TaskCard';
import TaskForm from '@/components/admin/TaskForm';
import { taskService } from '@/lib/services/taskService';
import { Task, TaskStatus, TaskPriority, TaskAssignee } from '@/types/task';
import { useAuth } from '@/lib/hooks/useAuth';

export default function TaskManagerPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    search: '',
  });

  useEffect(() => {
    loadTasks().then(() => {
      checkAndReleaseStaleClaimedTasks();
    });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle window focus/blur events
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Auto-refresh every 15 seconds when window is focused
  useEffect(() => {
    if (!isWindowFocused) return;

    const interval = setInterval(() => {
      loadTasks();
      checkAndReleaseStaleClaimedTasks();
      setLastRefresh(new Date());
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [isWindowFocused]);

  const loadTasks = async () => {
    try {
      const loadedTasks = await taskService.getAllTasks();
      setTasks(loadedTasks);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndReleaseStaleClaimedTasks = async () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const staleTasks = tasks.filter(task => 
      task.claimedBy && 
      task.claimedAt && 
      new Date(task.claimedAt) < twoHoursAgo &&
      task.status === 'in_progress'
    );

    for (const task of staleTasks) {
      try {
        await taskService.unclaimTask(task.id);
        setNotification({ 
          type: 'success', 
          message: `Task "${task.title}" was automatically released due to inactivity` 
        });
      } catch (error) {
        console.error('Error releasing stale task:', error);
      }
    }

    if (staleTasks.length > 0) {
      await loadTasks();
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.assignee !== 'all') {
      filtered = filtered.filter(task => task.assignee === filters.assignee);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await taskService.createTask({
        ...taskData,
        status: 'pending',
        createdBy: user?.email || 'admin',
        tags: taskData.tags || [],
      } as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
      
      await loadTasks();
      setShowForm(false);
      setEditingTask(undefined);
      setNotification({ type: 'success', message: 'Task created successfully!' });
    } catch (error) {
      console.error('Error creating task:', error);
      setNotification({ type: 'error', message: 'Failed to create task. Please try again.' });
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    
    try {
      await taskService.updateTask(editingTask.id, taskData);
      await loadTasks();
      setShowForm(false);
      setEditingTask(undefined);
      setNotification({ type: 'success', message: 'Task updated successfully!' });
    } catch (error) {
      console.error('Error updating task:', error);
      setNotification({ type: 'error', message: 'Failed to update task. Please try again.' });
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, status);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handlePriorityChange = async (taskId: string, priority: TaskPriority) => {
    try {
      await taskService.updateTaskPriority(taskId, priority);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  const handleClaimTask = async (taskId: string) => {
    if (!user?.email) return;
    
    try {
      await taskService.claimTask(taskId, user.email);
      await loadTasks();
      setNotification({ type: 'success', message: 'Task claimed successfully!' });
    } catch (error) {
      console.error('Error claiming task:', error);
      setNotification({ type: 'error', message: 'Failed to claim task. Please try again.' });
    }
  };

  const handleUnclaimTask = async (taskId: string) => {
    try {
      await taskService.unclaimTask(taskId);
      await loadTasks();
      setNotification({ type: 'success', message: 'Task released successfully!' });
    } catch (error) {
      console.error('Error unclaiming task:', error);
      setNotification({ type: 'error', message: 'Failed to release task. Please try again.' });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      await loadTasks();
      setNotification({ type: 'success', message: 'Task deleted successfully!' });
    } catch (error) {
      console.error('Error deleting task:', error);
      setNotification({ type: 'error', message: 'Failed to delete task. Please try again.' });
    }
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    claimed: tasks.filter(t => t.claimedBy).length,
    aiTasks: tasks.filter(t => t.assignee === 'ai_agent').length,
    humanTasks: tasks.filter(t => t.assignee === 'human').length,
  };

  const formatLastRefresh = () => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
      {notification && (
        <div className={`mb-4 p-4 rounded-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Task Manager</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage tasks for AI agents and human team members
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Updated {formatLastRefresh()}</span>
          </div>
          <button
            onClick={() => {
              setEditingTask(undefined);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Quick Task Templates</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => {
              setEditingTask(undefined);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Code className="w-4 h-4 mr-1 text-blue-600 flex-shrink-0" />
            <span className="truncate">Feature Request</span>
          </button>
          <button
            onClick={() => {
              setEditingTask(undefined);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Bug className="w-4 h-4 mr-1 text-red-600 flex-shrink-0" />
            <span className="truncate">Bug Fix</span>
          </button>
          <button
            onClick={() => {
              setEditingTask(undefined);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Sparkles className="w-4 h-4 mr-1 text-purple-600 flex-shrink-0" />
            <span className="truncate">UI Enhancement</span>
          </button>
          <button
            onClick={() => {
              setEditingTask(undefined);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Zap className="w-4 h-4 mr-1 text-yellow-600 flex-shrink-0" />
            <span className="truncate">Performance</span>
          </button>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-semibold text-gray-900">{taskStats.total}</div>
          <div className="text-sm text-gray-500">Total Tasks</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-semibold text-yellow-600">{taskStats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-semibold text-blue-600">{taskStats.inProgress}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-semibold text-orange-600">{taskStats.claimed}</div>
          <div className="text-sm text-gray-500">Claimed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-semibold text-green-600">{taskStats.completed}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-semibold text-purple-600">{taskStats.aiTasks}</div>
          <div className="text-sm text-gray-500">AI Tasks</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-semibold text-indigo-600">{taskStats.humanTasks}</div>
          <div className="text-sm text-gray-500">Human Tasks</div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="released">Released</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            value={filters.assignee}
            onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Assignees</option>
            <option value="ai_agent">AI Agent</option>
            <option value="human">Human</option>
            <option value="any">Any</option>
          </select>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              currentUser={user?.email || null}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onEdit={(task) => {
                setEditingTask(task);
                setShowForm(true);
              }}
              onClaim={handleClaimTask}
              onUnclaim={handleUnclaimTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(undefined);
          }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}