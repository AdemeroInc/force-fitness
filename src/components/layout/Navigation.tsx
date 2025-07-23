'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { 
  Home, 
  Dumbbell, 
  Target, 
  User, 
  LogOut,
  Activity 
} from 'lucide-react';

import { auth, logOut } from '@/lib/firebase';
import { Button } from '@/components/ui';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/goals', label: 'Goals', icon: Target },
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

  const renderNavItems = (): JSX.Element[] => {
    return navItems.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      
      return (
        <motion.div
          key={item.href}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={item.href}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <Icon size={18} />
            <span className="font-medium">{item.label}</span>
          </Link>
        </motion.div>
      );
    });
  };

  const renderUserSection = (): JSX.Element | null => {
    if (loading) return null;

    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <User size={18} />
            <span className="hidden sm:inline-block font-medium">
              {user.displayName || user.email}
            </span>
          </div>
          <Button 
            variant="danger" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline-block">Logout</span>
          </Button>
        </div>
      );
    }

    return (
      <Link href="/auth">
        <Button variant="primary" size="sm">
          Sign In
        </Button>
      </Link>
    );
  };

  return (
    <motion.nav 
      className="bg-white shadow-lg border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-indigo-600"
            >
              <Activity size={28} />
              <span>Force Fitness</span>
            </Link>
          </motion.div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2">
              {renderNavItems()}
            </div>
            {renderUserSection()}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}