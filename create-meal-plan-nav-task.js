#!/usr/bin/env node

/**
 * Force Fitness - Create Meal Plan Navigation Task
 * Creates a task for implementing navigation for the meal plan functionality
 */

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const app = initializeApp({
  credential: applicationDefault(),
  projectId: "force-fitness-1753281211"
});

const db = getFirestore(app);

const mealPlanNavTask = {
  title: "Implement Meal Plan Navigation System",
  description: `CURRENT ISSUE:
- Meal plan functionality exists but lacks proper navigation structure
- Users need intuitive way to browse, select, and manage meal plans
- Missing meal plan category navigation and filtering options

REQUIREMENTS:
- Create comprehensive meal plan navigation system
- Implement meal plan categories (e.g., Weight Loss, Muscle Gain, Maintenance)
- Add filtering by dietary preferences (vegetarian, vegan, keto, etc.)
- Create meal plan detail pages with recipe navigation
- Add weekly/daily meal plan view navigation
- Implement meal plan search and discovery features

TECHNICAL IMPLEMENTATION:
- Create src/app/meal-plans/page.tsx as main meal plan hub
- Design meal plan category navigation component
- Implement filtering and search functionality
- Create meal plan detail view with recipe navigation
- Add meal plan calendar/weekly view navigation
- Integrate with existing meal planning data structure
- Add breadcrumb navigation for meal plan sections

UI/UX REQUIREMENTS:
- Clean, intuitive navigation design matching app aesthetic
- Mobile-responsive navigation for meal plans
- Quick access to saved/favorite meal plans
- Clear meal plan progression and tracking
- Premium dark theme consistency

ACCEPTANCE CRITERIA:
- /meal-plans route works with full navigation
- Categories and filters functional
- Meal plan detail pages accessible via navigation
- Search functionality works for meal plans
- Mobile responsive design
- Integration with user preferences and dietary restrictions
- Premium styling maintained throughout`,
  priority: "medium",
  status: "pending",
  assignee: "ai_agent",
  tags: ["frontend", "navigation", "meal-planning", "ui-ux", "routing"],
  createdBy: "admin",
  metadata: {
    complexity: "medium",
    estimatedHours: 3,
    techStack: ["react", "nextjs", "typescript", "tailwindcss"],
    relatedFeatures: ["meal-planning", "user-preferences", "navigation"],
    uiComponents: ["navigation", "filters", "cards", "breadcrumbs", "search"]
  }
};

async function createMealPlanNavTask() {
  console.log('🍽️ Creating Meal Plan Navigation task...\n');
  
  try {
    const taskData = {
      title: mealPlanNavTask.title,
      description: mealPlanNavTask.description,
      priority: mealPlanNavTask.priority,
      status: mealPlanNavTask.status,
      assignee: mealPlanNavTask.assignee,
      assignedTo: null,
      tags: mealPlanNavTask.tags,
      dependencies: [],
      createdBy: mealPlanNavTask.createdBy,
      metadata: mealPlanNavTask.metadata,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      dueDate: null
    };
    
    const docRef = await db.collection('tasks').add(taskData);
    
    console.log(`✅ Successfully created Meal Plan Navigation task!`);
    console.log(`📋 Task ID: ${docRef.id}`);
    console.log(`🎯 Priority: ${mealPlanNavTask.priority}`);
    console.log(`👤 Assignee: ${mealPlanNavTask.assignee}`);
    console.log(`🏷️  Tags: ${mealPlanNavTask.tags.join(', ')}`);
    
    console.log('\n📊 Task Details:');
    console.log(`   Title: ${mealPlanNavTask.title}`);
    console.log(`   Complexity: ${mealPlanNavTask.metadata.complexity}`);
    console.log(`   Estimated Hours: ${mealPlanNavTask.metadata.estimatedHours}`);
    
    console.log('\n🎯 Key Features to Implement:');
    console.log('   - Meal plan category navigation');
    console.log('   - Filtering by dietary preferences');
    console.log('   - Meal plan detail pages');
    console.log('   - Weekly/daily view navigation');
    console.log('   - Search and discovery features');
    
    console.log('\n🔧 UI Components needed:');
    mealPlanNavTask.metadata.uiComponents.forEach(component => {
      console.log(`   - ${component}`);
    });
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Visit http://localhost:3001/admin/tasks to view the task');
    console.log('2. AI agent can claim this task by updating status to "in_progress"');
    console.log('3. Create meal plan navigation structure');
    console.log('4. Implement filtering and search functionality');
    console.log('5. Test navigation flow and user experience');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating Meal Plan Navigation task:', error);
    console.error('Full error:', error.message);
    process.exit(1);
  }
}

// Run the script
createMealPlanNavTask();