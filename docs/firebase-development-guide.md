# Firebase Development Guide

## Overview

This guide covers Firebase and Firestore interaction patterns for Force Fitness development, including both client-side and server-side operations, authentication patterns, and best practices for AI agents and human developers.

## 🔧 Development Setup

### Prerequisites

1. **Node.js Environment**: Ensure Node.js 18+ is installed
2. **Firebase CLI**: Install with `npm install -g firebase-tools`
3. **Project Access**: Authenticated access to `force-fitness-1753281211` project
4. **Development Server**: Next.js dev server running on port 3001

### Authentication Setup

#### For Client-Side Development
```bash
# Credentials are in .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCL_snsu3sNg2LP4oTkmFN6RSxuPr2S9Jw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=force-fitness-1753281211.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=force-fitness-1753281211
```

#### For Server-Side/Admin Development
```bash
# Set correct gcloud project
gcloud config set project force-fitness-1753281211

# Authenticate for Application Default Credentials
gcloud auth application-default login

# Install Firebase Admin SDK
npm install firebase-admin
```

## 📊 Database Structure

### Current Collections

#### `tasks` Collection
Primary collection for task management system:
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'released';
  assignee: 'ai_agent' | 'human' | 'any';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  releasedAt?: Date;
  tags: string[];
  dependencies?: string[];
  createdBy: string;
  metadata?: Record<string, any>;
}
```

#### Planned Collections
- `users/{userId}` - User profiles and settings
- `conversations/{conversationId}` - AI coaching chat sessions  
- `messages/{messageId}` - Individual chat messages
- `workouts/{workoutId}` - Generated workout plans
- `mealPlans/{mealPlanId}` - Generated meal plans
- `progress/{progressId}` - User progress entries
- `analytics/{analyticsId}` - Usage and performance data

## 🔥 Client-Side Firebase Integration

### Basic Setup

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Service Pattern (Recommended)

Create service classes for each major feature:

```typescript
// src/lib/services/taskService.ts
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

const TASKS_COLLECTION = 'tasks';

export const taskService = {
  // Read operations
  async getAllTasks(): Promise<Task[]> {
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to JavaScript Date objects
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      dueDate: doc.data().dueDate?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
      releasedAt: doc.data().releasedAt?.toDate(),
    } as Task));
  },

  // Create operations
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const taskData = {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Convert Date objects to Firestore timestamps
      dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
    };
    
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
    return docRef.id;
  },

  // Update operations
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    // Handle date conversions
    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(updates.dueDate);
    }

    // Auto-set completion timestamps
    if (updates.status === 'completed' && !updates.completedAt) {
      updateData.completedAt = serverTimestamp();
    }

    if (updates.status === 'released' && !updates.releasedAt) {
      updateData.releasedAt = serverTimestamp();
    }

    await updateDoc(taskRef, updateData);
  },

  // Delete operations
  async deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
  },
};
```

### Authentication Patterns

```typescript
// src/lib/hooks/useAuth.ts
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, loading, error] = useAuthState(auth);
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    // Admin check for @ademero.com emails
    isAdmin: user?.email?.endsWith('@ademero.com') || false
  };
}
```

### Real-time Data Patterns

```typescript
// Real-time listener example
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';

const useRealtimeTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tasksQuery = query(
      collection(db, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Task));
      
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return { tasks, loading };
};
```

## 🔑 Server-Side Firebase Admin Integration

### Admin SDK Setup

```javascript
// scripts/firebase-admin-script.js
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize with application default credentials
const app = initializeApp({
  credential: applicationDefault(),
  projectId: 'force-fitness-1753281211'
});

