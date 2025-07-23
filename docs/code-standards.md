# Code Standards & Development Practices

## Overview

Force Fitness maintains exceptionally high code quality standards. Every line of code should be clean, readable, and beautiful. These standards ensure maintainability, scalability, and team collaboration excellence.

## 🎯 Core Principles

**"Pretty is the priority over everything else."**

1. **Readability First**: Code should tell a story
2. **Consistency**: Uniform patterns across the codebase
3. **Performance**: Efficient and optimized implementations
4. **Maintainability**: Easy to modify and extend
5. **Documentation**: Self-documenting code with clear comments when needed

## 📏 File & Function Guidelines

### File Size Standards
- **Target**: 800-1000 lines per file maximum
- **Rationale**: Manageable chunks that fit in memory
- **Exception**: Complex components may exceed if logical

### Function Size Standards
- **Target**: 50-100 lines maximum per function
- **Rationale**: Single responsibility, easy testing
- **Exception**: Pure data transformations may be longer

### When to Split Files
```typescript
// ❌ Bad: Everything in one massive file
export const AuthPage = () => {
  // 1500+ lines of component logic, styles, and utilities
};

// ✅ Good: Logical separation
// auth/page.tsx - Main component (150 lines)
export const AuthPage = () => {
  return <AuthForm onSuccess={handleSuccess} />;
};

// auth/components/AuthForm.tsx - Form logic (200 lines)
// auth/utils/validation.ts - Validation logic (100 lines)
// auth/hooks/useAuthState.ts - State management (80 lines)
```

## 🏗️ Project Structure

### Directory Organization
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups for auth
│   ├── dashboard/         # Main application pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base design system components
│   ├── forms/            # Form-specific components
│   ├── coaching/         # AI coaching components
│   └── layout/           # Layout components
├── lib/                  # Business logic and utilities
│   ├── services/         # External service integrations
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Pure utility functions
│   └── constants/       # Application constants
├── types/               # TypeScript type definitions
│   ├── global.ts        # Global type definitions
│   ├── api.ts          # API response types
│   └── components.ts    # Component prop types
└── styles/             # Styling and theme
    ├── globals.css     # Global CSS
    └── components.css  # Component-specific styles
```

### File Naming Conventions
```typescript
// Pages: PascalCase
page.tsx, layout.tsx, loading.tsx

// Components: PascalCase
Button.tsx, AuthForm.tsx, CoachSelector.tsx

// Utilities: camelCase
validation.ts, apiHelpers.ts, dateUtils.ts

// Types: camelCase with descriptive names
userTypes.ts, coachingTypes.ts, apiTypes.ts

// Constants: SCREAMING_SNAKE_CASE
API_ENDPOINTS.ts, ERROR_MESSAGES.ts
```

## 📝 TypeScript Standards

### Strict Configuration
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Definitions
```typescript
// ✅ Excellent: Comprehensive interface with documentation
interface UserProfile {
  /** Unique identifier for the user */
  uid: string;
  
  /** User's email address - validated and normalized */
  email: string;
  
  /** Display name chosen by user or derived from social login */
  displayName: string;
  
  /** Account creation timestamp */
  createdAt: Timestamp;
  
  /** Last profile update timestamp */
  updatedAt: Timestamp;
  
  /** Health and fitness information */
  healthProfile: HealthProfile;
  
  /** User preferences and settings */
  preferences: UserPreferences;
  
  /** Subscription and billing information */
  subscription: SubscriptionInfo;
}

// ✅ Good: Union types for strict options
type CoachType = 'marcus' | 'serena' | 'alex' | 'riley';
type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

// ✅ Good: Generic types for reusability
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}
```

### Component Props
```typescript
// ✅ Excellent: Well-documented component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  
  /** Icon to display before the button text */
  icon?: React.ReactNode;
  
  /** Button content */
  children: React.ReactNode;
}

// ✅ Good: Default props with TypeScript
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  // Implementation
};
```

## 🎨 Component Standards

### Component Structure
```typescript
// ✅ Excellent component structure
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import type { AuthFormProps } from '@/types/components';

/**
 * Authentication form component with email/password and social login options.
 * Handles validation, error states, and success callbacks.
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  mode = 'signin',
  onSuccess,
  className = ''
}) => {
  // State declarations
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom hooks
  const { signIn, signUp, signInWithGoogle } = useAuth();
  
  // Event handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, mode, signIn, signUp, onSuccess]);
  
  // Effects
  useEffect(() => {
    // Cleanup or initialization logic
  }, []);
  
  // Render
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
      onSubmit={handleSubmit}
    >
      {/* Form content */}
    </motion.form>
  );
};

export default AuthForm;
```

### Custom Hooks Pattern
```typescript
// ✅ Excellent custom hook
import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '@/lib/firebase';
import type { User, UserProfile } from '@/types/user';

/**
 * Custom hook for authentication state and user profile management.
 * Provides authentication methods and real-time user profile updates.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Authentication methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);
  
  const signOut = useCallback(async () => {
    try {
      await auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);
  
  // Effects for auth state listening
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signOut,
    signUp: useCallback(/* implementation */),
    signInWithGoogle: useCallback(/* implementation */)
  };
};
```

## 🎯 Styling Standards

### Tailwind CSS Usage
```typescript
// ✅ Excellent: Semantic class grouping and consistent patterns
const buttonStyles = {
  base: 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    primary: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black shadow-2xl',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl',
    ghost: 'bg-transparent hover:bg-white/10 text-white border-2 border-white/20 hover:border-white/50 backdrop-blur-sm'
  },
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg'
  }
};

