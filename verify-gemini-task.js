#!/usr/bin/env node

/**
 * Force Fitness - Verify Gemini Task Creation
 * Verifies that the Gemini update task was successfully created
 */

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({
  credential: applicationDefault(),
  projectId: "force-fitness-1753281211"
});

const db = getFirestore(app);

async function verifyGeminiTask() {
  console.log('🔍 Verifying Gemini update task creation...\n');
  
  try {
    const tasksQuery = db.collection('tasks')
      .where('title', '==', 'Update Gemini AI Model to Gemini-2.5-Flash')
      .limit(1);
    
    const snapshot = await tasksQuery.get();
    
    if (snapshot.empty) {
      console.log('❌ Gemini task not found');
      return null;
    }
    
    const task = snapshot.docs[0];
    const taskData = task.data();
    
    console.log('✅ Gemini task found successfully!');
    console.log(`📋 Task ID: ${task.id}`);
    console.log(`🎯 Title: ${taskData.title}`);
    console.log(`🏷️  Priority: ${taskData.priority}`);
    console.log(`👤 Assignee: ${taskData.assignee}`);
    console.log(`📊 Status: ${taskData.status}`);
    console.log(`🏷️  Tags: ${taskData.tags?.join(', ') || 'None'}`);
    console.log(`⚙️  Complexity: ${taskData.metadata?.complexity || 'Not set'}`);
    console.log(`🕒 Estimated Hours: ${taskData.metadata?.estimatedHours || 'Not set'}`);
    
    console.log('\n📝 Task Description (first 200 chars):');
    console.log(taskData.description?.substring(0, 200) + '...');
    
    return { id: task.id, ...taskData };
    
  } catch (error) {
    console.error('❌ Error verifying task:', error);
    return null;
  }
}

verifyGeminiTask().then(task => {
  if (task) {
    console.log('\n🎉 Task verification successful! The Gemini update task is ready for implementation.');
  }
  process.exit(task ? 0 : 1);
});