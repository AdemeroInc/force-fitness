import OpenAI from 'openai';
import { UserProfile, ChatMessage, WorkoutPlan, MealPlan } from '@/types/coaching';
import { getCoachPersonality, getCoachExpertise } from './coaches';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AICoachingService {
  private static instance: AICoachingService;
  
  public static getInstance(): AICoachingService {
    if (!AICoachingService.instance) {
      AICoachingService.instance = new AICoachingService();
    }
    return AICoachingService.instance;
  }

  async generateResponse(
    userMessage: string,
    userProfile: UserProfile,
    chatHistory: ChatMessage[]
  ): Promise<string> {
    const coachPersonality = getCoachPersonality(userProfile.selectedCoach);
    const expertise = getCoachExpertise(userProfile.selectedCoach);
    
    const systemPrompt = this.buildSystemPrompt(userProfile, coachPersonality, expertise);
    const conversationHistory = this.formatChatHistory(chatHistory);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'I apologize, but I had trouble processing your message. Could you please try again?';
    } catch (error) {
      console.error('AI Coaching Service Error:', error);
      throw new Error('Unable to generate coach response');
    }
  }

  async generateWorkoutPlan(userProfile: UserProfile): Promise<WorkoutPlan> {
    const coachPersonality = getCoachPersonality(userProfile.selectedCoach);
    const expertise = getCoachExpertise(userProfile.selectedCoach);

    const prompt = `
      Create a personalized workout plan for this user profile:
      
      User Details:
      - Age: ${userProfile.age}
      - Fitness Level: ${userProfile.fitnessLevel}
      - Goals: ${userProfile.primaryGoals.join(', ')}
      - Available Time: ${userProfile.timeAvailability.weekdays} min/weekday, ${userProfile.timeAvailability.weekends} min/weekend
      - Equipment: ${userProfile.availableEquipment.join(', ')}
      - Medical Conditions: ${userProfile.medicalConditions.join(', ')}
      - Hormone Replacement: ${userProfile.isOnHormoneReplacement ? 'Yes' : 'No'}
      
      Coach Style: ${coachPersonality}
      Expertise: ${expertise.join(', ')}
      
      Return a detailed workout plan in JSON format with exercises, sets, reps, and coaching notes.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.6,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return this.parseWorkoutPlan(content, userProfile);
      }
      
      throw new Error('No workout plan generated');
    } catch (error) {
      console.error('Workout Plan Generation Error:', error);
      throw new Error('Unable to generate workout plan');
    }
  }

  async generateMealPlan(userProfile: UserProfile): Promise<MealPlan> {
    const coachPersonality = getCoachPersonality(userProfile.selectedCoach);

    const prompt = `
      Create a personalized meal plan for this user profile:
      
      User Details:
      - Age: ${userProfile.age}
      - Goals: ${userProfile.primaryGoals.join(', ')}
      - Current Diet: ${userProfile.currentDiet}
      - Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}
      - Allergies: ${userProfile.allergies.join(', ')}
      - Hormone Replacement: ${userProfile.isOnHormoneReplacement ? 'Yes' : 'No'}
      - Activity Level: ${userProfile.activityLevel}
      
      Coach Style: ${coachPersonality}
      
      Return a detailed meal plan in JSON format with recipes, macros, and shopping list.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500,
        temperature: 0.6,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return this.parseMealPlan(content, userProfile);
      }
      
      throw new Error('No meal plan generated');
    } catch (error) {
      console.error('Meal Plan Generation Error:', error);
      throw new Error('Unable to generate meal plan');
    }
  }

  private buildSystemPrompt(
    userProfile: UserProfile, 
    coachPersonality: string, 
    expertise: string[]
  ): string {
    return `
      You are an AI fitness coach with the following personality and expertise:
      
      PERSONALITY: ${coachPersonality}
      
      EXPERTISE: ${expertise.join(', ')}
      
      USER PROFILE:
      - Age: ${userProfile.age}
      - Fitness Level: ${userProfile.fitnessLevel}
      - Primary Goals: ${userProfile.primaryGoals.join(', ')}
      - Medical Conditions: ${userProfile.medicalConditions.join(', ')} 
      - Hormone Replacement: ${userProfile.isOnHormoneReplacement ? 'Yes - ' + userProfile.hormoneDetails : 'No'}
      - Current Diet: ${userProfile.currentDiet}
      - Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}
      - Allergies: ${userProfile.allergies.join(', ')}
      
      INSTRUCTIONS:
      - Stay in character with your assigned personality
      - Provide personalized advice based on the user's profile
      - Consider their medical conditions and hormone status in all recommendations
      - Be supportive but maintain your coaching style
      - Ask clarifying questions when needed
      - Provide actionable, specific advice
      - Remember previous conversations to build rapport
    `;
  }

  private formatChatHistory(chatHistory: ChatMessage[]): Array<{role: 'user' | 'assistant', content: string}> {
    return chatHistory.slice(-10).map(msg => ({
      role: msg.role === 'coach' ? 'assistant' : 'user',
      content: msg.content
    }));
  }

  private parseWorkoutPlan(content: string, userProfile: UserProfile): WorkoutPlan {
    // This would parse the AI response and create a structured WorkoutPlan
    // For now, returning a basic structure - would enhance based on AI response format
    return {
      id: `workout-${Date.now()}`,
      userId: userProfile.userId,
      coachId: userProfile.selectedCoach,
      title: 'AI Generated Workout',
      description: 'Personalized workout plan from your AI coach',
      duration: 45,
      difficulty: userProfile.fitnessLevel as 'easy' | 'medium' | 'hard',
      targetMuscleGroups: ['full-body'],
      exercises: [],
      restPeriods: [60, 90, 120],
      notes: content,
      createdAt: new Date(),
    };
  }

  private parseMealPlan(content: string, userProfile: UserProfile): MealPlan {
    // This would parse the AI response and create a structured MealPlan
    // For now, returning a basic structure - would enhance based on AI response format
    return {
      id: `meal-${Date.now()}`,
      userId: userProfile.userId,
      coachId: userProfile.selectedCoach,
      title: 'AI Generated Meal Plan',
      description: 'Personalized meal plan from your AI coach',
      targetCalories: 2000,
      macroBreakdown: { protein: 150, carbs: 200, fat: 80 },
      meals: [],
      shoppingList: [],
      prepTime: 60,
      createdAt: new Date(),
      scheduledFor: new Date(),
    };
  }
}