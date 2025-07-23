'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Crown, 
  Flame, 
  Heart, 
  Brain, 
  Star,
  Zap,
  MessageCircle,
  ArrowUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui';
import { COACH_PERSONAS } from '@/lib/coaches';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStreamingChat } from '@/lib/hooks/useStreamingChat';
import { AICoachingService } from '@/lib/ai-coaching';
import { UserProfile, ChatMessage } from '@/types/coaching';

interface CoachChatProps {
  selectedCoach: string;
  onClose?: () => void;
}

export default function CoachChat({ selectedCoach, onClose }: CoachChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create user profile for AI coaching
  const userProfile: UserProfile = {
    id: user?.uid || 'anonymous',
    userId: user?.uid || 'anonymous',
    selectedCoach,
    age: 30, // These would come from user's profile
    gender: 'other',
    fitnessLevel: 'intermediate',
    primaryGoals: ['general_fitness'],
    medicalConditions: [],
    isOnHormoneReplacement: false,
    currentDiet: 'balanced',
    dietaryRestrictions: [],
    allergies: [],
    activityLevel: 'moderate',
    timeAvailability: { weekdays: 60, weekends: 90 },
    availableEquipment: ['basic'],
    workoutPreferences: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const { sendMessage, isStreaming, streamingMessage } = useStreamingChat({
    userProfile,
    onMessageReceived: (message) => {
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== streamingMessageId);
        return [...updated, message];
      });
    }
  });

  const coach = COACH_PERSONAS.find(c => c.id === selectedCoach);
  
  // Coach-specific themes
  const coachThemes = {
    'marcus': {
      gradient: 'from-red-600 via-orange-600 to-yellow-600',
      accent: 'text-red-400',
      bgGradient: 'from-red-500/10 to-orange-500/10',
      icon: Flame
    },
    'serena': {
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      accent: 'text-green-400',
      bgGradient: 'from-green-500/10 to-teal-500/10',
      icon: Heart
    },
    'alex': {
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      accent: 'text-blue-400',
      bgGradient: 'from-blue-500/10 to-purple-500/10',
      icon: Brain
    },
    'riley': {
      gradient: 'from-pink-600 via-purple-600 to-violet-600',
      accent: 'text-pink-400',
      bgGradient: 'from-pink-500/10 to-violet-500/10',
      icon: Star
    }
  };

  const theme = coachThemes[selectedCoach as keyof typeof coachThemes];
  const CoachIcon = theme?.icon || MessageCircle;

  // Load conversation history on component mount
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!user?.uid) return;
      
      try {
        const coachingService = AICoachingService.getInstance();
        const history = await coachingService.getConversationHistory(user.uid, selectedCoach, 20);
        
        if (history.length === 0) {
          // Add initial greeting if no history exists
          const initialMessage: ChatMessage = {
            id: '1',
            userId: user.uid,
            coachId: selectedCoach,
            content: "Welcome to your transformation journey! I'm here to push you beyond your limits and unlock the greatness within you. What's your biggest fitness goal right now?",
            role: 'coach',
            timestamp: new Date(),
            messageType: 'text'
          };
          setMessages([initialMessage]);
        } else {
          setMessages(history);
        }
      } catch (error) {
        console.error('Failed to load conversation history:', error);
        // Add fallback greeting
        const fallbackMessage: ChatMessage = {
          id: '1',
          userId: user?.uid || 'anonymous',
          coachId: selectedCoach,
          content: "Welcome back! I'm ready to continue our journey together. How can I help you today?",
          role: 'coach',
          timestamp: new Date(),
          messageType: 'text'
        };
        setMessages([fallbackMessage]);
      } finally {
        setLoading(false);
      }
    };

    loadConversationHistory();
  }, [user?.uid, selectedCoach]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      userId: user?.uid || 'anonymous',
      coachId: selectedCoach,
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // Create placeholder for streaming response
      const streamingId = `coach-${Date.now()}`;
      setStreamingMessageId(streamingId);

      const coachResponse = await sendMessage(inputMessage, messages);

      // Add final complete message
      const finalMessage: ChatMessage = {
        id: streamingId,
        userId: user?.uid || 'anonymous',
        coachId: selectedCoach,
        content: coachResponse,
        role: 'coach',
        timestamp: new Date(),
        messageType: 'text'
      };

      setMessages(prev => {
        const updated = prev.filter(m => m.id !== streamingId);
        return [...updated, finalMessage];
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        userId: user?.uid || 'anonymous',
        coachId: selectedCoach,
        content: "I'm having some technical difficulties. Please try again in a moment.",
        role: 'coach',
        timestamp: new Date(),
        messageType: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setStreamingMessageId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isCoach = message.role === 'coach';
    const isUser = message.role === 'user';
    const isStreamingThis = message.id === streamingMessageId;

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
      >
        <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isCoach 
                ? `bg-gradient-to-r ${theme?.gradient} shadow-lg` 
                : 'bg-gradient-to-r from-gray-600 to-gray-800'
            }`}
          >
            {isCoach ? (
              <CoachIcon size={20} className="text-white" />
            ) : (
              <div className="text-white font-bold text-sm">YOU</div>
            )}
          </motion.div>

          {/* Message Bubble */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative group ${
              isCoach 
                ? 'bg-gray-900/80 backdrop-blur-lg border border-gray-700/50' 
                : 'bg-gradient-to-r from-gray-700 to-gray-800'
            } rounded-2xl p-4 shadow-xl`}
          >
            {/* Background Effects for Coach Messages */}
            {isCoach && (
              <div className="absolute inset-0 opacity-5">
                <div className={`absolute inset-0 bg-gradient-to-br ${theme?.bgGradient} rounded-2xl`} />
              </div>
            )}

            {/* Message Content */}
            <div className="relative z-10">
              {/* Coach Name Badge */}
              {isCoach && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center mb-2"
                >
                  <Crown size={14} className="text-yellow-400 mr-2" />
                  <span className={`${theme?.accent} font-bold text-sm uppercase tracking-wide`}>
                    {coach?.name}
                  </span>
                  <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </motion.div>
              )}

              <p className={`${isCoach ? 'text-white' : 'text-gray-100'} leading-relaxed`}>
                {isStreamingThis && streamingMessage ? streamingMessage : message.content}
                {isStreamingThis && isStreaming && (
                  <motion.span
                    className="inline-block ml-1 w-2 h-4 bg-white rounded-sm"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </p>

              {/* Timestamp */}
              <div className={`text-xs mt-2 ${isCoach ? 'text-gray-400' : 'text-gray-300'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Coach Message Enhancement */}
            {isCoach && (
              <motion.div
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.2, rotate: 180 }}
              >
                <div className={`bg-gradient-to-r ${theme?.gradient} rounded-full p-1`}>
                  <Sparkles size={12} className="text-white" />
                </div>
              </motion.div>
            )}

            {/* Message Reactions */}
            <motion.div
              className="absolute -bottom-2 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
            >
              <div className="flex space-x-1">
                {['🔥', '💪', '⚡'].map((emoji, i) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-xs hover:bg-black/70 transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20" />
        <motion.div
          className={`absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial ${theme?.bgGradient} rounded-full blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${theme?.gradient} flex items-center justify-center shadow-lg`}
            >
              <CoachIcon size={28} className="text-white" />
            </motion.div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black text-white">{coach?.name}</h2>
                <Crown size={20} className="text-yellow-400" />
              </div>
              <div className={`${theme?.accent} font-bold`}>{coach?.specialty}</div>
              <div className="flex items-center text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                ONLINE & READY
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-3 rounded-full ${audioEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'} hover:bg-green-500/30 transition-colors`}
            >
              {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </motion.button>

            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                ×
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-400">Loading conversation...</div>
            </div>
          ) : (
            messages.map((message, index) => renderMessage(message, index))
          )}
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isStreaming && !streamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start mb-6"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme?.gradient} flex items-center justify-center`}>
                    <CoachIcon size={20} className="text-white" />
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Premium Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-gray-900/80 backdrop-blur-lg border-t border-gray-700/50 p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Input Container */}
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 focus-within:border-yellow-500/50 transition-colors">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message to start your transformation..."
                    className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none text-lg"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Voice Input */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVoiceInput}
                    className={`p-3 rounded-full transition-colors ${
                      isListening 
                        ? 'bg-red-500/20 text-red-400 animate-pulse' 
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                    }`}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </motion.button>

                  {/* Send Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isStreaming}
                      className={`bg-gradient-to-r ${theme?.gradient} text-white font-bold px-6 py-3 rounded-xl border-0 disabled:opacity-50 disabled:scale-100`}
                    >
                      <ArrowUp size={20} />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mt-4 space-x-4"
            >
              {[
                { text: 'Create Workout', icon: Zap },
                { text: 'Meal Plan', icon: Heart },
                { text: 'Progress Check', icon: Star }
              ].map(({ text, icon: Icon }) => (
                <motion.button
                  key={text}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-gray-700/30 hover:bg-gray-600/40 text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
                >
                  <Icon size={16} />
                  <span>{text}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}