const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, orderBy, getDocs } = require('firebase/firestore');

// Firebase configuration from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "force-fitness-1753281211.firebaseapp.com",
  projectId: "force-fitness-1753281211",
  storageBucket: "force-fitness-1753281211.firebasestorage.app",
  messagingSenderId: "77830233576",
  appId: "1:77830233576:web:0440ebd1d36e295fb1d85d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkCurrentTasks() {
  try {
    console.log('Checking tasks in Force Fitness admin dashboard...\n');
    
    // Query all tasks
    const allTasksQuery = query(
      collection(db, 'tasks'),
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
      completedAt: doc.data().completedAt?.toDate(),
    }));

    // Filter and categorize tasks
    const availableAITasks = tasks.filter(task => 
      task.status === 'pending' && 
      !task.claimedBy &&
      (task.assignee === 'ai_agent' || task.assignee === 'any')
    );

    const inProgressTasks = tasks.filter(task => 
      task.status === 'in_progress' || task.status === 'review'
    );

    const completedTasks = tasks.filter(task => 
      task.status === 'completed'
    );

    console.log('=== TASK SUMMARY ===');
    console.log(`Total tasks: ${tasks.length}`);
    console.log(`Available for AI: ${availableAITasks.length}`);
    console.log(`In Progress: ${inProgressTasks.length}`);
    console.log(`Completed: ${completedTasks.length}`);
    console.log('');

    if (availableAITasks.length > 0) {
      console.log('=== AVAILABLE TASKS FOR AI AGENTS ===\n');
      availableAITasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title}`);
        console.log(`   ID: ${task.id}`);
        console.log(`   Priority: ${task.priority.toUpperCase()}`);
        console.log(`   Description: ${task.description}`);
        console.log(`   Tags: ${task.tags?.join(', ') || 'None'}`);
        console.log(`   Created: ${task.createdAt?.toLocaleString() || 'Unknown'}`);
        if (task.dueDate) {
          console.log(`   Due Date: ${task.dueDate.toLocaleString()}`);
        }
        console.log('');
      });
    } else {
      console.log('No available tasks for AI agents at the moment.\n');
    }

    if (inProgressTasks.length > 0) {
      console.log('=== CURRENTLY IN PROGRESS ===\n');
      inProgressTasks.forEach(task => {
        const timeSinceClaim = task.claimedAt ? 
          Math.floor((new Date() - task.claimedAt) / (1000 * 60)) + ' minutes ago' : 
          'Unknown';
        console.log(`- ${task.title}`);
        console.log(`  Claimed by: ${task.claimedBy || 'Unknown'}`);
        console.log(`  Claimed: ${timeSinceClaim}`);
        console.log(`  Status: ${task.status}`);
        console.log('');
      });
    }

    if (completedTasks.length > 0) {
      console.log('=== RECENTLY COMPLETED ===\n');
      completedTasks.slice(0, 5).forEach(task => {
        console.log(`- ${task.title}`);
        if (task.completedAt) {
          console.log(`  Completed: ${task.completedAt.toLocaleString()}`);
        }
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    process.exit(1);
  }
}

// Run the script
checkCurrentTasks();