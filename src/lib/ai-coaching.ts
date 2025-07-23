// import OpenAI from 'openai';
import { UserProfile, ChatMessage, WorkoutPlan, MealPlan } from '@/types/coaching';
import { getCoachPersonality, getCoachExpertise, getCoachById } from './coaches';
import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';

// Initialize OpenAI with fallback for development
// TODO: Replace with Gemini API
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || 'demo-key',
// });

// Rate limiting and token tracking
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

interface ConversationContext {
  userId: string;
  coachId: string;
  sessionStart: Date;
  messageCount: number;
  totalTokens: number;
  totalCost: number;
}

export class AICoachingService {
  private static instance: AICoachingService;
  private conversationContexts: Map<string, ConversationContext> = new Map();
  private rateLimitTracker: Map<string, { count: number; resetTime: number }> = new Map();
  
  // Rate limits per user per hour
  private static readonly RATE_LIMIT_PER_HOUR = 50;
  private static readonly TOKEN_COST_PER_1K = 0.03; // Approximate GPT-4 cost
  
  public static getInstance(): AICoachingService {
    if (!AICoachingService.instance) {
      AICoachingService.instance = new AICoachingService();
    }
    return AICoachingService.instance;
  }

  async generateStreamingResponse(
    userMessage: string,
    userProfile: UserProfile,
    chatHistory: ChatMessage[] = []
  ): Promise<AsyncIterable<string>> {
    // Check rate limits
    if (!this.checkRateLimit(userProfile.userId)) {
      throw new Error('Rate limit exceeded. Please wait before sending another message.');
    }

    // Mock streaming response if no API key (for development)
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      return this.generateMockStreamingResponse(userMessage, userProfile);
    }

    const coach = getCoachById(userProfile.selectedCoach);
    if (!coach) {
      throw new Error('Coach not found');
    }

    const systemPrompt = this.buildEnhancedSystemPrompt(userProfile, coach);
    const conversationHistory = this.formatChatHistory(chatHistory);

