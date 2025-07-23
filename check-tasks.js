const admin = require('firebase-admin');

async function checkTasks() {
  try {
    admin.initializeApp();
    const db = admin.firestore();
    
    const tasksRef = db.collection('tasks');
    const allTasks = await tasksRef.get();
    
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let unclaimed = 0;
    
    console.log('Task Status Summary:');
    console.log('===================');
    
    const unclaimedTasks = [];
    
    allTasks.forEach(doc => {
      const data = doc.data();
      
      switch(data.status) {
        case 'pending':
          pending++;
          if (!data.claimedBy) {
            unclaimed++;
            unclaimedTasks.push({
              title: data.title,
              priority: data.priority,
              assignee: data.assignee
            });
          }
          break;
        case 'in_progress':
          inProgress++;
          break;
        case 'completed':
          completed++;
          break;
      }
    });
    
    console.log(`Total Tasks: ${allTasks.size}`);
    console.log(`Pending: ${pending}`);
    console.log(`In Progress: ${inProgress}`);
    console.log(`Completed: ${completed}`);
    console.log(`Unclaimed: ${unclaimed}`);
    console.log('');
    
    if (unclaimed > 0) {
      console.log('Unclaimed Tasks:');
      console.log('================');
      
      unclaimedTasks.forEach(task => {
        console.log(`- [${task.priority}] ${task.title} (${task.assignee})`);
      });
    } else {
      console.log('All tasks are either claimed or completed!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTasks();
