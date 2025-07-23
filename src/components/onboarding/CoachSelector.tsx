'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Crown, 
  Sparkles, 
  Zap, 
  ArrowRight,
  Star,
  Flame,
  Brain,
  Heart,
  Target
} from 'lucide-react';
import { CoachPersona } from '@/types/coaching';
import { COACH_PERSONAS } from '@/lib/coaches';
import { Card, Button } from '@/components/ui';

interface CoachSelectorProps {
  selectedCoach: string | null;
  onSelect: (coachId: string) => void;
  onNext: () => void;
}

export default function CoachSelector({ 
  selectedCoach, 
  onSelect, 
  onNext 
}: CoachSelectorProps) {
  const [hoveredCoach, setHoveredCoach] = useState<string | null>(null);

  // Coach-specific visual themes
  const coachThemes = {
    'marcus': {
      gradient: 'from-red-600 via-orange-600 to-yellow-600',
      bgGradient: 'from-red-500/20 to-orange-500/20',
      icon: Flame,
      accentColor: 'text-red-400',
      borderColor: 'border-red-500/30'
    },
    'serena': {
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bgGradient: 'from-green-500/20 to-teal-500/20',
      icon: Heart,
      accentColor: 'text-green-400',
      borderColor: 'border-green-500/30'
    },
    'alex': {
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      bgGradient: 'from-blue-500/20 to-purple-500/20',
      icon: Brain,
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    'riley': {
      gradient: 'from-pink-600 via-purple-600 to-violet-600',
      bgGradient: 'from-pink-500/20 to-violet-500/20',
      icon: Star,
      accentColor: 'text-pink-400',
      borderColor: 'border-pink-500/30'
    }
  };

  const renderPremiumCoachCard = (coach: CoachPersona, index: number) => {
    const isSelected = selectedCoach === coach.id;
    const isHovered = hoveredCoach === coach.id;
    const theme = coachThemes[coach.id as keyof typeof coachThemes];
    const CoachIcon = theme?.icon || Target;

    return (
      <motion.div
        key={coach.id}
        initial={{ opacity: 0, y: 60, rotateY: -15 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.15,
          ease: "easeOut"
        }}
        whileHover={{ 
          scale: 1.05, 
          y: -20,
          rotateY: 5,
          transition: { duration: 0.3 }
        }}
        onHoverStart={() => setHoveredCoach(coach.id)}
        onHoverEnd={() => setHoveredCoach(null)}
        className="relative group perspective-1000"
      >
        {/* Hover Glow Effect */}
        <motion.div
          className={`absolute -inset-4 bg-gradient-to-r ${theme?.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500`}
          animate={{
            scale: isSelected ? [1, 1.1, 1] : 1,
            opacity: isSelected ? [0.3, 0.5, 0.3] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isSelected ? Infinity : 0,
          }}
        />

        <div
          className={`cursor-pointer bg-gray-900/90 backdrop-blur-lg border transform-gpu transition-all duration-500 overflow-hidden rounded-lg p-6 ${
            isSelected 
              ? `${theme?.borderColor} shadow-2xl` 
              : 'border-gray-700/50 hover:border-gray-600/50'
          }`}
          onClick={() => onSelect(coach.id)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${theme?.bgGradient}`}
              animate={{ opacity: isHovered ? 0.15 : 0.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.02)_50%,transparent_75%),linear-gradient(-45deg,transparent_25%,rgba(255,255,255,.02)_50%,transparent_75%)] bg-[length:20px_20px]" />
          </div>

          <div className="relative z-10">
            {/* Selection Indicator */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="absolute -top-3 -right-3 z-20"
                >
                  <div className={`bg-gradient-to-r ${theme?.gradient} text-white rounded-full p-3 shadow-2xl`}>
                    <Crown size={20} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Coach Avatar Section */}
            <div className="relative h-64 mb-6 overflow-hidden rounded-2xl">
              {/* Main Avatar */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme?.gradient} flex items-center justify-center`}>
                <motion.div
                  className="text-8xl font-black text-white/90"
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {coach.name.split(' ')[0][0]}
                </motion.div>
              </div>

              {/* Overlay Effects */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                animate={{ opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
              />

              {/* Coach Icon */}
              <motion.div
                className="absolute top-4 left-4"
                animate={{ 
                  scale: isHovered ? 1.2 : 1,
                  rotate: isHovered ? 360 : 0,
                }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-black/30 backdrop-blur-sm rounded-full p-3">
                  <CoachIcon size={24} className="text-white" />
                </div>
              </motion.div>

              {/* Power Level Indicator */}
              <motion.div
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-full px-3 py-2">
                  <Zap size={16} className="text-yellow-400 mr-1" />
                  <span className="text-white text-sm font-bold">ELITE</span>
                </div>
              </motion.div>

              {/* Bottom Info Bar */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: isHovered ? 0 : 10, 
                  opacity: isHovered ? 1 : 0.8 
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ 
                          duration: 0.5, 
                          delay: i * 0.1, 
                          repeat: isHovered ? Infinity : 0,
                          repeatDelay: 1
                        }}
                      >
                        <Star size={12} className="text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-white text-xs font-bold">LEGENDARY</span>
                </div>
              </motion.div>

              {/* Floating Particles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Coach Information */}
            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <motion.h3 
                  className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {coach.name}
                </motion.h3>
                
                <div className={`${theme?.accentColor} font-bold text-lg`}>
                  {coach.specialty}
                </div>
              </div>
              
              <motion.p 
                className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300"
                animate={{ opacity: isHovered ? 1 : 0.8 }}
              >
                {coach.description}
              </motion.p>
              
              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2">
                {coach.expertise.slice(0, 3).map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                    className={`px-3 py-1 bg-gradient-to-r ${theme?.gradient} bg-opacity-20 border ${theme?.borderColor} text-white text-xs rounded-full font-medium backdrop-blur-sm`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              {/* Selection Call to Action */}
              <motion.div
                className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
              >
                <div className={`flex items-center ${theme?.accentColor} font-bold text-sm`}>
                  <Sparkles size={16} className="mr-2" />
                  <span>CHOOSE {coach.name.split(' ')[0].toUpperCase()}</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/30 via-black to-orange-900/30" />
        <motion.div
          className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-gradient-radial from-purple-500/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-[600px] h-[600px] bg-gradient-radial from-orange-500/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Floating Particles */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Premium Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-16"
          >
            {/* Crown Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-sm mb-8"
            >
              <Crown size={20} className="mr-2" />
              CHOOSE YOUR LEGEND
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-400 to-orange-400 mb-6 leading-tight"
            >
              SELECT YOUR
              <br />
              <span className="text-yellow-400">AI MENTOR</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Four legendary AI coaches, each with distinct personalities and expertise.
              <br />
              <span className="text-orange-400 font-bold">Choose the energy that ignites your greatness.</span>
            </motion.p>

            {/* Selection Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center justify-center space-x-4 text-gray-400"
            >
              <div className="flex items-center">
                <Sparkles size={20} className="mr-2 text-yellow-400" />
                <span className="font-medium">Elite Coaching Available</span>
              </div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <div className="flex items-center">
                <Target size={20} className="mr-2 text-green-400" />
                <span className="font-medium">Personalized Training</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Coach Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {COACH_PERSONAS.map((coach, index) => 
              renderPremiumCoachCard(coach, index)
            )}
          </div>

          {/* Premium Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            {selectedCoach ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-80 group-hover:opacity-100 transition duration-300" />
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={onNext}
                    className="relative text-xl px-16 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black border-0 rounded-2xl"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mr-3"
                    >
                      <Crown size={28} />
                    </motion.div>
                    BEGIN YOUR TRANSFORMATION
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-3"
                    >
                      <ArrowRight size={28} />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-gray-500 text-lg font-medium"
              >
                Select a coach to continue your journey
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}