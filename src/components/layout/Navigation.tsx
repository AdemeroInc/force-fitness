'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Dumbbell, 
  Target, 
  User, 
  LogOut,
  Activity,
  Crown,
  Sparkles,
  Flame,
  Star,
  Zap,
  MessageCircle,
  Settings,
  BarChart3
} from 'lucide-react';

import { auth, logOut } from '@/lib/firebase';
import { Button } from '@/components/ui';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/coaching', label: 'AI Coach', icon: MessageCircle },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: Settings },
];

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Admin', icon: Crown },
];

export default function Navigation() {
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);

  const handleLogout = async (): Promise<void> => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderNavItems = () => {
    const isAdmin = user?.email?.endsWith('@ademero.com') || false;
    const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;
    
    return allNavItems.map((item, index) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      
      return (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {/* Active Item Glow */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-xl blur-sm"
              />
            )}
          </AnimatePresence>
          
          <Link
            href={item.href}
            className={`relative flex items-center space-x-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-orange-500/25'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
            }`}
          >
            <motion.div
              animate={isActive ? { rotate: [0, 360] } : {}}
              transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
            >
              <Icon size={20} />
            </motion.div>
            <span className="font-bold text-sm">{item.label}</span>
            
            {/* Active Crown */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <Crown size={16} className="text-black" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Hover Sparkles */}
            <motion.div
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={12} className="text-yellow-400" />
            </motion.div>
          </Link>
        </motion.div>
      );
    });
  };

  const renderUserSection = () => {
    if (loading) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full"
        />
      );
    }

    if (user) {
      return (
        <div className="flex items-center space-x-4">
          {/* Premium User Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 hover:bg-gray-700/50 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden sm:inline-block font-bold text-white text-sm">
                {user.displayName || user.email?.split('@')[0] || 'User'}
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </motion.div>
          
          {/* Premium Logout Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={handleLogout}
              className="relative flex items-center space-x-2 bg-gray-800/50 hover:bg-red-600/20 text-gray-300 hover:text-red-400 font-bold px-4 py-2 rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-300"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline-block text-sm">LOGOUT</span>
            </button>
          </motion.div>
        </div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        <Link href="/auth">
          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-xl">
            <div className="flex items-center space-x-2">
              <Crown size={16} />
              <span className="text-sm">SIGN IN</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800/50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-900/10 via-black to-orange-900/10" />
        <motion.div
          className="absolute top-0 left-1/4 w-[300px] h-[100px] bg-gradient-radial from-yellow-500/5 to-transparent rounded-full blur-xl"
          animate={{ x: [0, 100, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-[200px] h-[100px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full blur-xl"
          animate={{ x: [0, -80, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Premium Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <Link 
              href="/" 
              className="relative flex items-center space-x-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl px-4 py-2 hover:bg-gray-800/50 transition-colors"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm opacity-50" />
                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2">
                  <Flame size={24} className="text-black" />
                </div>
              </motion.div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  FORCE
                </div>
                <div className="text-xs font-bold text-gray-400 -mt-1">
                  FITNESS
                </div>
              </div>
            </Link>
          </motion.div>
          
          {/* Navigation Items and User Section */}
          <div className="flex items-center space-x-8">
            {/* Premium Navigation Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:flex items-center space-x-2"
            >
              {renderNavItems()}
            </motion.div>
            
            {/* User Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {renderUserSection()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button (for future mobile implementation) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="lg:hidden absolute right-6 top-1/2 transform -translate-y-1/2"
      >
        <button className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-2 hover:bg-gray-700/50 transition-colors">
          <div className="w-5 h-5 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded" />
            <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded" />
            <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded" />
          </div>
        </button>
      </motion.div>
    </motion.nav>
  );
}