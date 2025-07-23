'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';

import LandingPage from './landing/page';

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show landing page for non-authenticated users
  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-white text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Loading...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return <LandingPage />;
}