#!/usr/bin/env node

/**
 * Claim a task for an AI agent
 */

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);

async function claimTask(taskTitle, agentId = 'claude-ai-agent') {
  console.log(`🎯 Claiming task: "${taskTitle}"`);
  
  try {
    // Find the task by title
    const tasksSnapshot = await db.collection('tasks')
      .where('title', '==', taskTitle)
      .where('status', '==', 'pending')
      .limit(1)
      .get();
    
    if (tasksSnapshot.empty) {
      console.log('❌ Task not found or already claimed');
      return null;
    }
    
    const taskDoc = tasksSnapshot.docs[0];
    const taskId = taskDoc.id;
    const taskData = taskDoc.data();
    
    // Claim the task
    await db.collection('tasks').doc(taskId).update({
      claimedBy: agentId,
      claimedAt: FieldValue.serverTimestamp(),
      status: 'in_progress',
      updatedAt: FieldValue.serverTimestamp()
    });
    
    console.log(`✅ Successfully claimed task: ${taskId}`);
    console.log(`📋 Task: ${taskData.title}`);
    console.log(`🏷️ Tags: ${taskData.tags?.join(', ') || 'none'}`);
    console.log(`⚡ Priority: ${taskData.priority}`);
    console.log('');
    console.log('📝 Description:');
    console.log(taskData.description);
    
    return { id: taskId, ...taskData };
    
  } catch (error) {
    console.error('❌ Error claiming task:', error);
    return null;
  }
}

// Get task title from command line args
const taskTitle = process.argv[2];
if (!taskTitle) {
  console.log('Usage: node claim-task.js "Task Title"');
  process.exit(1);
}

claimTask(taskTitle).then(task => {
  if (task) {
    console.log('\n🚀 Ready to start implementation!');
  }
  process.exit(task ? 0 : 1);
});