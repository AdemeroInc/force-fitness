'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Target, 
  Utensils, 
  AlertCircle,
  Check 
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

  const renderBasicInfo = (): JSX.Element => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          type="number"
          label="Age"
          value={surveyData.age}
          onChange={(e) => updateData('age', parseInt(e.target.value))}
          min={13}
          max={120}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex gap-3">
            {['male', 'female', 'other'].map((gender) => (
              <button
                key={gender}
                onClick={() => updateData('gender', gender)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  surveyData.gender === gender
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Fitness Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'beginner', label: 'Beginner', desc: 'New to fitness' },
            { value: 'intermediate', label: 'Intermediate', desc: '6+ months experience' },
            { value: 'advanced', label: 'Advanced', desc: '2+ years experience' }
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => updateData('fitnessLevel', level.value)}
              className={`p-4 rounded-lg text-center transition-colors ${
                surveyData.fitnessLevel === level.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{level.label}</div>
              <div className="text-sm opacity-75">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoalsAndPreferences = (): JSX.Element => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Primary Fitness Goals (select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Weight Loss', 'Muscle Gain', 'Strength Building', 'Endurance',
            'Flexibility', 'General Health', 'Competition Prep', 'Rehabilitation'
          ].map((goal) => (
            <button
              key={goal}
              onClick={() => toggleArrayItem('primaryGoals', goal)}
              className={`p-3 rounded-lg text-left transition-colors ${
                surveyData.primaryGoals.includes(goal)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          type="number"
          label="Weekday Workout Time (minutes)"
          value={surveyData.weekdayTime}
          onChange={(e) => updateData('weekdayTime', parseInt(e.target.value))}
          min={15}
          max={180}
        />
        
        <Input
          type="number"
          label="Weekend Workout Time (minutes)"
          value={surveyData.weekendTime}
          onChange={(e) => updateData('weekendTime', parseInt(e.target.value))}
          min={15}
          max={300}
        />
      </div>
    </div>
  );

  const renderHealthAndNutrition = (): JSX.Element => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-600 mr-3 mt-0.5" size={20} />
          <div className="text-sm text-yellow-800">
            This information helps us create safer, more effective plans for you.
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Are you currently on hormone replacement therapy?
        </label>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => updateData('isOnHormoneReplacement', true)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              surveyData.isOnHormoneReplacement
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => updateData('isOnHormoneReplacement', false)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              !surveyData.isOnHormoneReplacement
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            No
          </button>
        </div>
        
        {surveyData.isOnHormoneReplacement && (
          <Input
            label="Hormone Therapy Details (optional)"
            value={surveyData.hormoneDetails}
            onChange={(e) => updateData('hormoneDetails', e.target.value)}
            placeholder="e.g., TRT, HRT, specific medications..."
          />
        )}
      </div>

      <Input
        label="Current Diet/Eating Style"
        value={surveyData.currentDiet}
        onChange={(e) => updateData('currentDiet', e.target.value)}
        placeholder="e.g., Mediterranean, Keto, Vegetarian, Standard..."
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dietary Restrictions or Allergies
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            'Gluten-Free', 'Dairy-Free', 'Nut Allergies', 'Vegetarian',
            'Vegan', 'Shellfish Allergy', 'Diabetic-Friendly', 'Other'
          ].map((restriction) => (
            <button
              key={restriction}
              onClick={() => toggleArrayItem('dietaryRestrictions', restriction)}
              className={`p-2 rounded-lg text-sm transition-colors ${
                surveyData.dietaryRestrictions.includes(restriction)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {restriction}
            </button>
          ))}
        </div>
      </div>
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <Check size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentStepData.component()}
        </motion.div>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={prevStep}
        >
          Back
        </Button>
        
        <Button
          onClick={nextStep}
        >
          {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
        </Button>
      </div>
    </div>
  );
}