const db = getFirestore(app);
```

### Batch Operations

```javascript
// Efficient batch writes for multiple documents
async function createMultipleTasks(tasks) {
  const batch = db.batch();
  
  for (const task of tasks) {
    const taskRef = db.collection('tasks').doc();
    const taskData = {
      ...task,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    batch.set(taskRef, taskData);
  }
  
  await batch.commit();
}
```

### Admin Authentication Requirements

```bash
# Required setup for server-side operations
gcloud config set project force-fitness-1753281211
gcloud auth application-default login
```

## 🔐 Security Rules

### Current Firestore Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tasks collection - Admin only for now
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email.matches('.*@ademero\\.com$');
    }
    
    // Future user data rules
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId || 
        request.auth.token.email.matches('.*@ademero\\.com$');
    }
  }
}
```

## 📝 Common Patterns for AI Agents

### Task Management Workflow

```typescript
// 1. Pick up a task
const pickupTask = async (taskId: string, agentId: string) => {
  await taskService.updateTask(taskId, {
    status: 'in_progress',
    assignedTo: agentId,
    updatedAt: new Date()
  });
};

// 2. Update task progress
const updateProgress = async (taskId: string, metadata: any) => {
  await taskService.updateTask(taskId, {
    metadata: {
      ...metadata,
      lastActivity: new Date().toISOString()
    }
  });
};

// 3. Complete task
const completeTask = async (taskId: string, results: any) => {
  await taskService.updateTask(taskId, {
    status: 'review',
    metadata: {
      completionResults: results,
      completedBy: 'ai_agent'
    }
  });
};
```

### Data Validation Patterns

```typescript
// Always validate data before Firebase operations
const validateTaskData = (task: Partial<Task>): boolean => {
  if (!task.title || task.title.trim().length === 0) return false;
  if (!task.description || task.description.trim().length === 0) return false;
  if (!['urgent', 'high', 'medium', 'low'].includes(task.priority)) return false;
  if (!['ai_agent', 'human', 'any'].includes(task.assignee)) return false;
  return true;
};
```

## 🚀 Development Workflows

### For Frontend Development

1. **Component Development**:
   ```typescript
   // Use React hooks for Firebase data
   const [tasks, setTasks] = useState<Task[]>([]);
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
     taskService.getAllTasks()
       .then(setTasks)
       .finally(() => setLoading(false));
   }, []);
   ```

2. **Form Handling**:
   ```typescript
   const handleSubmit = async (formData: TaskFormData) => {
     try {
       await taskService.createTask(formData);
       // Refresh data or use optimistic updates
       await loadTasks();
     } catch (error) {
       console.error('Error creating task:', error);
       // Handle error state
     }
   };
   ```

### For Backend/Admin Scripts

1. **Data Migration**:
   ```javascript
   const migrateData = async () => {
     const oldTasks = await getOldTasks();
     const batch = db.batch();
     
     oldTasks.forEach(task => {
       const ref = db.collection('tasks').doc();
       batch.set(ref, transformTaskData(task));
     });
     
     await batch.commit();
   };
   ```

2. **Bulk Operations**:
   ```javascript
   const updateMultipleTasks = async (updates) => {
     const batch = db.batch();
     
     updates.forEach(({ id, data }) => {
       const ref = db.collection('tasks').doc(id);
       batch.update(ref, {
         ...data,
         updatedAt: FieldValue.serverTimestamp()
       });
     });
     
     await batch.commit();
   };
   ```

## 🐛 Error Handling Patterns

### Client-Side Error Handling

```typescript
const handleFirebaseError = (error: any) => {
  switch (error.code) {
    case 'permission-denied':
      return 'You do not have permission to perform this action';
    case 'not-found':
      return 'The requested document was not found';
    case 'already-exists':
      return 'This document already exists';
    case 'cancelled':
      return 'The operation was cancelled';
    case 'unknown':
      return 'An unknown error occurred';
    default:
      return error.message || 'An unexpected error occurred';
  }
};
```

### Retry Logic

```typescript
const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};
```

## 📊 Performance Optimization

### Query Optimization

```typescript
// Use compound indexes for complex queries
const getTasksByStatusAndPriority = async (status: TaskStatus, priority: TaskPriority) => {
  const tasksQuery = query(
    collection(db, 'tasks'),
    where('status', '==', status),
    where('priority', '==', priority),
    orderBy('createdAt', 'desc'),
    limit(50) // Always limit query results
  );
  
  return getDocs(tasksQuery);
};
```

### Pagination

```typescript
const getPaginatedTasks = async (lastDoc?: DocumentSnapshot, pageSize = 20) => {
  let tasksQuery = query(
    collection(db, 'tasks'),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  
  if (lastDoc) {
    tasksQuery = query(tasksQuery, startAfter(lastDoc));
  }
  
  return getDocs(tasksQuery);
};
```

## 🔧 Testing Firebase Integration

### Emulator Setup

```bash
# Install Firebase emulators
npm install -g firebase-tools

# Start emulators for development
firebase emulators:start --only firestore,auth

# In your test environment
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
```

### Test Patterns

```typescript
// Mock Firebase for unit tests
jest.mock('@/lib/firebase', () => ({
  db: mockFirestore,
  auth: mockAuth,
}));

// Integration test example
describe('TaskService', () => {
  beforeEach(async () => {
    // Clear emulator data
    await clearFirestoreData();
  });

  it('should create a task', async () => {
    const taskData = { title: 'Test Task', /* ... */ };
    const taskId = await taskService.createTask(taskData);
    expect(taskId).toBeDefined();
  });
});
```

## 🚨 Common Pitfalls and Solutions

### 1. Timestamp Handling
```typescript
// ❌ Wrong: Mixing Date and Timestamp objects
const task = {
  createdAt: new Date(), // Will cause validation errors
  dueDate: serverTimestamp() // Inconsistent types
};

// ✅ Correct: Use consistent timestamp handling
const task = {
  createdAt: serverTimestamp(),
  dueDate: dueDate ? Timestamp.fromDate(dueDate) : null
};
```

### 2. Security Rules Validation
```typescript
// ❌ Wrong: Assuming admin access works
await addDoc(collection(db, 'tasks'), taskData);

// ✅ Correct: Handle permission errors
try {
  await addDoc(collection(db, 'tasks'), taskData);
} catch (error) {
  if (error.code === 'permission-denied') {
    throw new Error('Admin access required');
  }
  throw error;
}
```

### 3. Data Validation
```typescript
// ❌ Wrong: No validation
const updateTask = (id: string, data: any) => {
  return updateDoc(doc(db, 'tasks', id), data);
};

// ✅ Correct: Validate before Firebase operations
const updateTask = (id: string, data: Partial<Task>) => {
  if (!validateTaskData(data)) {
    throw new Error('Invalid task data');
  }
  return updateDoc(doc(db, 'tasks', id), data);
};
```

## 🎯 Next Steps for Implementation

1. **Complete Database Schema**: Implement remaining collections
2. **Security Rules**: Update for user data access patterns
3. **Real-time Features**: Add live updates for task management
4. **Offline Support**: Implement Firestore offline persistence
5. **Performance Monitoring**: Add Firebase Performance monitoring
6. **Analytics Integration**: Connect Firebase Analytics

---

This guide provides the foundation for all Firebase/Firestore interactions in Force Fitness. Follow these patterns for consistent, secure, and performant database operations.