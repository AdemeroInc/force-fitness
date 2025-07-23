// Simple test script to verify AI coaching functionality
const { AICoachingService } = require('./src/lib/ai-coaching.ts');

async function testAICoaching() {
  try {
    console.log('🧪 Testing AI Coaching Service...');
    
    const coachingService = AICoachingService.getInstance();
    
    const testUserProfile = {
      userId: 'test-user',
      selectedCoach: 'marcus',
      age: 30,
      gender: 'unspecified',
      fitnessLevel: 'intermediate',
      primaryGoals: ['general_fitness'],
      medicalConditions: [],
      isOnHormoneReplacement: false,
      currentDiet: 'balanced',
      dietaryRestrictions: [],
      allergies: [],
      activityLevel: 'moderate',
      timeAvailability: { weekdays: 60, weekends: 90 },
      availableEquipment: ['basic']
    };
    
    console.log('📝 Testing mock response generation...');
    const response = await coachingService.generateResponse(
      'I want to start a new workout routine',
      testUserProfile,
      []
    );
    
    console.log('✅ AI Response:', response);
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Only run if this is the main module
if (require.main === module) {
  testAICoaching();
}