'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown,
  Sparkles,
  Flame,
  Star,
  Zap
} from 'lucide-react';

interface LoadingScreenProps {
  isVisible: boolean;
  message?: string;
  stage?: 'loading' | 'success' | 'error';
}

export default function LoadingScreen({ 
  isVisible, 
  message = "Loading your transformation...", 
  stage = 'loading' 
}: LoadingScreenProps) {
  const stageConfig = {
    loading: {
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      icon: Flame,
      pulseColor: 'from-yellow-500/20 to-orange-500/20'
    },
    success: {
      gradient: 'from-green-400 via-emerald-500 to-teal-500',
      icon: Crown,
      pulseColor: 'from-green-500/20 to-emerald-500/20'
    },
    error: {
      gradient: 'from-red-400 via-pink-500 to-purple-500',
      icon: Zap,
      pulseColor: 'from-red-500/20 to-pink-500/20'
    }
  };

  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          {/* Premium Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/30 via-black to-orange-900/30" />
            
            {/* Animated Background Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-purple-500/15 to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-radial from-orange-500/15 to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -120, 0],
                y: [0, 80, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Floating Particles */}
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -150, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 6,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main Loading Content */}
          <div className="relative z-10 text-center">
            {/* Premium Logo with Effects */}
            <motion.div
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-12"
            >
              {/* Logo Glow */}
              <motion.div
                className={`absolute -inset-8 bg-gradient-to-r ${config.gradient} rounded-full blur-2xl`}
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.3, 0.6, 0.3],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              {/* Main Logo */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className={`relative w-32 h-32 mx-auto bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center shadow-2xl`}
              >
                <Icon size={64} className="text-black" />
              </motion.div>
              
              {/* Orbiting Sparkles */}
              {[0, 72, 144, 216, 288].map((rotation, index) => (
                <motion.div
                  key={index}
                  className="absolute top-1/2 left-1/2 w-6 h-6"
                  style={{
                    transformOrigin: '0 0',
                  }}
                  animate={{
                    rotate: [rotation, rotation + 360],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.2
                  }}
                >
                  <motion.div
                    className="absolute -top-3 -left-3"
                    animate={{
                      scale: [0.5, 1.2, 0.5],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.1
                    }}
                  >
                    <div className={`w-6 h-6 bg-gradient-to-r ${config.gradient} rounded-full`}>
                      <Sparkles size={16} className="text-black m-1" />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-400 to-orange-400 mb-2">
                FORCE
              </h1>
              <div className="text-2xl font-bold text-gray-400 tracking-[0.2em]">
                FITNESS
              </div>
            </motion.div>

            {/* Loading Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mb-12"
            >
              <p className="text-xl text-gray-300 font-medium mb-4">
                {message}
              </p>
              
              {/* Premium Progress Bar */}
              <div className="relative w-80 h-2 mx-auto bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                  animate={{
                    width: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${config.pulseColor} rounded-full blur-sm`}
                  animate={{
                    width: ["0%", "100%", "0%"],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            {/* Loading Indicators */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex justify-center space-x-2"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 bg-gradient-to-r ${config.gradient} rounded-full`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Motivational Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Star size={16} className="text-yellow-400 mr-2" />
                <p className="text-gray-400 text-sm font-medium italic">
                  "Greatness is not a destination, it's a way of traveling"
                </p>
                <Star size={16} className="text-yellow-400 ml-2" />
              </div>
              <div className="text-yellow-400 text-xs font-bold">
                — FORCE FITNESS
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}