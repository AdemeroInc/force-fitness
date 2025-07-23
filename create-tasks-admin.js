#!/usr/bin/env node

/**
 * Force Fitness - Task Creation Script using Firebase Admin SDK
 * Creates critical implementation tasks using server-side authentication
 */

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin with application default credentials
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);

// Critical tasks for AI agents to complete missing functionality
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
- Test all chat functionality including message sending
- Implement proper routing from dashboard "Chat with Coach" button

ACCEPTANCE CRITERIA:
- /coaching route works without 404
- CoachChat component displays correctly
- Navigation works properly
- Premium dark theme maintained
- All existing chat animations work
- Mobile responsive design`,
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["frontend", "routing", "404-fix", "ai-coaching"],
    status: "pending",
    createdBy: "admin"
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
- Implement data visualization with charts/graphs
- Connect to Firebase for data persistence
- Add progress photo upload capability
- Include weekly/monthly progress reports

COMPONENTS TO CREATE:
- ProgressChart component for data visualization
- MetricsInput component for body measurements
- AchievementBadge component for milestones
- ProgressPhotoUpload component
- WeeklyReport component

ACCEPTANCE CRITERIA:
- /progress route works without 404
- Charts display sample/mock data initially
- Form inputs work for metrics entry
- Premium styling matches app aesthetic
- Mobile responsive design
- Firebase integration ready for real data`,
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["frontend", "routing", "404-fix", "analytics", "firebase"],
    status: "pending",
    createdBy: "admin"
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
- Add profile photo upload
- Create settings management
- Add account deletion functionality
- Implement data export capability

FORM SECTIONS:
- Personal Information (name, age, gender)
- Health Information (medical conditions, hormone therapy)
- Fitness Profile (experience level, goals, preferences)
- Dietary Information (restrictions, allergies, current diet)
- Preferences (notification settings, privacy)
- Account Settings (password change, data export)

ACCEPTANCE CRITERIA:
- /profile route works without 404
- All forms functional with validation
- Data saves to Firebase Firestore
- Profile photo upload works
- Premium styling maintained
- Responsive design for all screen sizes
- Proper error handling and success states`,
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["frontend", "routing", "404-fix", "user-profile", "firebase"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Create Admin User Management Page (/admin/users)",
    description: `Create user management interface for admin area.

REQUIREMENTS:
- Create src/app/admin/users/page.tsx
- Display all registered users in a table
- Add user search and filtering
- Implement user profile viewing
- Add user status management (active/inactive)
- Include user analytics (last login, activity)
- Add bulk actions for user management
- Implement user deletion with confirmation
- Add user role management
- Export user data functionality

FEATURES:
- User list with pagination
- Search by name, email, or ID
- Filter by status, registration date, activity
- View detailed user profiles
- Update user information
- Send notifications to users
- View user's workout/progress data

ACCEPTANCE CRITERIA:
- /admin/users route works without 404
- User data displays from Firebase
- All management functions work
- Premium admin styling
- Proper access control (admin only)
- Mobile responsive layout`,
    priority: "high",
    assignee: "ai_agent",
    tags: ["frontend", "admin", "404-fix", "user-management"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Create Admin Analytics Dashboard (/admin/analytics)",
    description: `Create comprehensive analytics dashboard for admin area.

REQUIREMENTS:
- Create src/app/admin/analytics/page.tsx
- Implement user engagement metrics
- Add app usage statistics
- Create revenue/subscription analytics
- Implement AI coaching usage metrics
- Add performance monitoring dashboard
- Create user retention analytics
- Implement error tracking interface
- Add system health monitoring

ANALYTICS SECTIONS:
- User Metrics (registrations, active users, retention)
- Usage Statistics (feature usage, session duration)
- AI Coaching Metrics (conversations, success rates)
- Performance Data (page load times, error rates)
- Revenue Analytics (subscriptions, conversions)
- System Health (Firebase usage, API costs)

