#!/usr/bin/env node

/**
 * Create a new task for improving AI coaching functionality
 */

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);

async function createCoachingImprovementTask() {
  console.log('🆕 Creating AI Coaching Improvement task...');
  
  try {
    const taskData = {
      title: 'Improve AI Coaching with Dynamic Responses and Streaming',
      description: 'Enhance the AI coaching system to provide dynamic, contextual responses and implement streaming for real-time communication.\n\nCURRENT ISSUES:\n- Chat responses are static and do not address specific user prompts\n- No actual AI integration with OpenAI API\n- Responses are pre-written and not contextual\n- No streaming functionality for real-time responses\n\nREQUIREMENTS:\n- Integrate real OpenAI API calls in AICoachingService\n- Implement response streaming for real-time message display\n- Make chat responses dynamic and contextual to user input\n- Add proper error handling for API failures\n- Implement rate limiting and cost tracking\n- Add conversation context and memory\n- Enhance coach personality differentiation\n- Add typing indicators during streaming\n\nTECHNICAL IMPLEMENTATION:\n- Update AICoachingService.generateResponse() to use real OpenAI API\n- Implement streaming response handling with Server-Sent Events\n- Add conversation history context for better responses\n- Implement proper coach persona prompting\n- Add fallback mechanisms for API failures\n- Update CoachChat component to handle streaming responses\n- Add real-time typing animation during response generation\n\nACCEPTANCE CRITERIA:\n- AI responses are dynamic and address user prompts directly\n- Streaming responses display in real-time character by character\n- Each coach has distinct personality in responses\n- Rate limiting and error handling work properly\n- Conversation context is maintained across messages\n- Fallback to static responses when API is unavailable',
      priority: 'high',
      status: 'pending',
      assignee: 'ai_agent',
      assignedTo: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      tags: ['ai-coaching', 'openai-integration', 'streaming', 'backend', 'real-time'],
      dependencies: [],
      createdBy: 'claude-ai-agent',
      metadata: {
        complexity: 'high',
        estimatedHours: 4,
        apiIntegration: true,
        streamingRequired: true
      }
    };
    
    const docRef = await db.collection('tasks').add(taskData);
    
    console.log('✅ Task created successfully: ' + docRef.id);
    console.log('📋 Task: ' + taskData.title);
    console.log('🏷️ Tags: ' + taskData.tags.join(', '));
    console.log('⚡ Priority: ' + taskData.priority);
    console.log('');
    console.log('📝 Description:');
    console.log(taskData.description);
    
    return { id: docRef.id, ...taskData };
    
  } catch (error) {
    console.error('❌ Error creating task:', error);
    return null;
  }
}

createCoachingImprovementTask().then(task => {
  if (task) {
    console.log('\n🎉 AI Coaching improvement task ready for claiming!');
  }
  process.exit(task ? 0 : 1);
});
