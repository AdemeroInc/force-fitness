'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Target,
  Users,
  Heart
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import CoachSelector from '@/components/onboarding/CoachSelector';
import ProfileSurvey from '@/components/onboarding/ProfileSurvey';
import { PageTransition } from '@/components/ui';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Onboarding steps configuration
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Force Fitness',
    subtitle: 'Your Journey to Greatness Begins Here',
    icon: Crown,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'coach-selection',
    title: 'Choose Your AI Mentor',
    subtitle: 'Select the coaching style that resonates with you',
    icon: Users,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'profile-survey',
    title: 'Tell Us About Yourself',
    subtitle: 'Personalize your fitness experience',
    icon: Heart,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'completion',
    title: 'Ready to Transform',
    subtitle: 'Your personalized experience is ready',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500'
  }
];

interface OnboardingData {
  selectedCoach: string | null;
  surveyData: Partial<UserProfile>;
  completedAt?: Date;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedCoach: null,
    surveyData: null
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('onboarding-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setOnboardingData(parsed.data || onboardingData);
        setCurrentStep(parsed.step || 0);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (step: number, data: OnboardingData) => {
    localStorage.setItem('onboarding-progress', JSON.stringify({
      step,
      data,
      timestamp: Date.now()
    }));
  };

  // Handle coach selection
  const handleCoachSelect = (coachId: string) => {
    const updatedData = { ...onboardingData, selectedCoach: coachId };
    setOnboardingData(updatedData);
    saveProgress(currentStep, updatedData);
  };

  // Handle moving to next step
  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveProgress(newStep, onboardingData);
    }
  };

  // Handle moving to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveProgress(newStep, onboardingData);
    }
  };

  // Handle survey completion
  const handleSurveyComplete = (surveyData: Partial<UserProfile>) => {
    const updatedData = { ...onboardingData, surveyData };
    setOnboardingData(updatedData);
    saveProgress(currentStep + 1, updatedData);
    setCurrentStep(currentStep + 1);
  };

  // Complete onboarding and save to Firebase
  const handleCompleteOnboarding = async () => {
    if (!user || !onboardingData.selectedCoach || !onboardingData.surveyData) {
      console.error('Missing required onboarding data');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create user profile in Firestore
      const userProfile = {
        userId: user.uid,
        email: user.email,
        selectedCoach: onboardingData.selectedCoach,
        age: onboardingData.surveyData.age,
        gender: onboardingData.surveyData.gender,
        fitnessLevel: onboardingData.surveyData.fitnessLevel,
        primaryGoals: onboardingData.surveyData.primaryGoals,
        dietaryRestrictions: onboardingData.surveyData.dietaryRestrictions,
        allergies: onboardingData.surveyData.allergies,
        medicalConditions: onboardingData.surveyData.medicalConditions,
        isOnHormoneReplacement: onboardingData.surveyData.isOnHormoneReplacement,
        hormoneDetails: onboardingData.surveyData.hormoneDetails,
        currentDiet: onboardingData.surveyData.currentDiet,
        activityLevel: onboardingData.surveyData.activityLevel,
        availableEquipment: onboardingData.surveyData.availableEquipment,
        workoutPreferences: onboardingData.surveyData.workoutPreferences,
        timeAvailability: {
          weekdays: onboardingData.surveyData.weekdayTime,
          weekends: onboardingData.surveyData.weekendTime
        },
        onboardingCompletedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      // Clear saved progress
      localStorage.removeItem('onboarding-progress');

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {ONBOARDING_STEPS.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: isCurrent ? 1.2 : isCompleted ? 1 : 0.8,
                opacity: isCurrent ? 1 : isCompleted ? 0.8 : 0.5
              }}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 text-white'
                  : isCurrent
                    ? `bg-gradient-to-r ${step.color} border-yellow-400 text-white`
                    : 'border-gray-600 text-gray-500'
              }`}
            >
              {isCompleted ? (
                <CheckCircle size={20} />
              ) : (
                <StepIcon size={20} />
              )}
              
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-yellow-400"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            {index < ONBOARDING_STEPS.length - 1 && (
              <motion.div
                className={`w-16 h-1 mx-2 rounded ${
                  isCompleted ? 'bg-green-400' : 'bg-gray-600'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // Welcome step component
  const WelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="text-center max-w-4xl mx-auto"
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <Crown size={80} className="mx-auto text-yellow-400" />
      </motion.div>
      
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-6">
        WELCOME TO FORCE FITNESS
      </h1>
      
      <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
        The world&apos;s most advanced AI-powered fitness coaching platform designed for 
        <span className="text-yellow-400 font-bold"> artists, celebrities, and high-achievers</span> who demand excellence.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {[
          { icon: Users, title: "Elite AI Coaches", desc: "4 distinct coaching personalities" },
          { icon: Target, title: "Personalized Plans", desc: "Tailored to your unique lifestyle" },
          { icon: Star, title: "Premium Experience", desc: "Celebrity-grade fitness coaching" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.2 }}
            className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-2xl p-6"
          >
            <feature.icon size={40} className="mx-auto mb-4 text-yellow-400" />
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xl px-12 py-4 rounded-full flex items-center mx-auto group"
      >
        <Sparkles size={24} className="mr-3" />
        BEGIN YOUR TRANSFORMATION
        <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );

  // Completion step component
  const CompletionStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center max-w-4xl mx-auto"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-8"
      >
        <CheckCircle size={100} className="mx-auto text-green-400" />
      </motion.div>
      
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-6">
        YOU&apos;RE ALL SET!
      </h1>
      
      <p className="text-xl text-gray-300 mb-8">
        Your personalized Force Fitness experience is ready. Your AI coach 
        <span className="text-yellow-400 font-bold"> {onboardingData.selectedCoach}</span> is 
        excited to begin your transformation journey.
      </p>
      
      <div className="bg-gray-900/50 backdrop-blur border border-green-500/30 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-white mb-4">What happens next?</h3>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="flex items-start space-x-3">
            <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white">Personalized Dashboard</h4>
              <p className="text-gray-400 text-sm">Access your custom fitness hub</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white">AI Coach Chat</h4>
              <p className="text-gray-400 text-sm">Start conversations with your mentor</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white">Custom Workouts</h4>
              <p className="text-gray-400 text-sm">Receive tailored fitness plans</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white">Progress Tracking</h4>
              <p className="text-gray-400 text-sm">Monitor your transformation</p>
            </div>
          </div>
        </div>
      </div>
      
      <motion.button
        onClick={handleCompleteOnboarding}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-black text-xl px-12 py-4 rounded-full flex items-center mx-auto group disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Sparkles size={24} />
            </motion.div>
            SETTING UP YOUR EXPERIENCE...
          </>
        ) : (
          <>
            <Crown size={24} className="mr-3" />
            ENTER FORCE FITNESS
            <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
    </motion.div>
  );

  // Navigation controls
  const NavigationControls = () => {
    if (currentStep === 0 || currentStep === ONBOARDING_STEPS.length - 1) {
      return null;
    }

    return (
      <div className="flex justify-between items-center mt-12">
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-full border border-gray-600 hover:border-gray-500 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </motion.button>

        {currentStep === 1 && onboardingData.selectedCoach && (
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full"
          >
            Continue
            <ArrowRight size={20} className="ml-2" />
          </motion.button>
        )}
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20" />
          
          {/* Animated Background Orbs */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-96 h-96 rounded-full blur-3xl opacity-10 ${
                i % 2 === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress Indicator */}
            <ProgressIndicator />

            {/* Step Title */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                {ONBOARDING_STEPS[currentStep].title}
              </h2>
              <p className="text-gray-400 text-lg">
                {ONBOARDING_STEPS[currentStep].subtitle}
              </p>
            </motion.div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {currentStep === 0 && <WelcomeStep />}
              
              {currentStep === 1 && (
                <motion.div
                  key="coach-selector"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <CoachSelector
                    selectedCoach={onboardingData.selectedCoach}
                    onSelect={handleCoachSelect}
                    onNext={handleNext}
                  />
                </motion.div>
              )}
              
              {currentStep === 2 && (
                <motion.div
                  key="profile-survey"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <ProfileSurvey
                    onComplete={handleSurveyComplete}
                    onBack={handleBack}
                  />
                </motion.div>
              )}
              
              {currentStep === 3 && <CompletionStep />}
            </AnimatePresence>

            {/* Navigation Controls */}
            <NavigationControls />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}