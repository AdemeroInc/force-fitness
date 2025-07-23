#!/usr/bin/env node

/**
 * Release tasks that have been in review status for too long
 */

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);

async function releaseStaleTasks() {
  console.log('🔍 Checking for stale tasks to release...\n');
  
  try {
    // Find all tasks in review status
    const tasksSnapshot = await db.collection('tasks')
      .where('status', '==', 'review')
      .get();
    
    if (tasksSnapshot.empty) {
      console.log('✅ No tasks in review status');
      return;
    }
    
    const staleTasks = [];
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000); // 2 hours in milliseconds
    
    tasksSnapshot.forEach(doc => {
      const task = doc.data();
      const claimedAt = task.claimedAt?.toDate();
      
      if (claimedAt && claimedAt.getTime() < twoHoursAgo) {
        staleTasks.push({
          id: doc.id,
          title: task.title,
          claimedBy: task.claimedBy,
          claimedAt: claimedAt,
          hoursAgo: (Date.now() - claimedAt.getTime()) / (1000 * 60 * 60)
        });
      }
    });
    
    if (staleTasks.length === 0) {
      console.log('✅ No stale tasks found (all tasks in review < 2 hours)');
      return;
    }
    
    console.log(`Found ${staleTasks.length} stale tasks to release:\n`);
    
    // Release each stale task
    for (const task of staleTasks) {
      console.log(`🔓 Releasing: ${task.title}`);
      console.log(`   Claimed by: ${task.claimedBy}`);
      console.log(`   Time in review: ${task.hoursAgo.toFixed(1)} hours`);
      
      await db.collection('tasks').doc(task.id).update({
        status: 'pending',
        claimedBy: null,
        claimedAt: null,
        releasedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        metadata: {
          previousClaimBy: task.claimedBy,
          releaseReason: 'stale_review',
          hoursInReview: task.hoursAgo.toFixed(1)
        }
      });
      
      console.log(`   ✅ Released successfully\n`);
    }
    
    console.log(`\n🎉 Released ${staleTasks.length} stale tasks back to pending status`);
    
  } catch (error) {
    console.error('❌ Error releasing tasks:', error);
  }
}

// Run the script
releaseStaleTasks().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});