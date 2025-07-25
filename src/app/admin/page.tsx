'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, CheckSquare, Users, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const adminModules = [
    {
      title: 'Task Manager',
      description: 'Manage tasks for AI agents and humans',
      icon: CheckSquare,
      href: '/admin/tasks',
      color: 'bg-blue-500',
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-green-500',
    },
    {
      title: 'Analytics',
      description: 'View app usage and performance metrics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-purple-500',
    },
    {
      title: 'Settings',
      description: 'Configure app settings and features',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your Force Fitness application
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adminModules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={module.href}
                className="relative block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
              <div>
                <span
                  className={`inline-flex rounded-lg p-3 ${module.color} text-white`}
                >
                  <Icon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {module.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {module.description}
                </p>
              </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}