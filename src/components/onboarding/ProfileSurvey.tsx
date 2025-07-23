'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Target, 
  Utensils, 
  AlertCircle,
  Check,
  Sparkles,
  Crown,
  ArrowRight,
  ArrowLeft,
  Star,
  Flame,
  Zap,
  Heart,
  Shield
} from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

interface SurveyData {
  age: number;
  gender: 'male' | 'female' | 'other';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoals: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  medicalConditions: string[];
  isOnHormoneReplacement: boolean;
  hormoneDetails: string;
  currentDiet: string;
  activityLevel: string;
  availableEquipment: string[];
  workoutPreferences: string[];
  weekdayTime: number;
  weekendTime: number;
}

interface ProfileSurveyProps {
  onComplete: (data: SurveyData) => void;
  onBack: () => void;
}

const initialData: SurveyData = {
  age: 25,
  gender: 'male',
  fitnessLevel: 'beginner',
  primaryGoals: [],
  dietaryRestrictions: [],
  allergies: [],
  medicalConditions: [],
  isOnHormoneReplacement: false,
  hormoneDetails: '',
  currentDiet: '',
  activityLevel: '',
  availableEquipment: [],
  workoutPreferences: [],
  weekdayTime: 30,
  weekendTime: 60,
};

export default function ProfileSurvey({ onComplete, onBack }: ProfileSurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>(initialData);

  const updateData = (field: keyof SurveyData, value: any): void => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof SurveyData, item: string): void => {
    setSurveyData(prev => {
      const currentArray = prev[field] as string[];
      const updatedArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: updatedArray };
    });
  };

  const nextStep = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(surveyData);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-8">
      {/* Premium Age and Gender Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-xl blur opacity-30" />
          <div className="relative bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
            <label className="flex items-center text-lg font-bold text-white mb-4">
              <User size={20} className="mr-2 text-orange-400" />
              Age
            </label>
            <div className="relative">
              <input
                type="number"
                value={surveyData.age}
                onChange={(e) => updateData('age', parseInt(e.target.value))}
                min={13}
                max={120}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white text-2xl font-bold rounded-lg px-4 py-3 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 text-sm font-medium">
                YEARS
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-30" />
          <div className="relative bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
            <label className="flex items-center text-lg font-bold text-white mb-4">
              <Star size={20} className="mr-2 text-purple-400" />
              Gender
            </label>
            <div className="flex gap-3">
              {[
                { value: 'male', label: 'Male', icon: '♂️' },
                { value: 'female', label: 'Female', icon: '♀️' },
                { value: 'other', label: 'Other', icon: '⚧' }
              ].map((gender, index) => (
                <motion.button
                  key={gender.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateData('gender', gender.value)}
                  className={`flex-1 p-3 rounded-lg font-bold text-center transition-all duration-300 ${
                    surveyData.gender === gender.value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-600/30'
                  }`}
                >
                  <div className="text-2xl mb-1">{gender.icon}</div>
                  <div className="capitalize text-sm">{gender.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Fitness Level Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative"
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-40" />
        <div className="relative bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-sm mb-4"
            >
              <Crown size={20} className="mr-2" />
              FITNESS EXPERIENCE
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-2">What's Your Level?</h3>
            <p className="text-gray-400">Help us customize your training intensity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                value: 'beginner', 
                label: 'BEGINNER', 
                desc: 'New to fitness journey', 
                icon: Star,
                gradient: 'from-green-500 to-emerald-600',
                bgGradient: 'from-green-500/10 to-emerald-500/10'
              },
              { 
                value: 'intermediate', 
                label: 'INTERMEDIATE', 
                desc: '6+ months experience', 
                icon: Flame,
                gradient: 'from-orange-500 to-red-600',
                bgGradient: 'from-orange-500/10 to-red-500/10'
              },
              { 
                value: 'advanced', 
                label: 'ADVANCED', 
                desc: '2+ years of dedication', 
                icon: Zap,
                gradient: 'from-purple-500 to-violet-600',
                bgGradient: 'from-purple-500/10 to-violet-500/10'
              }
            ].map((level, index) => {
              const LevelIcon = level.icon;
              const isSelected = surveyData.fitnessLevel === level.value;
              
              return (
                <motion.div
                  key={level.value}
                  initial={{ opacity: 0, y: 40, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group"
                >
                  {/* Selection Glow */}
                  {isSelected && (
                    <motion.div
                      className={`absolute -inset-2 bg-gradient-to-r ${level.gradient} rounded-2xl blur-lg opacity-40`}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <button
                    onClick={() => updateData('fitnessLevel', level.value)}
                    className={`relative w-full p-6 rounded-2xl font-bold text-center transition-all duration-500 border-2 ${
                      isSelected
                        ? `bg-gradient-to-br ${level.bgGradient} border-transparent text-white shadow-2xl`
                        : 'bg-gray-800/50 border-gray-600/30 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50 hover:text-white'
                    }`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute inset-0 bg-gradient-to-br ${level.bgGradient} rounded-2xl`} />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <motion.div
                        animate={isSelected ? { rotate: [0, 360] } : {}}
                        transition={{ duration: 2, repeat: isSelected ? Infinity : 0, ease: "linear" }}
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                          isSelected ? `bg-gradient-to-r ${level.gradient}` : 'bg-gray-700'
                        }`}
                      >
                        <LevelIcon size={32} className="text-white" />
                      </motion.div>
                      
                      <div className="font-black text-lg mb-2">{level.label}</div>
                      <div className="text-sm opacity-80">{level.desc}</div>
                      
                      {/* Selection Indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="absolute -top-3 -right-3"
                          >
                            <div className={`bg-gradient-to-r ${level.gradient} text-white rounded-full p-2 shadow-lg`}>
                              <Check size={16} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderGoalsAndPreferences = () => (
    <div className="space-y-8">
      {/* Premium Goals Selection */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-40" />
        <div className="relative bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full font-black text-sm mb-4"
            >
              <Target size={20} className="mr-2" />
              YOUR GOALS
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-2">What Drives You?</h3>
            <p className="text-gray-400">Select all goals that inspire your journey</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { goal: 'Weight Loss', icon: '🔥', gradient: 'from-red-500 to-orange-600' },
              { goal: 'Muscle Gain', icon: '💪', gradient: 'from-blue-500 to-purple-600' },
              { goal: 'Strength Building', icon: '⚡', gradient: 'from-yellow-500 to-orange-600' },
              { goal: 'Endurance', icon: '🏃', gradient: 'from-green-500 to-teal-600' },
              { goal: 'Flexibility', icon: '🧘', gradient: 'from-purple-500 to-pink-600' },
              { goal: 'General Health', icon: '❤️', gradient: 'from-pink-500 to-red-600' },
              { goal: 'Competition Prep', icon: '🏆', gradient: 'from-yellow-400 to-orange-500' },
              { goal: 'Rehabilitation', icon: '🌟', gradient: 'from-teal-500 to-cyan-600' }
            ].map((item, index) => {
              const isSelected = surveyData.primaryGoals.includes(item.goal);
              
              return (
                <motion.div
                  key={item.goal}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Selection Glow */}
                  {isSelected && (
                    <motion.div
                      className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-xl blur-md opacity-50`}
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  
                  <button
                    onClick={() => toggleArrayItem('primaryGoals', item.goal)}
                    className={`relative w-full p-4 rounded-xl font-bold text-center transition-all duration-300 border ${
                      isSelected
                        ? `bg-gradient-to-br ${item.gradient} border-transparent text-white shadow-lg`
                        : 'bg-gray-800/50 border-gray-600/30 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50 hover:text-white'
                    }`}
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-sm font-bold">{item.goal}</div>
                    
                    {/* Selection Check */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          className="absolute -top-2 -right-2"
                        >
                          <div className="bg-white text-green-600 rounded-full p-1 shadow-lg">
                            <Check size={12} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Premium Time Allocation */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-30" />
          <div className="relative bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
            <label className="flex items-center text-lg font-bold text-white mb-4">
              <Heart size={20} className="mr-2 text-blue-400" />
              Weekday Training
            </label>
            <div className="relative">
              <input
                type="number"
                value={surveyData.weekdayTime}
                onChange={(e) => updateData('weekdayTime', parseInt(e.target.value))}
                min={15}
                max={180}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white text-2xl font-bold rounded-lg px-4 py-3 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-sm font-medium">
                MIN
              </div>
            </div>
            <div className="mt-3 text-gray-400 text-sm">
              Monday through Friday sessions
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-30" />
          <div className="relative bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
            <label className="flex items-center text-lg font-bold text-white mb-4">
              <Star size={20} className="mr-2 text-purple-400" />
              Weekend Training
            </label>
            <div className="relative">
              <input
                type="number"
                value={surveyData.weekendTime}
                onChange={(e) => updateData('weekendTime', parseInt(e.target.value))}
                min={15}
                max={300}
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white text-2xl font-bold rounded-lg px-4 py-3 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-sm font-medium">
                MIN
              </div>
            </div>
            <div className="mt-3 text-gray-400 text-sm">
              Saturday and Sunday sessions
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderHealthAndNutrition = () => (
    <div className="space-y-8">
      {/* Premium Health Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur opacity-40" />
        <div className="relative bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Shield className="text-yellow-400 mr-4 mt-1" size={24} />
            </motion.div>
            <div>
              <h4 className="text-yellow-400 font-bold text-lg mb-2">Health & Safety First</h4>
              <p className="text-yellow-100/80 leading-relaxed">
                This information helps us create safer, more effective plans tailored specifically for you.
                All data is encrypted and used only for your personalized coaching experience.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Hormone Therapy Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-30" />
        <div className="relative bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
          <label className="flex items-center text-lg font-bold text-white mb-6">
            <Heart size={20} className="mr-2 text-pink-400" />
            Hormone Replacement Therapy
          </label>
          <div className="flex gap-4 mb-6">
            {[
              { value: true, label: 'YES', desc: 'Currently on HRT', gradient: 'from-green-500 to-emerald-600' },
              { value: false, label: 'NO', desc: 'Not on HRT', gradient: 'from-gray-600 to-gray-700' }
            ].map((option, index) => {
              const isSelected = surveyData.isOnHormoneReplacement === option.value;
              
              return (
                <motion.button
                  key={option.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateData('isOnHormoneReplacement', option.value)}
                  className={`flex-1 p-4 rounded-xl font-bold text-center transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/30'
                  }`}
                >
                  <div className="text-lg font-black">{option.label}</div>
                  <div className="text-xs opacity-80">{option.desc}</div>
                </motion.button>
              );
            })}
          </div>
          
          <AnimatePresence>
            {surveyData.isOnHormoneReplacement && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4">
                  <input
                    type="text"
                    value={surveyData.hormoneDetails}
                    onChange={(e) => updateData('hormoneDetails', e.target.value)}
                    placeholder="e.g., TRT, HRT, specific medications..."
                    className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-lg"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Premium Diet Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl blur opacity-30" />
        <div className="relative bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
          <label className="flex items-center text-lg font-bold text-white mb-4">
            <Utensils size={20} className="mr-2 text-green-400" />
            Current Diet Style
          </label>
          <div className="relative">
            <input
              type="text"
              value={surveyData.currentDiet}
              onChange={(e) => updateData('currentDiet', e.target.value)}
              placeholder="e.g., Mediterranean, Keto, Vegetarian, Standard..."
              className="w-full bg-gray-800/50 border border-gray-600/50 text-white text-lg rounded-lg px-4 py-3 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Sparkles size={16} className="text-green-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Dietary Restrictions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative"
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-40" />
        <div className="relative bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full font-black text-sm mb-4"
            >
              <AlertCircle size={20} className="mr-2" />
              DIETARY NEEDS
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-2">Restrictions & Allergies</h3>
            <p className="text-gray-400">Select any that apply to you</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { restriction: 'Gluten-Free', icon: '🌾', gradient: 'from-yellow-500 to-orange-600' },
              { restriction: 'Dairy-Free', icon: '🥛', gradient: 'from-blue-500 to-cyan-600' },
              { restriction: 'Nut Allergies', icon: '🥜', gradient: 'from-red-500 to-pink-600' },
              { restriction: 'Vegetarian', icon: '🥬', gradient: 'from-green-500 to-emerald-600' },
              { restriction: 'Vegan', icon: '🌱', gradient: 'from-green-600 to-teal-600' },
              { restriction: 'Shellfish Allergy', icon: '🦐', gradient: 'from-orange-500 to-red-600' },
              { restriction: 'Diabetic-Friendly', icon: '💉', gradient: 'from-purple-500 to-indigo-600' },
              { restriction: 'Other', icon: '⚠️', gradient: 'from-gray-500 to-gray-600' }
            ].map((item, index) => {
              const isSelected = surveyData.dietaryRestrictions.includes(item.restriction);
              
              return (
                <motion.div
                  key={item.restriction}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Selection Glow */}
                  {isSelected && (
                    <motion.div
                      className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-lg blur-sm opacity-60`}
                      animate={{ opacity: [0.6, 0.9, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  
                  <button
                    onClick={() => toggleArrayItem('dietaryRestrictions', item.restriction)}
                    className={`relative w-full p-3 rounded-lg font-bold text-center transition-all duration-300 border ${
                      isSelected
                        ? `bg-gradient-to-br ${item.gradient} border-transparent text-white shadow-lg`
                        : 'bg-gray-800/50 border-gray-600/30 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-bold">{item.restriction}</div>
                    
                    {/* Selection Check */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          className="absolute -top-1 -right-1"
                        >
                          <div className="bg-white text-green-600 rounded-full p-0.5 shadow-lg">
                            <Check size={10} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const steps = [
    {
      title: 'Basic Information',
      icon: User,
      component: renderBasicInfo,
    },
    {
      title: 'Goals & Preferences',
      icon: Target,
      component: renderGoalsAndPreferences,
    },
    {
      title: 'Health & Nutrition',
      icon: Utensils,
      component: renderHealthAndNutrition,
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/30 via-black to-orange-900/30" />
        <motion.div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-[800px] h-[800px] bg-gradient-radial from-orange-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -80, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        {/* Floating Particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Premium Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1 max-w-xs' : ''
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Step Glow Effect */}
                  {index <= currentStep && (
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-lg"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <div
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-500 ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-transparent text-black shadow-2xl'
                        : 'bg-gray-800/50 border-gray-600/50 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Crown size={24} />
                      </motion.div>
                    ) : (
                      <step.icon size={24} />
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
                  >
                    <div className={`text-sm font-bold whitespace-nowrap ${
                      index <= currentStep ? 'text-yellow-400' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </motion.div>
                </motion.div>
                
                {index < steps.length - 1 && (
                  <div className="flex-1 px-4">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index < currentStep ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full origin-left"
                    />
                    <div className={`h-1 rounded-full ${
                      index < currentStep ? 'opacity-0' : 'bg-gray-700/50'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Step Title */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-sm mb-6"
            >
              <Sparkles size={20} className="mr-2" />
              STEP {currentStep + 1} OF {steps.length}
            </motion.div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-400 to-orange-400 mb-4 leading-tight">
              {currentStepData.title}
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {currentStep === 0 && "Tell us about yourself to create your perfect fitness foundation"}
              {currentStep === 1 && "Define your ambitions and training preferences"}
              {currentStep === 2 && "Ensure safe, personalized nutrition and health planning"}
            </p>
          </motion.div>
        </motion.div>

        {/* Premium Content Container */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -50, rotateY: -10 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {currentStepData.component()}
        </motion.div>

        {/* Premium Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-between items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={prevStep}
              className="flex items-center bg-gray-800/50 hover:bg-gray-700/50 text-white font-bold px-8 py-4 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              {currentStep === 0 ? 'BACK' : 'PREVIOUS'}
            </button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            {currentStep === steps.length - 1 ? (
              <div>
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl opacity-80 group-hover:opacity-100 transition duration-300" />
                
                <button
                  onClick={nextStep}
                  className="relative flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black px-12 py-4 rounded-xl"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-3"
                  >
                    <Crown size={24} />
                  </motion.div>
                  COMPLETE SETUP
                  <Sparkles size={20} className="ml-3" />
                </button>
              </div>
            ) : (
              <div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500" />
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-80 group-hover:opacity-100 transition duration-300" />
                
                <button
                  onClick={nextStep}
                  className="relative flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-10 py-4 rounded-xl"
                >
                  CONTINUE
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-3"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}