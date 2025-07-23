const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, query, where, orderBy, getDocs, doc, updateDoc, serverTimestamp } = require('firebase/firestore');
const readline = require('readline');

// Firebase configuration from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyCL_snsu3sNg2LP4oTkmFN6RSxuPr2S9Jw",
  authDomain: "force-fitness-1753281211.firebaseapp.com",
  projectId: "force-fitness-1753281211",
  storageBucket: "force-fitness-1753281211.firebasestorage.app",
  messagingSenderId: "77830233576",
  appId: "1:77830233576:web:0440ebd1d36e295fb1d85d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function checkAndWorkOnTasks() {
  try {
    // Get admin credentials
    console.log('=== Force Fitness Admin Task Manager ===\n');
    const email = await question('Enter admin email: ');
    const password = await question('Enter password: ');
    
    console.log('\nSigning in...');
    
    // Sign in with email/password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`Signed in as: ${user.email}\n`);
    
    // Check if user is admin
    if (!user.email.endsWith('@ademero.com')) {
      console.log('Error: You must be an admin to access tasks.');
      process.exit(1);
    }
    
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

    // Sort available tasks by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    availableAITasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    console.log('=== TASK SUMMARY ===');
    console.log(`Total tasks: ${tasks.length}`);
    console.log(`Available for AI: ${availableAITasks.length}`);
    console.log(`In Progress: ${inProgressTasks.length}`);
    console.log(`Completed: ${completedTasks.length}`);
    console.log('');

    if (availableAITasks.length > 0) {
      console.log('=== AVAILABLE TASKS FOR AI AGENTS (Sorted by Priority) ===\n');
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

      // Ask if user wants to claim a task
      const claimChoice = await question('\nWould you like to claim a task? (y/n): ');
      
      if (claimChoice.toLowerCase() === 'y') {
        const taskNumber = await question('Enter task number to claim: ');
        const taskIndex = parseInt(taskNumber) - 1;
        
        if (taskIndex >= 0 && taskIndex < availableAITasks.length) {
          const taskToClaim = availableAITasks[taskIndex];
          const agentName = await question('Enter agent name (e.g., "Claude Agent 1"): ');
          
          // Claim the task
          const taskRef = doc(db, 'tasks', taskToClaim.id);
          await updateDoc(taskRef, {
            claimedBy: agentName,
            claimedAt: serverTimestamp(),
            status: 'in_progress',
            updatedAt: serverTimestamp(),
          });
          
          console.log(`\n✅ Successfully claimed task: "${taskToClaim.title}"`);
          console.log(`Claimed by: ${agentName}`);
        } else {
          console.log('Invalid task number.');
        }
      }
    } else {
      console.log('No available tasks for AI agents at the moment.\n');
    }

    if (inProgressTasks.length > 0) {
      console.log('\n=== CURRENTLY IN PROGRESS ===\n');
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

    // Check for stale tasks
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const staleTasks = inProgressTasks.filter(task => 
      task.claimedBy && 
      task.claimedAt && 
      new Date(task.claimedAt) < twoHoursAgo
    );

    if (staleTasks.length > 0) {
      console.log('\n⚠️  WARNING: Found stale tasks claimed over 2 hours ago:');
      staleTasks.forEach(task => {
        console.log(`- "${task.title}" claimed by ${task.claimedBy}`);
      });
      
      const releaseChoice = await question('\nRelease stale tasks? (y/n): ');
      if (releaseChoice.toLowerCase() === 'y') {
        for (const task of staleTasks) {
          const taskRef = doc(db, 'tasks', task.id);
          await updateDoc(taskRef, {
            claimedBy: null,
            claimedAt: null,
            status: 'pending',
            updatedAt: serverTimestamp(),
          });
          console.log(`Released: "${task.title}"`);
        }
      }
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Run the script
checkAndWorkOnTasks();