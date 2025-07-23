const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, orderBy, getDocs } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXIGLuW8Kss_dGTt3H9eOxX0oQfcLG9Uo",
  authDomain: "force-fitness-4dc2e.firebaseapp.com",
  projectId: "force-fitness-4dc2e",
  storageBucket: "force-fitness-4dc2e.firebasestorage.app",
  messagingSenderId: "493195461287",
  appId: "1:493195461287:web:9c16f973ce6fea6cf0c8d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchAITasks() {
  try {
    console.log('Fetching tasks from Force Fitness admin dashboard...\n');
    
    // Query all tasks
    const allTasksQuery = query(
      collection(db, 'tasks'),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(allTasksQuery);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      dueDate: doc.data().dueDate?.toDate(),
      claimedAt: doc.data().claimedAt?.toDate(),
    }));

    // Filter and categorize tasks
    const pendingAITasks = tasks.filter(task => 
      task.status === 'pending' && 
      (task.assignee === 'ai_agent' || task.assignee === 'any')
    );

    const claimedTasks = tasks.filter(task => 
      task.claimedBy && 
      task.status === 'in_progress'
    );

    const allTasks = tasks;

    console.log('=== TASK SUMMARY ===');
    console.log(`Total tasks: ${allTasks.length}`);
    console.log(`Pending AI/Any tasks: ${pendingAITasks.length}`);
    console.log(`Currently claimed: ${claimedTasks.length}`);
    console.log('');

    if (pendingAITasks.length > 0) {
      console.log('=== AVAILABLE TASKS FOR AI AGENTS ===\n');
      pendingAITasks.forEach(task => {
        console.log(`Task ID: ${task.id}`);
        console.log(`Title: ${task.title}`);
        console.log(`Description: ${task.description}`);
        console.log(`Priority: ${task.priority.toUpperCase()}`);
        console.log(`Assignee: ${task.assignee}`);
        console.log(`Tags: ${task.tags?.join(', ') || 'None'}`);
        console.log(`Created: ${task.createdAt?.toLocaleString() || 'Unknown'}`);
        if (task.dueDate) {
          console.log(`Due Date: ${task.dueDate.toLocaleString()}`);
        }
        console.log('---\n');
      });
    } else {
      console.log('No pending tasks available for AI agents.\n');
    }

    if (claimedTasks.length > 0) {
      console.log('=== CURRENTLY CLAIMED TASKS ===\n');
      claimedTasks.forEach(task => {
        console.log(`Task ID: ${task.id}`);
        console.log(`Title: ${task.title}`);
        console.log(`Claimed by: ${task.claimedBy}`);
        console.log(`Claimed at: ${task.claimedAt?.toLocaleString() || 'Unknown'}`);
        console.log(`Status: ${task.status}`);
        console.log('---\n');
      });
    }

    console.log('\n=== ALL TASKS (Brief Overview) ===\n');
    allTasks.forEach(task => {
      const status = task.claimedBy ? `${task.status} (claimed by ${task.claimedBy})` : task.status;
      console.log(`[${task.priority.toUpperCase()}] ${task.title} - ${status} - Assignee: ${task.assignee}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    process.exit(1);
  }
}

// Run the script
fetchAITasks();