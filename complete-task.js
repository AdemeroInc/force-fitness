#!/usr/bin/env node

/**
 * Mark a task as completed (moved to review status)
 */

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);

async function completeTask(taskTitle, completionNotes = '') {
  console.log(`✅ Completing task: "${taskTitle}"`);
  
  try {
    // Find the task by title
    const tasksSnapshot = await db.collection('tasks')
      .where('title', '==', taskTitle)
      .where('status', '==', 'in_progress')
      .limit(1)
      .get();
    
    if (tasksSnapshot.empty) {
      console.log('❌ Task not found or not in progress');
      return null;
    }
    
    const taskDoc = tasksSnapshot.docs[0];
    const taskId = taskDoc.id;
    const taskData = taskDoc.data();
    
    // Update task to review status
    await db.collection('tasks').doc(taskId).update({
      status: 'review',
      updatedAt: FieldValue.serverTimestamp(),
      metadata: {
        ...taskData.metadata,
        completionNotes,
        completedImplementation: new Date().toISOString(),
        implementedBy: 'claude-ai-agent'
      }
    });
    
    console.log(`✅ Task moved to review status: ${taskId}`);
    console.log(`📋 Task: ${taskData.title}`);
    console.log(`🏷️ Tags: ${taskData.tags?.join(', ') || 'none'}`);
    console.log(`⚡ Priority: ${taskData.priority}`);
    console.log('');
    console.log('📝 Implementation Summary:');
    console.log(completionNotes);
    
    return { id: taskId, ...taskData };
    
  } catch (error) {
    console.error('❌ Error completing task:', error);
    return null;
  }
}

// Get task title and completion notes from command line args
const taskTitle = process.argv[2];
const completionNotes = process.argv[3] || '';

if (!taskTitle) {
  console.log('Usage: node complete-task.js "Task Title" "Optional completion notes"');
  process.exit(1);
}

completeTask(taskTitle, completionNotes).then(task => {
  if (task) {
    console.log('\n🎉 Task ready for review!');
  }
  process.exit(task ? 0 : 1);
});