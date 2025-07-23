const admin = require('firebase-admin');

// Initialize Firebase Admin  
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function completeTask() {
  try {
    console.log('Looking for AI Coaching task...');
    
    const tasksRef = db.collection('tasks');
    const query = await tasksRef.where('title', '==', 'Improve AI Coaching with Dynamic Responses and Streaming').get();
    
    if (!query.empty) {
      const taskDoc = query.docs[0];
      const taskData = taskDoc.data();
      
      console.log('Found task:', taskData.title);
      console.log('Current status:', taskData.status);
      
      await taskDoc.ref.update({
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        claimedBy: null,
        claimedAt: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('Task marked as completed successfully!');
      console.log('AI Coaching improvements are now live!');
      
    } else {
      console.log('Task not found');
      
      const allTasks = await tasksRef.limit(5).get();
      console.log('Available tasks:');
      allTasks.forEach(doc => {
        const data = doc.data();
        console.log(`- ${data.title} (${data.status})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error completing task:', error);
    process.exit(1);
  }
}

completeTask();