// ✅ Good: Conditional classes with clsx
import clsx from 'clsx';

const buttonClass = clsx(
  buttonStyles.base,
  buttonStyles.variants[variant],
  buttonStyles.sizes[size],
  {
    'opacity-50 cursor-not-allowed': disabled,
    'animate-pulse': loading
  },
  className
);
```

### CSS-in-JS for Complex Animations
```typescript
// ✅ Good: Framer Motion for complex animations
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(10px)'
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    filter: 'blur(10px)',
    transition: {
      duration: 0.5
    }
  }
};
```

## 🔧 Utility Functions

### Pure Functions
```typescript
// ✅ Excellent: Pure, testable utility functions
/**
 * Formats a date to a human-readable relative time string.
 * @param date - The date to format
 * @returns Formatted relative time string (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

/**
 * Validates email format using RFC 5322 standard.
 * @param email - Email string to validate
 * @returns True if email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
};
```

### Error Handling
```typescript
// ✅ Excellent: Comprehensive error handling
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Extracts user-friendly error message from various error types.
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    // Firebase Auth errors
    if (error.message.includes('auth/user-not-found')) {
      return 'No account found with this email address.';
    }
    if (error.message.includes('auth/wrong-password')) {
      return 'Incorrect password. Please try again.';
    }
    if (error.message.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists.';
    }
    
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};
```

## 🧪 Testing Standards

### Component Testing
```typescript
// ✅ Excellent: Comprehensive component testing
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../AuthForm';

describe('AuthForm', () => {
  const mockOnSuccess = jest.fn();
  
  beforeEach(() => {
    mockOnSuccess.mockClear();
  });
  
  it('renders sign in form by default', () => {
    render(<AuthForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
  
  it('validates email format before submission', async () => {
    render(<AuthForm onSuccess={mockOnSuccess} />);
    
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
    
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
```

### Utility Testing
```typescript
// ✅ Good: Pure function testing
import { formatRelativeTime, isValidEmail } from '../dateUtils';

describe('formatRelativeTime', () => {
  it('returns "Just now" for very recent dates', () => {
    const now = new Date();
    const recent = new Date(now.getTime() - 30000); // 30 seconds ago
    
    expect(formatRelativeTime(recent)).toBe('Just now');
  });
  
  it('formats minutes correctly', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');
  });
});
```

## 📚 Documentation Standards

### JSDoc Comments
```typescript
/**
 * Generates personalized workout plan based on user profile and preferences.
 * 
 * @param userProfile - Complete user health and fitness profile
 * @param preferences - User workout preferences and constraints
 * @param coachPersona - Selected AI coach personality
 * @returns Promise resolving to generated workout plan
 * 
 * @example
 * ```typescript
 * const plan = await generateWorkoutPlan(
 *   userProfile,
 *   { duration: 45, equipment: ['dumbbells'], difficulty: 'intermediate' },
 *   'marcus'
 * );
 * ```
 * 
 * @throws {ValidationError} When user profile is incomplete
 * @throws {APIError} When external service calls fail
 */
export async function generateWorkoutPlan(
  userProfile: UserProfile,
  preferences: WorkoutPreferences,
  coachPersona: CoachType
): Promise<WorkoutPlan> {
  // Implementation
}
```

## 🔍 Code Review Standards

### Review Checklist
- [ ] **Functionality**: Does the code work as intended?
- [ ] **Readability**: Is the code easy to understand?
- [ ] **Performance**: Are there any performance concerns?
- [ ] **Security**: Are there any security vulnerabilities?
- [ ] **Testing**: Is there adequate test coverage?
- [ ] **Documentation**: Is the code properly documented?
- [ ] **Standards**: Does it follow our coding standards?

### Git Commit Standards
```bash
# ✅ Good commit messages
feat(auth): add social login with Google OAuth
fix(coaching): resolve AI response timeout issues
refactor(ui): extract button variants to design system
docs(api): update authentication endpoint documentation
test(components): add comprehensive AuthForm test suite

# ❌ Bad commit messages
"fixed bug"
"updated stuff"
"wip"
```

## 🚀 Performance Standards

### Bundle Size Monitoring
```typescript
// ✅ Good: Lazy loading for large components
const CoachingDashboard = lazy(() => import('@/components/coaching/Dashboard'));
const WorkoutPlanner = lazy(() => import('@/components/workouts/Planner'));

// ✅ Good: Dynamic imports for utilities
const formatters = {
  date: () => import('@/lib/utils/dateFormatters'),
  currency: () => import('@/lib/utils/currencyFormatters')
};
```

### Memory Management
```typescript
// ✅ Good: Proper cleanup in useEffect
useEffect(() => {
  const subscription = subscribeToMessages(userId, handleNewMessage);
  
  return () => {
    subscription.unsubscribe();
  };
}, [userId]);

// ✅ Good: Memoization for expensive calculations
const memoizedCoachResponse = useMemo(() => {
  return generateCoachPersonality(selectedCoach, userPreferences);
}, [selectedCoach, userPreferences]);
```

---

These code standards ensure that Force Fitness maintains the highest quality codebase while remaining maintainable, scalable, and beautiful. Every developer should internalize these principles and apply them consistently across all contributions.