import { taskService } from '../src/lib/services/taskService';
import { Task } from '../src/types/task';

const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'Replace User Badge with User Menu (Admin/Logout)',
  description: `CURRENT ISSUE:
- User badge/avatar in the interface needs to be converted to a proper dropdown menu
- Admin and logout functionality should be moved into this user menu
- Need better organization of user-related navigation options

REQUIREMENTS:
- Replace current user badge/avatar with clickable user menu dropdown
- Move admin access link into the user menu
- Move logout functionality into the user menu
- Add proper user menu styling and animations
- Ensure mobile responsiveness for the dropdown menu
- Add user profile information display in menu
- Include proper menu positioning and z-index handling
- Add click-outside-to-close functionality

TECHNICAL IMPLEMENTATION:
- Locate current user badge/avatar component in the navigation
- Create new UserMenu dropdown component with proper positioning
- Move admin navigation link from current location to user menu
- Move logout button from current location to user menu
- Add dropdown animation using Framer Motion or Tailwind transitions
- Implement proper menu state management (open/close)
- Add responsive design for mobile and desktop
- Test menu positioning across different screen sizes
- Ensure proper accessibility (keyboard navigation, ARIA labels)

COMPONENTS TO UPDATE:
- Navigation header component (/src/components/layout/Navigation.tsx)
- User avatar/badge component (lines 142-185)
- Admin navigation elements
- Logout functionality
- Mobile navigation if applicable`,
  priority: 'medium',
  status: 'pending',
  assignee: 'ai_agent',
  assignedTo: undefined,
  claimedBy: undefined,
  claimedAt: undefined,
  dueDate: undefined,
  completedAt: undefined,
  releasedAt: undefined,
  tags: ['frontend', 'ui-ux', 'navigation', 'user-menu', 'responsive'],
  dependencies: undefined,
  createdBy: 'system',
  metadata: {
    complexity: 'medium',
    estimatedHours: 4,
    affectedFiles: [
      '/src/components/layout/Navigation.tsx',
      '/src/components/ui/UserMenu.tsx (new)',
    ]
  }
};

async function createTask() {
  try {
    const taskId = await taskService.createTask(taskData);
    console.log('✅ Task created successfully!');
    console.log(`📋 Task ID: ${taskId}`);
    console.log(`🏷️  Title: ${taskData.title}`);
    console.log(`⚡ Priority: ${taskData.priority}`);
    console.log(`👤 Assignee: ${taskData.assignee}`);
    console.log(`🏷️  Tags: ${taskData.tags.join(', ')}`);
    return taskId;
  } catch (error) {
    console.error('❌ Error creating task:', error);
    throw error;
  }
}

// Execute the task creation
createTask()
  .then(() => {
    console.log('\n🎉 Task creation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to create task:', error);
    process.exit(1);
  });