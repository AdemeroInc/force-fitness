#!/usr/bin/env node

/**
 * Force Fitness - Create Gemini Model Update Task
 * Creates a task for updating the Gemini AI model configuration to Gemini-2.5-Flash
 */

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const app = initializeApp({
  credential: applicationDefault(),
  projectId: "force-fitness-1753281211"
});

const db = getFirestore(app);

const geminiUpdateTask = {
  title: "Update Gemini AI Model to Gemini-2.5-Flash",
  description: `CURRENT ISSUE:
- Gemini AI model may not be using the latest Gemini-2.5-Flash version
- Need to verify and update model configuration to use the most current version

REQUIREMENTS:
- Review current Gemini model implementation in the codebase
- Update model configuration to use Gemini-2.5-Flash specifically
- Verify API calls are using the correct model version
- Test model responses to ensure proper functionality
- Update any model-related constants or configuration files
- Ensure optimal performance and cost efficiency with the new model

TECHNICAL IMPLEMENTATION:
- Search codebase for existing Gemini model references
- Update model version strings to "gemini-2.5-flash" 
- Verify Google AI Studio/Vertex AI configuration
- Update any model initialization or API call configurations
- Test integration with existing functionality
- Update documentation if needed

FILES TO REVIEW:
- /home/mmontesino/github.com/AdemeroInc/force-fitness/src/lib/vertexai.ts (main Gemini configuration)
- /home/mmontesino/github.com/AdemeroInc/force-fitness/test-gemini.js (test implementation)
- Any other files with Gemini model references

ACCEPTANCE CRITERIA:
- All Gemini model references updated to "gemini-2.5-flash"
- Test scripts confirm functionality with new model
- Performance metrics show improvements or maintained performance
- No breaking changes to existing AI coaching functionality
- Documentation updated to reflect model version change`,
  priority: "medium",
  status: "pending",
  assignee: "ai_agent",
  tags: ["ai-models", "gemini", "configuration", "backend", "api-integration"],
  createdBy: "admin",
  metadata: {
    complexity: "low",
    estimatedHours: 2,
    techStack: ["vertex-ai", "google-cloud", "typescript"],
    relatedFiles: [
      "src/lib/vertexai.ts",
      "test-gemini.js",
      "test-with-updated-perms.js",
      "test-different-models.js"
    ]
  }
};

async function createGeminiUpdateTask() {
  console.log('🤖 Creating Gemini AI model update task...\n');
  
  try {
    // Use the exact same format as firebase-admin
    const taskData = {
      title: geminiUpdateTask.title,
      description: geminiUpdateTask.description,
      priority: geminiUpdateTask.priority,
      status: geminiUpdateTask.status,
      assignee: geminiUpdateTask.assignee,
      assignedTo: null,
      tags: geminiUpdateTask.tags,
      dependencies: [],
      createdBy: geminiUpdateTask.createdBy,
      metadata: geminiUpdateTask.metadata,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      dueDate: null
    };
    
    const docRef = await db.collection('tasks').add(taskData);
    
    console.log(`✅ Successfully created Gemini update task!`);
    console.log(`📋 Task ID: ${docRef.id}`);
    console.log(`🎯 Priority: ${geminiUpdateTask.priority}`);
    console.log(`👤 Assignee: ${geminiUpdateTask.assignee}`);
    console.log(`🏷️  Tags: ${geminiUpdateTask.tags.join(', ')}`);
    
    console.log('\n📊 Task Details:');
    console.log(`   Title: ${geminiUpdateTask.title}`);
    console.log(`   Complexity: ${geminiUpdateTask.metadata.complexity}`);
    console.log(`   Estimated Hours: ${geminiUpdateTask.metadata.estimatedHours}`);
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Visit http://localhost:3001/admin/tasks to view the task');
    console.log('2. AI agent can claim this task by updating status to "in_progress"');
    console.log('3. Update all Gemini model references to "gemini-2.5-flash"');
    console.log('4. Test the updated configuration thoroughly');
    console.log('5. Mark task as completed when implementation is finished');
    
    console.log(`\n🔧 Key files to update:`);
    geminiUpdateTask.metadata.relatedFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating Gemini update task:', error);
    console.error('Full error:', error.message);
    process.exit(1);
  }
}

// Run the script
createGeminiUpdateTask();