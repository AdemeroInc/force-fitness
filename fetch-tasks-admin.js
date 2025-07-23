#!/usr/bin/env node

/**
 * Force Fitness - Task Fetching Script using Firebase Admin SDK
 * Fetches all tasks from the admin dashboard using server-side authentication
 */

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin with application default credentials
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);

async function fetchAllTasks() {
  try {
    console.log('🔍 Fetching tasks from Force Fitness admin dashboard...\n');
    
    // Fetch all tasks from Firestore (simplified query to avoid index requirement)
    const tasksSnapshot = await db.collection('tasks')
      .orderBy('createdAt', 'desc')
      .get();
    
    const tasks = [];
    tasksSnapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
        claimedAt: doc.data().claimedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
        releasedAt: doc.data().releasedAt?.toDate()
      });
    });

    // Categorize tasks
    const pendingAITasks = tasks.filter(task => 
      task.status === 'pending' && 
      (task.assignee === 'ai_agent' || task.assignee === 'any')
    );

    const claimedTasks = tasks.filter(task => 
      task.claimedBy && 
      (task.status === 'in_progress' || task.status === 'review')
    );

    const completedTasks = tasks.filter(task => 
      task.status === 'completed'
    );

    // Display summary
    console.log('=== TASK SUMMARY ===');
    console.log(`Total tasks: ${tasks.length}`);
    console.log(`Pending AI/Any tasks: ${pendingAITasks.length}`);
    console.log(`Currently claimed: ${claimedTasks.length}`);
    console.log(`Completed: ${completedTasks.length}`);
    console.log('');

    // Display available tasks for AI agents
    if (pendingAITasks.length > 0) {
      console.log('=== AVAILABLE TASKS FOR AI AGENTS ===\n');
      pendingAITasks.forEach((task, index) => {
        console.log(`📋 Task ${index + 1}/${pendingAITasks.length}`);
        console.log(`ID: ${task.id}`);
        console.log(`Title: ${task.title}`);
        console.log(`Priority: ${task.priority.toUpperCase()}`);
        console.log(`Assignee: ${task.assignee}`);
        console.log(`Tags: ${task.tags?.join(', ') || 'None'}`);
        console.log(`Created: ${task.createdAt?.toLocaleString() || 'Unknown'}`);
        if (task.dueDate) {
          console.log(`Due Date: ${task.dueDate.toLocaleString()}`);
        }
        console.log('\nDescription:');
        console.log(task.description);
        console.log('\n' + '='.repeat(80) + '\n');
      });
    } else {
      console.log('✅ No pending tasks available for AI agents.\n');
    }

    // Display claimed tasks
    if (claimedTasks.length > 0) {
      console.log('\n=== CURRENTLY CLAIMED TASKS ===\n');
      claimedTasks.forEach(task => {
        console.log(`🔒 ${task.title}`);
        console.log(`   Claimed by: ${task.claimedBy}`);
        console.log(`   Status: ${task.status}`);
        console.log(`   Claimed at: ${task.claimedAt?.toLocaleString() || 'Unknown'}`);
        
        // Check if task is stale (claimed more than 2 hours ago)
        if (task.claimedAt) {
          const hoursAgo = (Date.now() - task.claimedAt.getTime()) / (1000 * 60 * 60);
          if (hoursAgo > 2) {
            console.log(`   ⚠️  STALE: Claimed ${hoursAgo.toFixed(1)} hours ago`);
          }
        }
        console.log('');
      });
    }

    // Display completed tasks
    if (completedTasks.length > 0) {
      console.log('\n=== RECENTLY COMPLETED TASKS ===\n');
      completedTasks.slice(0, 5).forEach(task => {
        console.log(`✅ ${task.title}`);
        console.log(`   Completed at: ${task.completedAt?.toLocaleString() || 'Unknown'}`);
        console.log('');
      });
    }

    // Priority breakdown
    console.log('\n=== PRIORITY BREAKDOWN ===');
    const priorityBreakdown = tasks.reduce((acc, task) => {
      const key = `${task.priority}_${task.status}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    ['urgent', 'high', 'medium', 'low'].forEach(priority => {
      const pending = priorityBreakdown[`${priority}_pending`] || 0;
      const inProgress = priorityBreakdown[`${priority}_in_progress`] || 0;
      const completed = priorityBreakdown[`${priority}_completed`] || 0;
      const total = pending + inProgress + completed;
      
      if (total > 0) {
        console.log(`${priority.toUpperCase()}: ${total} total (${pending} pending, ${inProgress} in progress, ${completed} completed)`);
      }
    });

    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fetching tasks:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the script
fetchAllTasks();