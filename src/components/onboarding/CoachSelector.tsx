'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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

  const renderCoachCard = (coach: CoachPersona, index: number): JSX.Element => {
    const isSelected = selectedCoach === coach.id;
    const isHovered = hoveredCoach === coach.id;

    return (
      <motion.div
        key={coach.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onHoverStart={() => setHoveredCoach(coach.id)}
        onHoverEnd={() => setHoveredCoach(null)}
      >
        <Card
          className={`cursor-pointer transition-all duration-300 ${
            isSelected 
              ? 'ring-2 ring-indigo-500 shadow-xl' 
              : 'hover:shadow-xl'
          }`}
          onClick={() => onSelect(coach.id)}
          hover={false}
        >
          <div className="relative">
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-2 z-10"
              >
                <Check size={16} />
              </motion.div>
            )}

            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
              {/* Placeholder for coach image - will be replaced with Imagen 3 generated images */}
              <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-gray-400">
                {coach.name.split(' ')[0][0]}
              </div>
              
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                {coach.name}
              </h3>
              
              <p className="text-indigo-600 font-medium">
                {coach.specialty}
              </p>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {coach.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {coach.expertise.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your AI Coach
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the coaching style that resonates with you. Each coach will 
          personalize your experience based on your goals and preferences.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {COACH_PERSONAS.map((coach, index) => 
          renderCoachCard(coach, index)
        )}
      </div>

      <div className="text-center">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!selectedCoach}
          className="px-12"
        >
          Continue with Selected Coach
        </Button>
      </div>
    </div>
  );
}