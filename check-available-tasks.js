const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'ademero-fitness-force',
  });
}

const db = admin.firestore();

async function checkAvailableTasks() {
  try {
    console.log('Checking available tasks in Force Fitness...\n');
    
    // Get all tasks
    const tasksSnapshot = await db.collection('tasks')
      .orderBy('createdAt', 'desc')
      .get();
    
    const tasks = [];
    tasksSnapshot.forEach(doc => {
      const task = { id: doc.id, ...doc.data() };
      tasks.push(task);
    });
    
    console.log(`Total tasks: ${tasks.length}\n`);
    
    // Filter available tasks (pending status, not claimed)
    const availableTasks = tasks.filter(task => 
      task.status === 'pending' && 
      !task.claimedBy &&
      task.assignee === 'ai_agent'
    );
    
    console.log(`Available AI Agent tasks: ${availableTasks.length}\n`);
    
    if (availableTasks.length > 0) {
      console.log('Available tasks for AI agents:');
      console.log('================================\n');
      
      availableTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title}`);
        console.log(`   Priority: ${task.priority}`);
        console.log(`   Description: ${task.description.substring(0, 100)}...`);
        console.log(`   Tags: ${task.tags ? task.tags.join(', ') : 'None'}`);
        console.log(`   ID: ${task.id}`);
        console.log('');
      });
    } else {
      console.log('No available tasks for AI agents at the moment.');
    }
    
    // Show in-progress tasks
    const inProgressTasks = tasks.filter(task => 
      task.status === 'in_progress' || task.status === 'review'
    );
    
    if (inProgressTasks.length > 0) {
      console.log('\nCurrently in progress:');
      console.log('======================\n');
      
      inProgressTasks.forEach(task => {
        console.log(`- ${task.title} (claimed by: ${task.claimedBy || 'unknown'})`);
      });
    }
    
    // Show completed tasks
    const completedTasks = tasks.filter(task => 
      task.status === 'completed'
    );
    
    console.log(`\nCompleted tasks: ${completedTasks.length}`);
    
    if (completedTasks.length > 0) {
      console.log('\nRecently completed:');
      console.log('===================\n');
      
      completedTasks.slice(0, 5).forEach(task => {
        console.log(`- ${task.title}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking tasks:', error);
  }
  
  process.exit(0);
}

checkAvailableTasks();