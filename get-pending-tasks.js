#!/usr/bin/env node

/**
 * Force Fitness - Get Pending Tasks for AI Agents
 * Returns a list of available task titles that can be claimed by AI agents
 */

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin with application default credentials
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);

async function getPendingTasks() {
  try {
    console.log('🔍 Fetching pending tasks available for AI agents...\n');
    
    // Fetch all tasks from Firestore (to avoid index requirements)
    const tasksSnapshot = await db.collection('tasks')
      .get();
    
    const pendingTasks = [];
    tasksSnapshot.forEach(doc => {
      const data = doc.data();
      // Only include pending tasks assigned to AI agents or available to anyone
      if (data.status === 'pending' && (data.assignee === 'ai_agent' || data.assignee === 'any')) {
        pendingTasks.push({
          id: doc.id,
          title: data.title,
          priority: data.priority,
          assignee: data.assignee,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate(),
          dueDate: data.dueDate?.toDate()
        });
      }
    });

    // Sort by created date (most recent first)
    pendingTasks.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (pendingTasks.length === 0) {
      console.log('✅ No pending tasks available for AI agents at this time.\n');
      return [];
    }

    console.log(`📋 Found ${pendingTasks.length} pending task(s) available for AI agents:\n`);
    
    // Display task titles with basic info
    pendingTasks.forEach((task, index) => {
      const priorityEmoji = {
        'urgent': '🔴',
        'high': '🟠', 
        'medium': '🟡',
        'low': '🟢'
      }[task.priority] || '⚪';
      
      console.log(`${index + 1}. ${priorityEmoji} ${task.title}`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Priority: ${task.priority.toUpperCase()}`);
      console.log(`   Assignee: ${task.assignee}`);
      if (task.tags.length > 0) {
        console.log(`   Tags: ${task.tags.join(', ')}`);          }
      if (task.dueDate) {
        console.log(`   Due: ${task.dueDate.toLocaleDateString()}`);
      }
      console.log('');
    });

    // Return just the task titles for claiming
    const taskTitles = pendingTasks.map(task => task.title);
    console.log('=== TASK TITLES FOR CLAIMING ===');
    taskTitles.forEach((title, index) => {
      console.log(`${index + 1}. "${title}"`);
    });
    
    return taskTitles;
    
  } catch (error) {
    console.error('❌ Error fetching pending tasks:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the script
getPendingTasks()
  .then(titles => {
    console.log(`\n✨ Found ${titles.length} pending task(s) ready for claiming.`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });