#!/usr/bin/env node

/**
 * Force Fitness - Task Creation Script with Proper Firebase Integration
 * Creates critical implementation tasks using the exact same format as taskService
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Use the exact Firebase configuration from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyCL_snsu3sNg2LP4oTkmFN6RSxuPr2S9Jw",
  authDomain: "force-fitness-1753281211.firebaseapp.com",
  projectId: "force-fitness-1753281211",
  storageBucket: "force-fitness-1753281211.firebasestorage.app",
  messagingSenderId: "77830233576",
  appId: "1:77830233576:web:0440ebd1d36e295fb1d85d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Critical tasks using the exact format expected by taskService
const criticalTasks = [
  {
    title: "Create AI Coaching Chat Page (/coaching)",
    description: "Create the main AI coaching interface page at /coaching route.\n\nREQUIREMENTS:\n- Create src/app/coaching/page.tsx\n- Integrate existing CoachChat component\n- Add proper page wrapper with navigation\n- Implement coach selection if no coach is selected\n- Add loading states and error handling\n\nACCEPTANCE CRITERIA:\n- /coaching route works without 404\n- CoachChat component displays correctly\n- Navigation works properly\n- Premium dark theme maintained\n- Mobile responsive design",
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["frontend", "routing", "404-fix", "ai-coaching"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Create Progress Analytics Page (/progress)",
    description: "Create comprehensive progress tracking page at /progress route.\n\nREQUIREMENTS:\n- Create src/app/progress/page.tsx\n- Design progress dashboard with charts and metrics\n- Implement body metrics tracking\n- Add workout completion statistics\n- Create goal progress visualization\n\nACCEPTANCE CRITERIA:\n- /progress route works without 404\n- Charts display sample data initially\n- Form inputs work for metrics entry\n- Premium styling matches app aesthetic\n- Mobile responsive design",
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["frontend", "routing", "404-fix", "analytics"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Create User Profile Management Page (/profile)",
    description: "Create comprehensive user profile page at /profile route.\n\nREQUIREMENTS:\n- Create src/app/profile/page.tsx\n- Implement profile editing interface\n- Add health information management\n- Include hormone therapy tracking\n- Add dietary restrictions management\n\nACCEPTANCE CRITERIA:\n- /profile route works without 404\n- All forms functional with validation\n- Data saves to Firebase Firestore\n- Premium styling maintained\n- Responsive design for all screen sizes",
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["frontend", "routing", "404-fix", "user-profile"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Implement Complete Onboarding Flow",
    description: "Create comprehensive user onboarding system with coach selection and health survey.\n\nREQUIREMENTS:\n- Create src/app/onboarding/page.tsx as main orchestrator\n- Create multi-step onboarding flow routing\n- Integrate existing CoachSelector component\n- Integrate existing ProfileSurvey component\n- Add data persistence to Firebase\n\nACCEPTANCE CRITERIA:\n- Complete onboarding flow works end-to-end\n- Data saves correctly to user profile\n- Users redirected properly after completion\n- Existing components integrated seamlessly\n- Premium styling throughout",
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["frontend", "onboarding", "firebase", "user-experience"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Implement Real AI Chat Integration",
    description: "Replace mock AI responses with real OpenAI API integration for coaching conversations.\n\nREQUIREMENTS:\n- Complete implementation in src/lib/ai-coaching.ts\n- Integrate OpenAI GPT-4 API for coach conversations\n- Implement coach persona prompts for each coach type\n- Add conversation context management\n- Implement message history persistence\n\nACCEPTANCE CRITERIA:\n- Real AI responses replace mock data\n- Each coach has distinct personality\n- Conversations feel natural and helpful\n- Message history persists across sessions\n- Error states handled gracefully",
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["backend", "ai-integration", "openai", "coaching"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Fix Dashboard Quick Action Functionality",
    description: "Make all dashboard quick action buttons functional with proper navigation and features.\n\nREQUIREMENTS:\n- Fix 'Chat with Coach' button to navigate to /coaching\n- Implement 'View Meal Plan' functionality\n- Add 'Start Workout' feature with workout selection\n- Create 'Track Progress' quick entry\n- Replace mock data with real user data\n\nACCEPTANCE CRITERIA:\n- All buttons navigate to correct destinations\n- Real user data displays properly\n- Loading states show during data fetch\n- Error states handled gracefully\n- Premium animations maintained",
    priority: "high",
    assignee: "ai_agent",
    tags: ["frontend", "dashboard", "navigation", "user-experience"],
    status: "pending",
    createdBy: "admin"
  }
];

async function createTasks() {
  console.log('🚀 Creating critical implementation tasks for Force Fitness...\n');
  
  try {
    const createdTasks = [];
    
    for (const task of criticalTasks) {
      // Use the exact same format as taskService.createTask()
      const taskData = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee,
        tags: task.tags,
        createdBy: task.createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        dueDate: null // Explicitly set to null to avoid validation issues
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
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating tasks:', error);
    console.error('Full error:', error.message);
    process.exit(1);
  }
}

// Run the script
createTasks();