import { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { Calendar, User, Bot, Clock, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  currentUser: string | null;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onPriorityChange: (taskId: string, priority: TaskPriority) => void;
  onEdit: (task: Task) => void;
  onClaim: (taskId: string) => void;
  onUnclaim: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors: Record<TaskStatus, string> = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  released: 'bg-indigo-100 text-indigo-800',
};

export default function TaskCard({ task, currentUser, onStatusChange, onPriorityChange, onEdit, onClaim, onUnclaim, onDelete }: TaskCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isClaimedByCurrentUser = task.claimedBy === currentUser;
  const isClaimed = !!task.claimedBy;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow relative ${
      isClaimed ? 'border-blue-300' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div 
        className="relative mb-4"
        onMouseEnter={() => setShowFullDescription(true)}
        onMouseLeave={() => setShowFullDescription(false)}
      >
        <p className="text-gray-600 truncate">
          {task.description}
        </p>
        {showFullDescription && task.description.length > 50 && (
          <div className="absolute z-10 top-0 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg p-3 mt-6">
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          {task.assignee === 'ai_agent' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          <span>{task.assignee === 'ai_agent' ? 'AI Agent' : 'Human'}</span>
        </div>
        {task.claimedBy && (
          <div className="flex items-center gap-1 text-blue-600">
            <Lock className="w-4 h-4" />
            <span>Claimed by {task.claimedBy}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{format(task.createdAt, 'MMM d, yyyy')}</span>
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {!isClaimed && task.status === 'pending' && (
            <button
              onClick={() => onClaim(task.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Claim Task
            </button>
          )}
          {isClaimedByCurrentUser && (
            <button
              onClick={() => onUnclaim(task.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Release Task
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isClaimed && !isClaimedByCurrentUser}
          >
            Edit
          </button>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isClaimed && !isClaimedByCurrentUser}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="released">Released</option>
          </select>
          <select
            value={task.priority}
            onChange={(e) => onPriorityChange(task.id, e.target.value as TaskPriority)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isClaimed && !isClaimedByCurrentUser}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDelete(task.id);
            }
          }}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}