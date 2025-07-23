#!/usr/bin/env node

/**
 * Force Fitness - Critical Task Creation Script
 * Creates the most urgent tasks needed to fix 404 errors and core functionality
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Critical tasks to fix 404 errors and core functionality
const criticalTasks = [
  {
    title: "Create AI Coaching Chat Page (/coaching)",
    description: `Create the main AI coaching interface page at /coaching route.

REQUIREMENTS:
- Create src/app/coaching/page.tsx
- Integrate existing CoachChat component from src/components/coaching/CoachChat.tsx
- Add proper page wrapper with navigation
- Implement coach selection if no coach is selected
- Add loading states and error handling
- Ensure responsive design matches premium aesthetic

ACCEPTANCE CRITERIA:
- /coaching route works without 404
- CoachChat component displays correctly
- Navigation works properly
- Premium dark theme maintained
- All existing chat animations work
- Mobile responsive design`,
    priority: 'urgent',
    assignee: 'ai_agent',
    tags: ['frontend', 'routing', '404-fix', 'ai-coaching'],
    status: 'pending',
    createdBy: 'admin',
  },

  {
    title: "Create Progress Analytics Page (/progress)",
    description: `Create comprehensive progress tracking page at /progress route.

REQUIREMENTS:
- Create src/app/progress/page.tsx
- Design progress dashboard with charts and metrics
- Implement body metrics tracking (weight, measurements)
- Add workout completion statistics
- Create goal progress visualization
- Add streak tracking and achievements
- Include weekly/monthly progress reports

ACCEPTANCE CRITERIA:
- /progress route works without 404
- Charts display sample/mock data initially
- Form inputs work for metrics entry
- Premium styling matches app aesthetic
- Mobile responsive design
- Firebase integration ready for real data`,
    priority: 'urgent',
    assignee: 'ai_agent',
    tags: ['frontend', 'routing', '404-fix', 'analytics'],
    status: 'pending',
    createdBy: 'admin',
  },

  {
    title: "Create User Profile Management Page (/profile)",
    description: `Create comprehensive user profile page at /profile route.

REQUIREMENTS:
- Create src/app/profile/page.tsx
- Implement profile editing interface
- Add health information management
- Include hormone therapy tracking
- Add dietary restrictions management
- Implement goal setting interface

ACCEPTANCE CRITERIA:
- /profile route works without 404
- All forms functional with validation
- Data saves to Firebase Firestore
- Profile photo upload works
- Premium styling maintained
- Responsive design for all screen sizes`,
    priority: 'urgent',
    assignee: 'ai_agent',
    tags: ['frontend', 'routing', '404-fix', 'user-profile'],
    status: 'pending',
    createdBy: 'admin',
  },

  {
    title: "Implement Complete Onboarding Flow",
    description: `Create comprehensive user onboarding system with coach selection and health survey.

REQUIREMENTS:
- Create src/app/onboarding/page.tsx as main orchestrator
- Create multi-step onboarding flow routing
- Integrate existing CoachSelector component
- Integrate existing ProfileSurvey component
- Add data persistence to Firebase
- Create completion redirect logic

ACCEPTANCE CRITERIA:
- Complete onboarding flow works end-to-end
- Data saves correctly to user profile
- Users redirected properly after completion
- Existing components integrated seamlessly
- Premium styling throughout
- Works on all device sizes`,
    priority: 'urgent',
    assignee: 'ai_agent',
    tags: ['frontend', 'onboarding', 'firebase', 'user-experience'],
    status: 'pending',
    createdBy: 'admin',
  },

  {
    title: "Implement Real AI Chat Integration",
    description: `Replace mock AI responses with real OpenAI API integration for coaching conversations.

REQUIREMENTS:
- Complete implementation in src/lib/ai-coaching.ts
- Integrate OpenAI GPT-4 API for coach conversations
- Implement coach persona prompts for each coach type
- Add conversation context management
- Implement message history persistence
- Add error handling and retry logic

ACCEPTANCE CRITERIA:
- Real AI responses replace mock data
- Each coach has distinct personality
- Conversations feel natural and helpful
- Message history persists across sessions
- Error states handled gracefully
- Token costs monitored and controlled`,
    priority: 'urgent',
    assignee: 'ai_agent',
    tags: ['backend', 'ai-integration', 'openai', 'coaching'],
    status: 'pending',
    createdBy: 'admin',
  },

  {
    title: "Fix Dashboard Quick Action Functionality",
    description: `Make all dashboard quick action buttons functional with proper navigation and features.

REQUIREMENTS:
- Fix "Chat with Coach" button to navigate to /coaching
- Implement "View Meal Plan" functionality
- Add "Start Workout" feature with workout selection
- Create "Track Progress" quick entry
- Replace mock data with real user data

ACCEPTANCE CRITERIA:
- All buttons navigate to correct destinations
- Real user data displays properly
- Loading states show during data fetch
- Error states handled gracefully
- Premium animations maintained
- Mobile responsive functionality`,
    priority: 'high',
    assignee: 'ai_agent',
    tags: ['frontend', 'dashboard', 'navigation', 'user-experience'],
    status: 'pending',
    createdBy: 'admin',
  },
];

async function createCriticalTasks() {
  console.log('🚀 Creating critical implementation tasks for Force Fitness...\n');
  
  try {
    const createdTasks = [];
    
    for (const task of criticalTasks) {
      const taskData = {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'tasks'), taskData);
      createdTasks.push({ id: docRef.id, ...task });
      
      console.log(`✓ Created: ${task.title} (Priority: ${task.priority})`);
    }
    
    console.log(`\n🎉 Successfully created ${createdTasks.length} critical tasks!`);
    console.log('\n📊 Task Summary:');
    
    const priorityCount = createdTasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(priorityCount).forEach(([priority, count]) => {
      console.log(`   ${priority.toUpperCase()}: ${count} tasks`);
    });
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Visit http://localhost:3001/admin/tasks to view all tasks');
    console.log('2. AI agents can pick up tasks by changing status to "in_progress"');
    console.log('3. Focus on URGENT tasks first to fix 404 errors');
    console.log('4. Mark tasks as completed when implementation is finished');
    
  } catch (error) {
    console.error('❌ Error creating tasks:', error);
    process.exit(1);
  }
}

// Run the script
createCriticalTasks();