ACCEPTANCE CRITERIA:
- /admin/analytics route works without 404
- Charts and graphs display mock data
- Interactive filters and date ranges
- Export functionality for reports
- Real-time data refresh capability
- Premium admin styling maintained`,
    priority: "high",
    assignee: "ai_agent",
    tags: ["frontend", "admin", "404-fix", "analytics"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Create Admin Settings Page (/admin/settings)",
    description: `Create system settings management page for admin area.

REQUIREMENTS:
- Create src/app/admin/settings/page.tsx
- Implement app configuration management
- Add AI model settings (OpenAI, Vertex AI)
- Create feature flag management
- Add notification settings
- Implement backup/restore functionality
- Create API key management
- Add system maintenance mode
- Implement audit log viewing

SETTINGS SECTIONS:
- AI Configuration (model settings, prompts)
- Feature Flags (enable/disable features)
- Notifications (email templates, push settings)
- API Management (keys, rate limits)
- System Settings (maintenance, backups)
- Security Settings (auth requirements)

ACCEPTANCE CRITERIA:
- /admin/settings route works without 404
- All configuration forms functional
- Settings save to Firebase
- Proper validation and error handling
- Access control for sensitive settings
- Premium admin styling`,
    priority: "medium",
    assignee: "ai_agent",
    tags: ["frontend", "admin", "404-fix", "settings"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Implement Complete Onboarding Flow",
    description: `Create comprehensive user onboarding system with coach selection and health survey.

REQUIREMENTS:
- Create src/app/onboarding/page.tsx as main orchestrator
- Create multi-step onboarding flow routing
- Integrate existing CoachSelector component
- Integrate existing ProfileSurvey component  
- Add welcome/introduction step
- Implement progress tracking through steps
- Add data persistence to Firebase
- Create completion redirect logic
- Add skip/resume functionality

FLOW STRUCTURE:
1. Welcome screen with app introduction
2. Coach selection (use existing CoachSelector)
3. Health survey (use existing ProfileSurvey)
4. Goal setting and preferences
5. Completion and dashboard redirect

TECHNICAL REQUIREMENTS:
- Multi-step form with progress indicator
- Data validation at each step
- Local storage for incomplete sessions
- Firebase integration for final data save
- Premium animations and transitions
- Mobile responsive design

