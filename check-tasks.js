#!/usr/bin/env node

/**
 * Check current tasks in the system and identify what needs to be worked on
 */

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);

async function checkTasks() {
  console.log('🔍 Checking current tasks in Force Fitness...\n');
  
  try {
    const tasksSnapshot = await db.collection('tasks').orderBy('priority', 'desc').get();
    
    if (tasksSnapshot.empty) {
      console.log('❌ No tasks found in the system');
      return;
    }
    
    const tasks = [];
    tasksSnapshot.forEach(doc => {
      const data = doc.data();
      tasks.push({
        id: doc.id,
        title: data.title,
        priority: data.priority,
        status: data.status,
        assignee: data.assignee,
        claimedBy: data.claimedBy,
        tags: data.tags || []
      });
    });
    
    console.log(`📋 Found ${tasks.length} tasks total\n`);
    
    // Group by status
    const byStatus = tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {});
    
    // Group by priority
    const byPriority = tasks.reduce((acc, task) => {
      if (!acc[task.priority]) acc[task.priority] = [];
      acc[task.priority].push(task);
      return acc;
    }, {});
    
    console.log('📊 Tasks by Status:');
    Object.entries(byStatus).forEach(([status, tasks]) => {
      console.log(`   ${status}: ${tasks.length} tasks`);
    });
    
    console.log('\n📊 Tasks by Priority:');
    Object.entries(byPriority).forEach(([priority, tasks]) => {
      console.log(`   ${priority}: ${tasks.length} tasks`);
    });
    
    console.log('\n🎯 URGENT Tasks for AI Agents:');
    const urgentAiTasks = tasks.filter(t => 
      t.priority === 'urgent' && 
      t.assignee === 'ai_agent' && 
      t.status === 'pending'
    );
    
    if (urgentAiTasks.length === 0) {
      console.log('   ✅ No urgent AI tasks pending');
    } else {
      urgentAiTasks.forEach((task, i) => {
        console.log(`   ${i + 1}. ${task.title}`);
        console.log(`      Tags: ${task.tags.join(', ')}`);
        console.log(`      Status: ${task.status}`);
        console.log('');
      });
    }
    
    console.log('🔴 HIGH Priority Tasks for AI Agents:');
    const highAiTasks = tasks.filter(t => 
      t.priority === 'high' && 
      t.assignee === 'ai_agent' && 
      t.status === 'pending'
    );
    
    if (highAiTasks.length === 0) {
      console.log('   ✅ No high priority AI tasks pending');
    } else {
      highAiTasks.forEach((task, i) => {
        console.log(`   ${i + 1}. ${task.title}`);
        console.log(`      Tags: ${task.tags.join(', ')}`);
        console.log(`      Status: ${task.status}`);
        console.log('');
      });
    }
    
    console.log('💡 Next Actions:');
    if (urgentAiTasks.length > 0) {
      console.log('1. Claim and work on urgent tasks first (404 fixes)');
      console.log('2. Focus on routes: /coaching, /progress, /profile');
      console.log('3. Implement onboarding flow');
      console.log('4. Add real AI chat integration');
    } else if (highAiTasks.length > 0) {
      console.log('1. Work on high priority tasks');
      console.log('2. Focus on core functionality');
    } else {
      console.log('1. All urgent/high priority AI tasks complete!');
      console.log('2. Check for medium/low priority tasks');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error checking tasks:', error);
    process.exit(1);
  }
}

checkTasks();