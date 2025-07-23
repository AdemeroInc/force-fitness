#!/usr/bin/env node

/**
 * Force Fitness - Comprehensive Task Status Report
 * Provides detailed analysis of tasks in Firebase database
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function generateTaskStatusReport() {
  try {
    console.log('🔍 Generating comprehensive task status report for Force Fitness...\n');
    console.log('=' .repeat(70));
    console.log('                    FIREBASE TASK STATUS REPORT');
    console.log('=' .repeat(70));
    
    // Fetch all tasks
    const tasksSnapshot = await db.collection('tasks').get();
    const allTasks = [];
    
    tasksSnapshot.forEach(doc => {
      const data = doc.data();
      allTasks.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        dueDate: data.dueDate?.toDate()
      });
    });

    // 1. Overall Summary
    console.log('\n📊 OVERALL SUMMARY');
    console.log('-' .repeat(20));
    console.log(`Total Tasks: ${allTasks.length}`);
    
    // Count by status
    const statusCounts = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      other: 0
    };
    
    allTasks.forEach(task => {
      if (statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++;
      } else {
        statusCounts.other++;
      }
    });
    
    console.log(`├─ Pending: ${statusCounts.pending}`);
    console.log(`├─ In Progress: ${statusCounts.in_progress}`);
    console.log(`├─ Completed: ${statusCounts.completed}`);
    if (statusCounts.other > 0) {
      console.log(`└─ Other Status: ${statusCounts.other}`);
    }

    // 2. Unclaimed Tasks Analysis
    const pendingTasks = allTasks.filter(task => task.status === 'pending');
    const unclaimedTasks = pendingTasks.filter(task => !task.claimedBy);
    
    console.log('\n🎯 UNCLAIMED TASKS ANALYSIS');
    console.log('-' .repeat(30));
    console.log(`Total Pending Tasks: ${pendingTasks.length}`);
    console.log(`Unclaimed Tasks: ${unclaimedTasks.length}`);
    console.log(`Claimed But Pending: ${pendingTasks.length - unclaimedTasks.length}`);

    // 3. Detailed Unclaimed Tasks List
    if (unclaimedTasks.length > 0) {
      console.log('\n📋 UNCLAIMED TASKS DETAILS');
      console.log('-' .repeat(30));
      
      // Sort by priority and creation date
      const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
      unclaimedTasks.sort((a, b) => {
        const priorityDiff = (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5);
        if (priorityDiff !== 0) return priorityDiff;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
      
      unclaimedTasks.forEach((task, index) => {
        const priorityEmoji = {
          'urgent': '🔴',
          'high': '🟠', 
          'medium': '🟡',
          'low': '🟢'
        }[task.priority] || '⚪';
        
        console.log(`\n${index + 1}. ${priorityEmoji} ${task.title}`);
        console.log(`   ID: ${task.id}`);
        console.log(`   Priority: ${task.priority?.toUpperCase() || 'UNSET'}`);
        console.log(`   Assignee: ${task.assignee || 'UNASSIGNED'}`);
        
        if (task.tags && task.tags.length > 0) {
          console.log(`   Tags: ${task.tags.join(', ')}`);
        }
        
        if (task.dueDate) {
          const isOverdue = task.dueDate < new Date();
          const dueDateStr = task.dueDate.toLocaleDateString();
          console.log(`   Due Date: ${dueDateStr} ${isOverdue ? '⚠️ OVERDUE' : ''}`);
        }
        
        if (task.createdAt) {
          const daysAgo = Math.floor((new Date() - task.createdAt) / (1000 * 60 * 60 * 24));
          console.log(`   Created: ${task.createdAt.toLocaleDateString()} (${daysAgo} days ago)`);
        }
        
        if (task.description) {
          const shortDesc = task.description.length > 80 
            ? task.description.substring(0, 80) + '...' 
            : task.description;
          console.log(`   Description: ${shortDesc}`);
        }
      });
    } else {
      console.log('\n✅ All pending tasks are currently claimed!');
    }

    // 4. Tasks In Progress
    const inProgressTasks = allTasks.filter(task => task.status === 'in_progress');
    if (inProgressTasks.length > 0) {
      console.log('\n🚧 TASKS IN PROGRESS');
      console.log('-' .repeat(25));
      
      inProgressTasks.forEach((task, index) => {
        console.log(`\n${index + 1}. ${task.title}`);
        console.log(`   Claimed by: ${task.claimedBy || 'UNKNOWN'}`);
        console.log(`   Priority: ${task.priority?.toUpperCase() || 'UNSET'}`);
        
        if (task.updatedAt) {
          const hoursAgo = Math.floor((new Date() - task.updatedAt) / (1000 * 60 * 60));
          console.log(`   Last updated: ${hoursAgo} hours ago`);
        }
      });
    }

    // 5. Priority Distribution
    console.log('\n📈 PRIORITY DISTRIBUTION');
    console.log('-' .repeat(25));
    
    const priorityDistribution = {};
    allTasks.forEach(task => {
      const priority = task.priority || 'unset';
      priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
    });
    
    const priorityOrderForDisplay = { urgent: 1, high: 2, medium: 3, low: 4 };
    Object.entries(priorityDistribution)
      .sort(([a], [b]) => (priorityOrderForDisplay[a] || 5) - (priorityOrderForDisplay[b] || 5))
      .forEach(([priority, count]) => {
        const emoji = {
          'urgent': '🔴',
          'high': '🟠', 
          'medium': '🟡',
          'low': '🟢',
          'unset': '⚪'
        }[priority] || '⚪';
        console.log(`${emoji} ${priority.toUpperCase()}: ${count} tasks`);
      });

    // 6. Assignee Distribution
    console.log('\n👥 ASSIGNEE DISTRIBUTION');
    console.log('-' .repeat(25));
    
    const assigneeDistribution = {};
    allTasks.forEach(task => {
      const assignee = task.assignee || 'unassigned';
      assigneeDistribution[assignee] = (assigneeDistribution[assignee] || 0) + 1;
    });
    
    Object.entries(assigneeDistribution)
      .sort(([, a], [, b]) => b - a)
      .forEach(([assignee, count]) => {
        console.log(`${assignee}: ${count} tasks`);
      });

    // 7. Recent Activity
    const recentTasks = allTasks
      .filter(task => task.updatedAt || task.createdAt)
      .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
      .slice(0, 5);
    
    if (recentTasks.length > 0) {
      console.log('\n🕒 RECENT ACTIVITY (Last 5 Updates)');
      console.log('-' .repeat(35));
      
      recentTasks.forEach((task, index) => {
        const lastActivity = task.updatedAt || task.createdAt;
        const timeAgo = Math.floor((new Date() - lastActivity) / (1000 * 60 * 60));
        const statusEmoji = {
          'pending': '⏳',
          'in_progress': '🚧',
          'completed': '✅'
        }[task.status] || '❓';
        
        console.log(`${index + 1}. ${statusEmoji} ${task.title}`);
        console.log(`   Status: ${task.status} | ${timeAgo} hours ago`);
      });
    }

    console.log('\n' + '=' .repeat(70));
    console.log('                         END OF REPORT');
    console.log('=' .repeat(70));
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error generating task status report:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the report
generateTaskStatusReport();