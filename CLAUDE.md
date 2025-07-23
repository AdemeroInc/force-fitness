# Force Fitness - Coding Standards & Guidelines

## 📋 Project Overview
A modern fitness tracking application built with Next.js, Firebase, and exceptional UI/UX design principles.

## 🎯 IMPORTANT: Task Management System
You should always be working through all the tasks in the built-in task management system (admin feature) until they're completed. Check the admin dashboard at `/admin/tasks` to see pending tasks, claim tasks assigned to AI agents, and work through them systematically.

## 🎯 Code Quality Standards

### File & Function Size Limits
- **Files**: 800-1000 lines maximum
- **Functions**: 50-100 lines maximum 
- **Priority**: Pretty code over everything else - if it's not pretty, it's garbage

### Performance Requirements
- **Complexity**: O(n) or better for all algorithms
- **Rendering**: SSR (Server-Side Rendering) targeted in Next.js
- **Bundle**: Optimize for minimal JavaScript delivery

### UI/UX Standards
- **Framework**: Tailwind CSS for all styling
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for smooth interactions
- **Design**: Clean, modern, accessible interface
- **No AI Images**: Never use dynamic AI image generation - only static assets

## 🛠 Technology Stack

### Core Framework
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **React 18** with SSR optimization

### Backend & Database
- **Firebase App Hosting** for deployment
- **Firestore** for real-time database
- **Firebase Auth** for user management
- **Firebase Storage** for file uploads

### UI & Styling
- **Tailwind CSS** for utility-first styling
- **Lucide React** for icons
- **Framer Motion** for animations
- **Responsive Design** mobile-first approach

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type checking
- **Firebase CLI** for deployment

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (SSR optimized)
│   ├── auth/              # Authentication pages
│   ├── workouts/          # Workout tracking
│   └── goals/             # Goal management
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── firebase.ts       # Firebase configuration
│   ├── utils.ts          # Helper functions
│   └── hooks/            # Custom React hooks
└── styles/               # Global styles
```

## 🎨 Component Guidelines

### Component Structure
```typescript
// Component should be 50-100 lines max
interface ComponentProps {
  // Props with clear types
}

export default function Component({ prop }: ComponentProps) {
  // Hooks at top
  // Event handlers (max 10-15 lines each)
  // Render logic (clean JSX)
}
```

### Styling Standards
- Use Tailwind utility classes
- Create custom components for repeated patterns
- Maintain consistent spacing scale
- Follow mobile-first responsive design

### Animation Guidelines
- Use Framer Motion for page transitions
- Subtle micro-interactions for better UX
- Performance-first animation approach
- Respect user's motion preferences

## 🔧 Development Rules

### Function Complexity
- Keep functions under 50-100 lines
- Single responsibility principle
- Pure functions when possible
- Clear, descriptive naming

### File Organization
- Group related functionality
- Separate concerns clearly
- Use barrel exports (index.ts)
- Keep imports organized

### Performance Optimization
- Leverage Next.js SSR capabilities
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets

## 🚀 Google Services Integration

### Firebase Project Configuration
- **Project ID**: `force-fitness-1753281211`
- **Environment**: Production Firebase project
- **Hosting**: Firebase App Hosting (not traditional Firebase Hosting)
- **Region**: Multi-region deployment

### Authentication Setup
- **Client Config**: Environment variables in `.env.local`
- **Admin Operations**: Use `gcloud auth application-default login`
- **Admin Scripts**: Firebase Admin SDK with application default credentials
- **User Permissions**: Admin access requires `@ademero.com` email domain

### Database (Firestore)
- **Collections**: `tasks`, `users`, `conversations`, `messages`, `workouts`, `mealPlans`, `progress`, `analytics`
- **Task Schema**: Includes `claimedBy`, `claimedAt` fields for AI agent task management
- **Security Rules**: Admin-only access for task management, user-specific access for personal data
- **Timestamp Handling**: Always use `serverTimestamp()` for server operations, convert to Date objects in client
- **Batch Operations**: Use Firebase Admin SDK batch writes for multiple document operations

### Development Authentication
```bash
# Required setup for server-side Firebase operations
gcloud config set project force-fitness-1753281211
gcloud auth application-default login
npm install firebase-admin  # For server-side scripts
```

### Client-Side Firebase
```typescript
// Use React Firebase Hooks for authentication state
import { useAuthState } from 'react-firebase-hooks/auth';

// Service pattern for database operations
const taskService = {
  claimTask: async (taskId: string, claimedBy: string) => {
    // Updates task status to in_progress and sets claimedBy/claimedAt
  },
  getClaimedTasks: async (claimedBy: string) => {
    // Gets tasks claimed by specific AI agent or user
  }
};
```

### Task Management Schema
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'released';
  assignee: 'ai_agent' | 'human' | 'any';
  assignedTo?: string;
  claimedBy?: string;    // Who claimed the task
  claimedAt?: Date;      // When task was claimed
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

### Storage
- **Profile Images**: User profile photo uploads
- **Progress Photos**: Body transformation tracking
- **File Validation**: Size limits and type restrictions
- **Progressive Loading**: Optimized image delivery

## 📱 Responsive Design

### Breakpoint Strategy
- Mobile-first approach
- Use Tailwind's responsive prefixes
- Test on multiple device sizes
- Ensure touch-friendly interactions

### Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility

## 🧪 Testing Strategy

### Unit Testing
- Test utility functions
- Component behavior testing
- Firebase integration testing

### Performance Testing
- Core Web Vitals monitoring
- Bundle size analysis
- SSR performance metrics

## 📚 Best Practices

### Code Style
- Consistent formatting with Prettier
- Meaningful variable names
- Clear component hierarchy
- Proper TypeScript usage

### Git Workflow
- Descriptive commit messages
- Feature branch development
- Code review process
- Automated deployment pipeline

### Documentation
- Component prop documentation
- API endpoint documentation
- Setup and deployment guides
- Code comments for complex logic

## 🎯 Current Implementation Status

### Completed Features
- ✅ Next.js project setup with TypeScript
- ✅ Firebase integration (Auth, Firestore, Storage)
- ✅ Basic authentication components
- ✅ Workout and goals pages
- ✅ Responsive navigation
- ✅ Firebase App Hosting deployment

### Pending Enhancements
- 🔄 Lucide React icons integration
- 🔄 Framer Motion animations
- 🔄 Enhanced UI design with Tailwind
- 🔄 SSR optimization
- 🔄 Component refactoring for size limits

## 📝 Notes

Remember: **Pretty code is the priority**. Every component, function, and file should be clean, readable, and maintainable. If it doesn't look good, refactor it until it does.