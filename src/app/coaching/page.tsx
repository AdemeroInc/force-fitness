'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/hooks/useAuth';
import CoachChat from '@/components/coaching/CoachChat';
import { COACH_PERSONAS } from '@/lib/coaches';
import { Button } from '@/components/ui';

export default function CoachingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading coaching session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // If a coach is selected, show the chat interface
  if (selectedCoach) {
    return (
      <CoachChat 
        selectedCoach={selectedCoach} 
        onClose={() => setSelectedCoach(null)} 
      />
    );
  }

  // Coach selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">Choose Your AI Coach</h1>
          <p className="text-xl text-gray-400">
            Select a coach that matches your fitness goals and personality
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COACH_PERSONAS.map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20"
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{coach.name}</h3>
                  <p className="text-indigo-400 font-semibold">{coach.specialty}</p>
                </div>

                <p className="text-gray-300 mb-4 text-center text-sm">
                  {coach.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {coach.expertise.slice(0, 3).map((expertise) => (
                      <span
                        key={expertise}
                        className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                      >
                        {expertise}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedCoach(coach.id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Start Chatting
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}