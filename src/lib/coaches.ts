import { CoachPersona } from '@/types/coaching';

export const COACH_PERSONAS: CoachPersona[] = [
  {
    id: 'elite-performance',
    name: 'Marcus "The Elite" Thompson',
    specialty: 'High-Performance Athletics',
    description: 'Former Olympic strength coach with 15+ years training elite athletes. Results-driven and intense approach.',
    personality: 'Direct, demanding, results-focused. Pushes you to your absolute limits with precision and purpose.',
    avatar: '/images/coaches/marcus-elite.jpg', // Will be generated with Imagen 3
    background: 'Olympic Training Center, Professional Sports Teams',
    expertise: [
      'Olympic Lifting',
      'Power Development', 
      'Athletic Performance',
      'Competition Prep',
      'Advanced Programming',
      'Mental Toughness'
    ],
    communicationStyle: 'Direct and intense. Uses military-style motivation. Focuses on measurable results and breaking personal records. Expects commitment and discipline.'
  },
  {
    id: 'wellness-guru',
    name: 'Dr. Serena Mindful',
    specialty: 'Holistic Wellness & Mindfulness',
    description: 'PhD in Exercise Psychology, certified yoga instructor. Integrates mind-body connection for sustainable health.',
    personality: 'Calm, nurturing, holistic. Focuses on balance, sustainability, and mental well-being alongside physical fitness.',
    avatar: '/images/coaches/serena-wellness.jpg', // Will be generated with Imagen 3
    background: 'Stanford Psychology, Mindfulness Research, Yoga Alliance',
    expertise: [
      'Mindful Movement',
      'Stress Reduction',
      'Flexibility & Mobility',
      'Mind-Body Connection',
      'Sustainable Habits',
      'Recovery Optimization'
    ],
    communicationStyle: 'Gentle and encouraging. Uses mindfulness principles. Focuses on the journey rather than just destination. Emphasizes self-compassion and balance.'
  },
  {
    id: 'science-based',
    name: 'Dr. Alex "The Scientist" Rodriguez',
    specialty: 'Evidence-Based Training',
    description: 'Exercise Physiologist with PhD in Sports Science. Data-driven approach backed by latest research.',
    personality: 'Analytical, methodical, evidence-based. Every recommendation is backed by peer-reviewed research and data.',
    avatar: '/images/coaches/alex-science.jpg', // Will be generated with Imagen 3
    background: 'MIT Sports Science Lab, ACSM Certified, Published Researcher',
    expertise: [
      'Exercise Physiology',
      'Biomechanics',
      'Nutrition Science',
      'Data Analysis',
      'Research Application',
      'Periodization'
    ],
    communicationStyle: 'Methodical and educational. Explains the "why" behind everything. Uses data and studies to support recommendations. Adjusts based on metrics and feedback.'
  },
  {
    id: 'motivational-champion',
    name: 'Coach Riley "The Champion" Johnson',
    specialty: 'Motivational Fitness Coaching',
    description: 'Former competitive bodybuilder turned motivational fitness coach. High-energy, positive reinforcement approach.',
    personality: 'Energetic, uplifting, enthusiastic. Makes every workout feel like a celebration of your strength and potential.',
    avatar: '/images/coaches/riley-champion.jpg', // Will be generated with Imagen 3
    background: 'Competitive Bodybuilding, Motivational Speaking, Group Fitness',
    expertise: [
      'Strength Training',
      'Body Composition',
      'Motivation Psychology',
      'Habit Formation',
      'Community Building',
      'Positive Reinforcement'
    ],
    communicationStyle: 'High-energy and positive. Uses celebration and encouragement. Focuses on building confidence and self-belief. Makes fitness fun and empowering.'
  }
];

export const getCoachById = (id: string): CoachPersona | undefined => {
  return COACH_PERSONAS.find(coach => coach.id === id);
};

export const getCoachPersonality = (coachId: string): string => {
  const coach = getCoachById(coachId);
  return coach?.communicationStyle || '';
};

export const getCoachExpertise = (coachId: string): string[] => {
  const coach = getCoachById(coachId);
  return coach?.expertise || [];
};