    try {
      // TODO: Replace with Gemini API
      throw new Error('AI coaching temporarily disabled - switching to Gemini');
      /*const stream = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.3,
        frequency_penalty: 0.3,
        stream: true,
      });

      return this.processStreamingResponse(stream, userProfile, userMessage);*/
    } catch (error) {
      console.error('AI Coaching Service Error:', error);
      throw error;
    }
  }

  async generateResponse(
    userMessage: string,
    userProfile: UserProfile,
    chatHistory: ChatMessage[] = []
  ): Promise<string> {
    // Check rate limits
    if (!this.checkRateLimit(userProfile.userId)) {
      throw new Error('Rate limit exceeded. Please wait before sending another message.');
    }

    // Mock response if no API key (for development)
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      return this.generateMockResponse(userMessage, userProfile);
    }

    const coach = getCoachById(userProfile.selectedCoach);
    if (!coach) {
      throw new Error('Coach not found');
    }

    const systemPrompt = this.buildEnhancedSystemPrompt(userProfile, coach);
    const conversationHistory = this.formatChatHistory(chatHistory);

    try {
      // TODO: Replace with Gemini API
      throw new Error('AI coaching temporarily disabled - switching to Gemini');
      /*const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.3,
        frequency_penalty: 0.3,
      });

      const aiResponse = response.choices[0]?.message?.content || 
        'I apologize, but I had trouble processing your message. Could you please try again?';

      // Track token usage and cost
      const tokenUsage: TokenUsage = {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
        cost: ((response.usage?.total_tokens || 0) / 1000) * AICoachingService.TOKEN_COST_PER_1K
      };

      // Update conversation context
      this.updateConversationContext(userProfile.userId, userProfile.selectedCoach, tokenUsage);

      // Persist messages to Firebase
      await this.persistMessages(userProfile.userId, userProfile.selectedCoach, userMessage, aiResponse);

      // Log analytics
      await this.logConversationAnalytics(userProfile.userId, userProfile.selectedCoach, tokenUsage);

      return aiResponse;*/

    } catch (error) {
      console.error('AI Coaching Service Error:', error);
      
      // Return fallback response based on coach personality
      return this.getFallbackResponse(userProfile.selectedCoach, error);
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
      // TODO: Replace with Gemini API
      throw new Error('AI coaching temporarily disabled - switching to Gemini');
      /*const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.6,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return this.parseWorkoutPlan(content, userProfile);
      }
      
      throw new Error('No workout plan generated');*/
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
      // TODO: Replace with Gemini API
      throw new Error('AI coaching temporarily disabled - switching to Gemini');
      /*const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500,
        temperature: 0.6,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return this.parseMealPlan(content, userProfile);
      }
      
      throw new Error('No meal plan generated');*/
    } catch (error) {
      console.error('Meal Plan Generation Error:', error);
      throw new Error('Unable to generate meal plan');
    }
  }

  // Rate limiting check
  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimitTracker.get(userId);
    
    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimitTracker.set(userId, {
        count: 1,
        resetTime: now + (60 * 60 * 1000) // Reset in 1 hour
      });
      return true;
    }
    
    if (userLimit.count >= AICoachingService.RATE_LIMIT_PER_HOUR) {
      return false;
    }
    
    userLimit.count++;
    return true;
  }

  // Generate mock responses for development
  private generateMockResponse(userMessage: string, userProfile: UserProfile): string {
    const coach = getCoachById(userProfile.selectedCoach);
    const coachName = coach?.name.split(' ')[0] || 'Coach';
    
    const mockResponses = {
      marcus: [
        `${coachName} here! I see you're ready to push your limits. That's what I want to hear! Let me design something that will challenge every fiber of your being.`,
        `Listen up! Your goals are ambitious, and that's exactly what separates champions from the rest. I'm going to help you unlock your true potential.`,
        `Time to get serious! Based on your profile, I can see you have what it takes. Let's build a plan that matches your warrior spirit.`
      ],
      serena: [
        `Hello! I'm Dr. Serena, and I'm so excited to be part of your wellness journey. Let's approach this holistically, considering both your body and mind.`,
        `What a beautiful question! I believe in creating sustainable, mindful approaches to fitness that honor your whole being. Let's explore this together.`,
        `I love your mindset! Remember, transformation is a journey, not a destination. Let's create something that nourishes your spirit as well as your body.`
      ],
      alex: [
        `Great question! As your science-based coach, I want to give you evidence-backed strategies that align with the latest research in exercise physiology.`,
        `Let me analyze your profile data... Based on current studies, I can recommend an approach that's optimized for your specific biomarkers and goals.`,
        `Excellent! The research shows that personalized programming based on your metrics will yield the best results. Let's dive into the data.`
      ],
      riley: [
        `Hey there, champion! 🌟 Coach Riley here, and I am SO pumped to work with you! Your energy is already infectious, and we're going to do amazing things together!`,
        `This is INCREDIBLE! I love your enthusiasm and commitment. You're already showing the mindset of a true champion. Let's celebrate every step of this journey!`,
        `YES! That's the spirit I want to see! You're going to absolutely crush your goals, and I'll be here cheering you on every step of the way!`
      ]
    };

    const responses = mockResponses[userProfile.selectedCoach as keyof typeof mockResponses] || mockResponses.riley;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Enhanced system prompt with better coach characterization
  private buildEnhancedSystemPrompt(userProfile: UserProfile, coach: any): string {
    return `
      You are ${coach.name}, an elite AI fitness coach. 
      
      COACH IDENTITY:
      - Name: ${coach.name}
      - Specialty: ${coach.specialty}
      - Background: ${coach.background}
      - Communication Style: ${coach.communicationStyle}
      - Personality: ${coach.personality}
      - Expertise: ${coach.expertise.join(', ')}
      
      USER PROFILE:
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Fitness Level: ${userProfile.fitnessLevel}
      - Primary Goals: ${userProfile.primaryGoals.join(', ')}
      - Medical Conditions: ${userProfile.medicalConditions.length > 0 ? userProfile.medicalConditions.join(', ') : 'None reported'}
      - Hormone Replacement: ${userProfile.isOnHormoneReplacement ? 'Yes - ' + (userProfile.hormoneDetails || 'Details not specified') : 'No'}
      - Current Diet: ${userProfile.currentDiet || 'Not specified'}
      - Dietary Restrictions: ${userProfile.dietaryRestrictions.length > 0 ? userProfile.dietaryRestrictions.join(', ') : 'None'}
      - Allergies: ${userProfile.allergies.length > 0 ? userProfile.allergies.join(', ') : 'None'}
      - Activity Level: ${userProfile.activityLevel || 'Not specified'}
      - Available Time: ${userProfile.timeAvailability?.weekdays || 30} min/weekday, ${userProfile.timeAvailability?.weekends || 60} min/weekend
      - Equipment: ${userProfile.availableEquipment.length > 0 ? userProfile.availableEquipment.join(', ') : 'None specified'}
      
      COACHING GUIDELINES:
      - ALWAYS stay in character as ${coach.name}
      - Use your specific communication style and personality
      - Provide personalized advice based on the user's complete profile
      - NEVER ignore medical conditions or hormone replacement therapy in recommendations
      - Be supportive while maintaining your unique coaching approach
      - Ask clarifying questions when you need more information
      - Provide specific, actionable advice
      - Build rapport and remember the conversation context
      - Consider their artistic/celebrity lifestyle if mentioned
      - Adapt recommendations for their available time and equipment
      - Always prioritize safety and health over rapid results
    `;
  }

  // Update conversation context for analytics
  private updateConversationContext(userId: string, coachId: string, tokenUsage: TokenUsage): void {
    const contextKey = `${userId}-${coachId}`;
    const existing = this.conversationContexts.get(contextKey);
    
    if (existing) {
      existing.messageCount++;
      existing.totalTokens += tokenUsage.totalTokens;
      existing.totalCost += tokenUsage.cost;
    } else {
      this.conversationContexts.set(contextKey, {
        userId,
        coachId,
        sessionStart: new Date(),
        messageCount: 1,
        totalTokens: tokenUsage.totalTokens,
        totalCost: tokenUsage.cost
      });
    }
  }

  // Persist messages to Firebase
  private async persistMessages(userId: string, coachId: string, userMessage: string, aiResponse: string): Promise<void> {
    try {
      const conversationId = `${userId}-${coachId}`;
      
      // Save user message
      await addDoc(collection(db, 'messages'), {
        conversationId,
        userId,
        coachId,
        content: userMessage,
        role: 'user',
        timestamp: serverTimestamp(),
        messageType: 'text'
      });

      // Save AI response
      await addDoc(collection(db, 'messages'), {
        conversationId,
        userId,
        coachId,
        content: aiResponse,
        role: 'coach',
        timestamp: serverTimestamp(),
        messageType: 'text'
      });
      
    } catch (error) {
      console.error('Error persisting messages:', error);
      // Don't throw - message persistence failure shouldn't break the chat
    }
  }

  // Log conversation analytics
  private async logConversationAnalytics(userId: string, coachId: string, tokenUsage: TokenUsage): Promise<void> {
    try {
      await addDoc(collection(db, 'analytics'), {
        type: 'ai_conversation',
        userId,
        coachId,
        timestamp: serverTimestamp(),
        tokenUsage,
        cost: tokenUsage.cost,
        model: 'gpt-4-turbo-preview'
      });
    } catch (error) {
      console.error('Error logging analytics:', error);
      // Don't throw - analytics failure shouldn't break the chat
    }
  }

  // Get fallback response for errors
  private getFallbackResponse(coachId: string, error: any): string {
    const coach = getCoachById(coachId);
    const coachName = coach?.name.split(' ')[0] || 'Coach';
    
    const fallbackResponses = {
      marcus: `${coachName} here. I'm experiencing some technical difficulties, but that won't stop us! Give me a moment to regroup, and we'll get back to crushing your goals. Stay strong!`,
      serena: `Hi there! I'm having a small technical moment, but these things happen on our wellness journey. Let's take a deep breath, and I'll be right back with you. Patience is part of the process.`,
      alex: `Interesting! I'm encountering some system latency, which gives us a perfect opportunity to discuss the importance of patience in achieving optimal results. I'll be back online shortly with data-driven insights.`,
      riley: `Hey champion! Even coaches need a timeout sometimes! 😊 I'm having a quick technical moment, but don't worry - your energy is still amazing and I'll be right back to celebrate your progress!`
    };

    return fallbackResponses[coachId as keyof typeof fallbackResponses] || fallbackResponses.riley;
  }

  // Get conversation history from Firebase
  async getConversationHistory(userId: string, coachId: string, limit = 10): Promise<ChatMessage[]> {
    try {
      const conversationId = `${userId}-${coachId}`;
      const messagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'desc'),
        limit(limit * 2) // Get more to account for user + AI pairs
      );

      const snapshot = await getDocs(messagesQuery);
      const messages: ChatMessage[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          userId: data.userId,
          coachId: data.coachId,
          content: data.content,
          role: data.role,
          timestamp: data.timestamp?.toDate() || new Date(),
          messageType: data.messageType || 'text',
          metadata: data.metadata
        });
      });

      // Return in chronological order (oldest first)
      return messages.reverse().slice(-limit);
      
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }

  private buildSystemPrompt(
    userProfile: UserProfile, 
    coachPersonality: string, 
    expertise: string[]
  ): string {
    // Legacy method - keeping for compatibility
    return this.buildEnhancedSystemPrompt(userProfile, { 
      name: 'AI Coach', 
      communicationStyle: coachPersonality, 
      expertise 
    });
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

  // Process streaming response from OpenAI
  private async *processStreamingResponse(
    stream: AsyncIterable<any>,
    userProfile: UserProfile,
    userMessage: string
  ): AsyncIterable<string> {
    let fullResponse = '';
    let totalTokens = 0;

    try {
      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          yield content;
        }

        // Track usage if available
        if (chunk.usage) {
          totalTokens = chunk.usage.total_tokens;
        }
      }

      // Final processing after stream completion
      const tokenUsage: TokenUsage = {
        promptTokens: 0, // Not available in streaming
        completionTokens: 0, // Not available in streaming
        totalTokens,
        cost: (totalTokens / 1000) * AICoachingService.TOKEN_COST_PER_1K
      };

      // Update conversation context
      this.updateConversationContext(userProfile.userId, userProfile.selectedCoach, tokenUsage);

      // Persist messages to Firebase
      await this.persistMessages(userProfile.userId, userProfile.selectedCoach, userMessage, fullResponse);

      // Log analytics
      await this.logConversationAnalytics(userProfile.userId, userProfile.selectedCoach, tokenUsage);

    } catch (error) {
      console.error('Error processing streaming response:', error);
      throw error;
    }
  }

  // Generate mock streaming response for development
  private async *generateMockStreamingResponse(
    userMessage: string,
    userProfile: UserProfile
  ): AsyncIterable<string> {
    const fullResponse = this.generateMockResponse(userMessage, userProfile);
    const words = fullResponse.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const chunk = i === 0 ? words[i] : ' ' + words[i];
      yield chunk;
      
      // Simulate realistic typing speed
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
  }
}