ACCEPTANCE CRITERIA:
- Complete onboarding flow works end-to-end
- Data saves correctly to user profile
- Users redirected properly after completion
- Existing components integrated seamlessly
- Premium styling throughout
- Works on all device sizes`,
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["frontend", "onboarding", "firebase", "user-experience"],
    status: "pending",
    createdBy: "admin"
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
- Create token usage monitoring
- Add conversation analytics

COACH PERSONAS TO IMPLEMENT:
- Marcus (Elite Performance): Intense, motivational, elite athlete focus
- Serena (Wellness): Holistic, mindful, wellness-focused approach  
- Alex (Science-Based): Data-driven, research-backed, analytical
- Riley (Motivational): Energetic, positive, celebration-focused

TECHNICAL FEATURES:
- Streaming responses for real-time chat feel
- Context-aware conversations using user profile
- Dynamic workout/meal plan generation
- Safety filters and content moderation
- Rate limiting and cost management
- Conversation threading and history

ACCEPTANCE CRITERIA:
- Real AI responses replace mock data
- Each coach has distinct personality
- Conversations feel natural and helpful
- Message history persists across sessions
- Error states handled gracefully
- Token costs monitored and controlled`,
    priority: "urgent",
    assignee: "ai_agent",
    tags: ["backend", "ai-integration", "openai", "coaching"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Implement Firebase Firestore Database Schema",
    description: `Create complete database structure for user profiles, conversations, and app data.

REQUIREMENTS:
- Design and implement Firestore collections
- Create user profile document structure
- Add conversation/message collections
- Implement workout and meal plan storage
- Create progress tracking collections
- Add analytics and usage tracking
- Update security rules for all collections
- Create data migration utilities

COLLECTION STRUCTURE:
- users/{userId} - User profiles and settings
- conversations/{conversationId} - Chat sessions
- messages/{messageId} - Individual chat messages
- workouts/{workoutId} - Generated workout plans
- mealPlans/{mealPlanId} - Generated meal plans
- progress/{progressId} - User progress entries
- analytics/{analyticsId} - Usage and performance data

SECURITY RULES:
- Users can only access their own data
- Admin users have full read access
- Proper validation for all document updates
- Rate limiting for expensive operations

ACCEPTANCE CRITERIA:
- All collections created with proper structure
- Security rules properly configured
- Data validation rules implemented
- Indexes created for query performance
- Backup and restore procedures documented
- Migration scripts for existing data`,
    priority: "high",
    assignee: "ai_agent",
    tags: ["backend", "firebase", "database", "security"],
    status: "pending",
    createdBy: "admin"
  },

  {
    title: "Implement Dashboard Quick Action Functionality",
    description: `Make all dashboard quick action buttons functional with proper navigation and features.

REQUIREMENTS:
- Fix "Chat with Coach" button to navigate to /coaching
- Implement "View Meal Plan" functionality
- Add "Start Workout" feature with workout selection
- Create "Track Progress" quick entry
- Add "View Goals" navigation
- Implement recent activity real data
- Add workout history display
- Create achievement notifications

QUICK ACTIONS TO IMPLEMENT:
1. Chat with Coach → Navigate to /coaching with selected coach
2. View Meal Plan → Show current meal plan or generate new one
3. Start Workout → Show workout options or continue current plan
4. Track Progress → Quick progress entry modal
5. View Goals → Navigate to goals page with current goals
6. Check Schedule → Show today's fitness schedule

DASHBOARD IMPROVEMENTS:
- Replace mock data with real user data
- Add loading states for data fetching
- Implement real-time updates
- Add progress charts and summaries
- Create motivational elements
- Add achievement badges and streaks

ACCEPTANCE CRITERIA:
- All buttons navigate to correct destinations
- Real user data displays properly
- Loading states show during data fetch
- Error states handled gracefully
- Premium animations maintained
- Mobile responsive functionality`,
    priority: "high",
    assignee: "ai_agent",
    tags: ["frontend", "dashboard", "navigation", "user-experience"],
    status: "pending",
    createdBy: "admin"
  }
];

async function createTasks() {
  console.log('🚀 Creating comprehensive implementation tasks for Force Fitness...\n');
  
  try {
    const createdTasks = [];
    const batch = db.batch();
    
    for (const task of criticalTasks) {
      const taskRef = db.collection('tasks').doc();
      const taskData = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee,
        tags: task.tags,
        createdBy: task.createdBy,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };
      
      batch.set(taskRef, taskData);
      createdTasks.push({ id: taskRef.id, ...task });
      
      console.log(`✓ Prepared: ${task.title} (Priority: ${task.priority})`);
    }
    
    // Execute the batch write
    await batch.commit();
    
    console.log(`\n🎉 Successfully created ${createdTasks.length} implementation tasks!`);
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
    console.log('\n📋 Critical Tasks Created:');
    console.log('- AI Coaching Chat Page (/coaching) - URGENT');
    console.log('- Progress Analytics Page (/progress) - URGENT');
    console.log('- User Profile Management Page (/profile) - URGENT');
    console.log('- Complete Onboarding Flow - URGENT');
    console.log('- Real AI Chat Integration - URGENT');
    console.log('- Dashboard Quick Actions - HIGH');
    console.log('- Admin Pages (users, analytics, settings) - HIGH/MEDIUM');
    console.log('- Firebase Database Schema - HIGH');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating tasks:', error);
    console.error('Full error:', error.message);
    process.exit(1);
  }
}

// Run the script
createTasks();