export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'released';
export type TaskAssignee = 'ai_agent' | 'human' | 'any';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: TaskAssignee;
  assignedTo?: string;
  claimedBy?: string;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  releasedAt?: Date;
  tags: string[];
  dependencies?: string[];
  createdBy: string;
  metadata?: Record<string, unknown>;
}