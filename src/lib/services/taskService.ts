import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  FieldValue,
  UpdateData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

const TASKS_COLLECTION = 'tasks';

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      dueDate: doc.data().dueDate?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
      releasedAt: doc.data().releasedAt?.toDate(),
      claimedAt: doc.data().claimedAt?.toDate(),
    } as Task));
  },

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where('status', '==', status),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      dueDate: doc.data().dueDate?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
      releasedAt: doc.data().releasedAt?.toDate(),
      claimedAt: doc.data().claimedAt?.toDate(),
    } as Task));
  },

  async getTask(taskId: string): Promise<Task | null> {
    const taskDoc = await getDoc(doc(db, TASKS_COLLECTION, taskId));
    if (!taskDoc.exists()) return null;
    
    return {
      id: taskDoc.id,
      ...taskDoc.data(),
      createdAt: taskDoc.data().createdAt?.toDate(),
      updatedAt: taskDoc.data().updatedAt?.toDate(),
      dueDate: taskDoc.data().dueDate?.toDate(),
      completedAt: taskDoc.data().completedAt?.toDate(),
      releasedAt: taskDoc.data().releasedAt?.toDate(),
      claimedAt: taskDoc.data().claimedAt?.toDate(),
    } as Task;
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const taskData = {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
    };
    
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
    return docRef.id;
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const updateData: UpdateData<Task> = {
      updatedAt: serverTimestamp(),
    };

    // Copy allowed fields from updates
    const allowedFields: (keyof Task)[] = ['title', 'description', 'status', 'priority', 'assignedTo', 'tags', 'dueDate', 'completedAt', 'releasedAt', 'claimedBy', 'claimedAt', 'assignee', 'metadata'];
    for (const field of allowedFields) {
      if (field in updates && updates[field] !== undefined) {
        updateData[field] = updates[field] as FieldValue;
      }
    }

    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(updates.dueDate);
    }

    if (updates.status === 'completed' && !updates.completedAt) {
      updateData.completedAt = serverTimestamp();
    }

    if (updates.status === 'released' && !updates.releasedAt) {
      updateData.releasedAt = serverTimestamp();
    }

    await updateDoc(taskRef, updateData);
  },

  async deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
  },

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    const updates: Partial<Task> = { status };
    
    if (status === 'completed') {
      updates.completedAt = new Date();
    } else if (status === 'released') {
      updates.releasedAt = new Date();
    }
    
    await this.updateTask(taskId, updates);
  },

  async updateTaskPriority(taskId: string, priority: TaskPriority): Promise<void> {
    await this.updateTask(taskId, { priority });
  },

  async claimTask(taskId: string, claimedBy: string): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, {
      claimedBy,
      claimedAt: serverTimestamp(),
      status: 'in_progress',
      updatedAt: serverTimestamp(),
    });
  },

  async unclaimTask(taskId: string): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, {
      claimedBy: null,
      claimedAt: null,
      status: 'pending',
      updatedAt: serverTimestamp(),
    });
  },

  async getClaimedTasks(claimedBy: string): Promise<Task[]> {
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where('claimedBy', '==', claimedBy),
      where('status', 'in', ['in_progress', 'review']),
      orderBy('claimedAt', 'desc')
    );
    
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      dueDate: doc.data().dueDate?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
      releasedAt: doc.data().releasedAt?.toDate(),
      claimedAt: doc.data().claimedAt?.toDate(),
    } as Task));
  },
};