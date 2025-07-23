'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Play, 
  Star,
  Shield,
  Zap,
  Brain,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

import { Button, Card } from '@/components/ui';
import { COACH_PERSONAS } from '@/lib/coaches';

const features = [
  {
    icon: Brain,
    title: 'AI Personal Coach',
    description: 'Get 24/7 access to your personalized AI fitness coach who adapts to your progress.',
    color: 'text-purple-600'
  },
  {
    icon: Sparkles,
    title: 'Custom Meal Plans',
    description: 'AI-generated meal plans tailored to your dietary needs and fitness goals.',
    color: 'text-green-600'
  },
  {
    icon: Zap,
    title: 'Smart Workouts',
    description: 'Dynamic workout plans that evolve with your strength and preferences.',
    color: 'text-blue-600'
  },
  {
    icon: Shield,
    title: 'Health-First Approach',
    description: 'Considers hormone therapy, medical conditions, and personal health factors.',
    color: 'text-red-600'
  }
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'CEO, Tech Startup',
    rating: 5,
    text: 'This is like having a world-class personal trainer in my pocket. The AI coach understands my schedule and adapts perfectly.',
    avatar: '/images/testimonials/sarah.jpg'
  },
  {
    name: 'Marcus T.',
    role: 'Professional Athlete',
    rating: 5,
    text: 'The level of personalization is incredible. It factors in my hormone therapy and creates plans that actually work with my body.',
    avatar: '/images/testimonials/marcus.jpg'
  },
  {
    name: 'Dr. Jennifer K.',
    role: 'Physician',
    rating: 5,
    text: 'Finally, a fitness app that takes medical conditions seriously. The health-first approach is revolutionary.',
    avatar: '/images/testimonials/jennifer.jpg'
  }
];

const pricing = {
  monthly: 29.99,
  annual: 299.99,
  savings: 60
};

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const renderHeroSection = (): JSX.Element => (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                <Sparkles size={16} className="mr-2" />
                Celebrity-Grade Fitness Experience
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your AI
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Fitness Coach
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
              Transform your body with personalized AI coaching that adapts to your 
              unique health profile, goals, and lifestyle. 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600">
                  Start Free Trial
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-lg px-8 text-white border-white/20 hover:bg-white/10"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play size={20} className="mr-2" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white/20"></div>
                  ))}
                </div>
                <span className="text-sm">10,000+ Members</span>
              </div>
              
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-sm">4.9/5 Rating</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              {/* Mock App Interface */}
              <div className="bg-gray-900 rounded-2xl p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-4"></div>
                  <div>
                    <div className="text-white font-semibold">Marcus "The Elite"</div>
                    <div className="text-gray-400 text-sm">Your AI Coach</div>
                  </div>
                </div>
                <div className="bg-indigo-600 text-white p-4 rounded-lg mb-3">
                  "Based on your hormone therapy and goals, I've created a specialized strength program. Ready to break some records?"
                </div>
                <div className="bg-gray-700 text-white p-4 rounded-lg">
                  "Yes! What's the plan for today?"
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <Trophy className="text-green-400 mx-auto mb-2" />
                  <div className="text-white text-sm font-medium">Goal Progress</div>
                  <div className="text-green-400 text-lg font-bold">87%</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                  <Zap className="text-blue-400 mx-auto mb-2" />
                  <div className="text-white text-sm font-medium">Streak</div>
                  <div className="text-blue-400 text-lg font-bold">12 days</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  const renderFeaturesSection = (): JSX.Element => (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Beyond Personal Training
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of fitness with AI coaching that understands your unique 
            health profile and adapts to your journey in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full group hover:shadow-2xl transition-all duration-300">
                  <div className={`${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderCoachShowcase = (): JSX.Element => (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Meet Your AI Coaches
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from four distinct coaching personalities, each designed to match 
            your preferred training style and motivation approach.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {COACH_PERSONAS.map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-6 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-gray-500">
                    {coach.name.split(' ')[0][0]}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {coach.name}
                </h3>
                <p className="text-indigo-600 font-medium mb-3">
                  {coach.specialty}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {coach.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {coach.expertise.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderPricingSection = (): JSX.Element => (
    <section className="py-24 bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Investment in Your Future
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Less than the cost of a single personal training session per month. 
            Cancel anytime.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      selectedPlan === 'monthly' 
                        ? 'bg-white text-gray-900' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedPlan('annual')}
                    className={`px-6 py-2 rounded-md transition-colors relative ${
                      selectedPlan === 'annual' 
                        ? 'bg-white text-gray-900' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Annual
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                      Save ${pricing.savings}
                    </span>
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-6xl font-bold mb-2">
                  ${selectedPlan === 'monthly' ? pricing.monthly : (pricing.annual / 12).toFixed(2)}
                  <span className="text-2xl text-blue-200">/month</span>
                </div>
                {selectedPlan === 'annual' && (
                  <div className="text-blue-200">
                    Billed annually at ${pricing.annual}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  'Unlimited AI Coach Access',
                  'Personalized Workout Plans',
                  'Custom Meal Planning',
                  'Health Condition Support',
                  'Progress Tracking',
                  '24/7 Chat Support',
                  'Weekly Program Updates',
                  'Premium Content Library'
                ].map((feature) => (
                  <div key={feature} className="flex items-center">
                    <CheckCircle size={20} className="text-green-400 mr-3" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth">
                <Button 
                  size="lg" 
                  className="text-lg px-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600"
                >
                  Start 7-Day Free Trial
                </Button>
              </Link>
              
              <p className="text-sm text-blue-200 mt-4">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      {renderHeroSection()}
      {renderFeaturesSection()}
      {renderCoachShowcase()}
      {renderPricingSection()}
    </div>
  );
}